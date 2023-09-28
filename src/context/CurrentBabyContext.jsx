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
        id: '',
    };
  }, []);

  const reducer = (state, action) => {
    //＝＝＝＝＝＝＝＝
    // 設定中赤ちゃん変更処理
    //＝＝＝＝＝＝＝＝
    if (action.type === "addBaby") {
      // SQLiteにデータを保存
      const db = openDatabase('DB.db');
      db.transaction(
        (tx) => {
          tx.executeSql(
            'UPDATE currentBaby SET name = ?, birthday = ?, id = ?',
            [action.name, action.birthday, action.id],
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
      state.id = action.id;
      return { name: state.name, birthday: state.birthday, id: state.id };
    }

    // 他のアクションの処理
    //return state;
  };
  

  const [currentBabyState, currentBabyDispatch] = useReducer(reducer, initialState);

    // コンポーネントがマウントされたときにSQLiteからデータを取得し、Contextを更新
  useEffect(() => {
    const db = openDatabase('DB.db');
    db.transaction((tx) => {
    tx.executeSql(
        'SELECT * FROM currentBaby LIMIT 1',
        [],
        (_, result) => {
        const data = result.rows.item(0);
        if (data) {
            currentBabyDispatch({
              type: 'addBaby',
              name: data.name,
              birthday: data.birthday,
              id: data.id,
            });
        }
        },
        (_, error) => {
        console.error('データの取得中にエラーが発生しました:', error);
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

