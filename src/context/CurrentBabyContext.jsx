import React, { createContext, useReducer, useContext, useEffect,useState, useMemo } from 'react';
import { openDatabase } from 'expo-sqlite';

// SQLiteデータベースに接続
const db = openDatabase('DB.db'); // データベース名を適切に設定

//＝＝＝＝＝＝＝＝
// Context
//＝＝＝＝＝＝＝＝
const CurrentBabyContext = createContext();

export function useCurrentBabyContext() {
  return useContext(CurrentBabyContext);
}

export function CurrentBabyProvider({ children }) {
  //const [currentBaby, setCurrentBaby] = useState('');

  const currentBaby = [];

  //＝＝＝＝＝＝＝＝
  // 初期値設定
  //＝＝＝＝＝＝＝＝

  // initialStateをuseMemoでキャッシュ
  const initialState = useMemo(() => {
    return {
        currentBaby: currentBaby,
    };
  }, [currentBaby]);

  const reducer = (state, action) => {

    //＝＝＝＝＝＝＝＝
    // 設定中赤ちゃん変更処理
    //＝＝＝＝＝＝＝＝
    if (action.type === "addBaby") {
      // SQLiteにデータを保存
      //console.log(action.currentBaby)
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE currentBaby SET name = ?, birthday = ?, id = ?',
          //'INSERT INTO currentBaby (name, birthday, Id) VALUES (?, ?, ?)',
          [action.currentBaby.name, action.currentBaby.birthday, action.currentBaby.id],
          (_, result) => {
            // データが保存されたらContextを更新
            //state.name = action.name;
            //state.bBirthday = action.birthday;
            //state.id = action.id;
            //state.currentBaby = action.currentBaby;
            currentBaby.push(action.currentBaby[0])
            //console.log(action.currentBaby)
            
          },
          (_, error) => {
            console.error('データの保存中にエラーが発生しました:', error);
          }
        );
      });
      return { currentBaby: state.currentBaby };
    }

    // 他のアクションの処理
    //return state;
  };

  const [currentBabyState, currentBabyDispatch] = useReducer(reducer, initialState);

    // コンポーネントがマウントされたときにSQLiteからデータを取得し、Contextを更新
  useEffect(() => {
    db.transaction((tx) => {
    tx.executeSql(
        'SELECT * FROM currentBaby LIMIT 1',
        [],
        (_, result) => {
        const data = result.rows.item(0);
        if (data) {
            //currentBabyDispatch({
              //type: 'addBaby',
              //name: data.name,
              //birthday: data.birthday,
              //id: data.Id,
              //currentBaby: data,
            //});
            //setCurrentBaby(data)
            currentBaby.push(data)
            
            //console.log(data)
        }
        },
        (_, error) => {
        console.error('データの取得中にエラーが発生しました:', error);
        }
    );
    });
}, [currentBaby]); // 初回のみ実行

  const contextValue = useMemo(() => {
    return { currentBabyState, currentBabyDispatch };
  }, [currentBabyState, currentBabyDispatch]);
  
  return (
    <CurrentBabyContext.Provider value={contextValue}>
      {children}
    </CurrentBabyContext.Provider>
  );

}
