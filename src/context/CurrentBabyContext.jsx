import React, { createContext, useReducer, useContext, useEffect, useMemo } from 'react';
import { openDatabase } from 'expo-sqlite';

// SQLiteデータベースに接続

//＝＝＝＝＝＝＝＝
// Context
//＝＝＝＝＝＝＝＝
const CurrentBabyContext = createContext();

export function useCurrentBabyContext() {
  return useContext(CurrentBabyContext);
}

export function CurrentBabyProvider({ children }) {
  //＝＝＝＝＝＝＝＝
  // 初期値設定
  //＝＝＝＝＝＝＝＝

  // initialStateをuseMemoでキャッシュ
  const initialState = useMemo(() => {
    return {
        name: '',
        birthday: '',
        baby_id: '',
    };
  }, []);

  const reducer = (state, action) => {
    //＝＝＝＝＝＝＝＝
    // 設定中赤ちゃん変更処理
    //＝＝＝＝＝＝＝＝
    if (action.type === "addBaby") {
      // SQLiteにデータを保存
      const db = openDatabase('BABY.db');
      db.transaction(
        (tx) => {
          tx.executeSql(
            'UPDATE current_baby SET name = ?, birthday = ?, baby_id = ?',
            [action.name, action.birthday, action.baby_id],
            (_, result) => {
              // データが保存されたらContextを更新
            },
            (_, error) => {
              console.error('データの保存中にエラーが発生しました:', error);
            }
          );
        }
      );
      state.name = action.name;
      state.birthday = action.birthday;
      state.baby_id = action.baby_id;
      return { name: state.name, birthday: state.birthday, baby_id: state.baby_id };
    }

    // 他のアクションの処理
    //return state;
  };
  

  const [currentBabyState, currentBabyDispatch] = useReducer(reducer, initialState);

    // コンポーネントがマウントされたときにSQLiteからデータを取得し、Contextを更新
  useEffect(() => {
    const db = openDatabase('BABY.db');
    db.transaction((tx) => {
      tx.executeSql(
        'PRAGMA table_info(current_baby);',
        [],
        (_, { rows }) => {
        if (rows.length > 0) {
            // テーブルが存在する場合のみSELECT文を実行
            tx.executeSql(
              'SELECT * FROM current_baby LIMIT 1',
              [],
              (_, result) => {
              const data = result.rows.item(0);
              if (data) {
                  currentBabyDispatch({
                    type: 'addBaby',
                    name: data.name,
                    birthday: data.birthday,
                    baby_id: data.baby_id,
                  });
              }
              },
              (_, error) => {
              console.error('データの取得中にエラーが発生しました:', error);
              }
          );
        } else {
            //console.log('ToiletRecordテーブルが存在しません');
        }
        },
        (_, error) => {
        console.error('テーブルの存在確認中にエラーが発生しました:', error);
        }
      );
      
    });
  }, []); // 初回のみ実行

  const contextValue = useMemo(() => {
    return { currentBabyState, currentBabyDispatch };
  }, [currentBabyState, currentBabyDispatch]);
  
  return (
    <CurrentBabyContext.Provider value={contextValue}>
      {children}
    </CurrentBabyContext.Provider>
  );
}

