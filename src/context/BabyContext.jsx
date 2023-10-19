import React, { createContext, useReducer, useContext, useEffect, useMemo } from 'react';
import { openDatabase } from 'expo-sqlite';

// SQLiteデータベースに接続

//＝＝＝＝＝＝＝＝
// Context
//＝＝＝＝＝＝＝＝
const BabyContext = createContext();

export function useBabyContext() {
  return useContext(BabyContext);
}

export function BabyProvider({ children }) {
  //＝＝＝＝＝＝＝＝
  // 初期値設定
  //＝＝＝＝＝＝＝＝

  // initialStateをuseMemoでキャッシュ
  const initialState = useMemo(() => {
    return {
      babyData: ''
    };
  }, []);

  const reducer = (state, action) => {
    if (action.type === "addBaby") {
      // データを追加
      return { babyData: action.babyData };
    }
    // 他のアクションの処理
    return state;
  };
  

  const [babyState, babyDispatch] = useReducer(reducer, initialState);

    // コンポーネントがマウントされたときにSQLiteからデータを取得し、Contextを更新
  useEffect(() => {
    const db = openDatabase('BABY.db');
    db.transaction((tx) => {
      tx.executeSql(
        'PRAGMA table_info(baby_data);',
        [],
        (_, { rows }) => {
        if (rows.length > 0) {
            // テーブルが存在する場合のみSELECT文を実行
            tx.executeSql(
              'SELECT * FROM baby_data',
              [],
              (_, result) => {
              const data = result.rows._array; // クエリ結果を配列に変換
              if (data) {
                babyDispatch({
                  type: 'addBaby',
                  babyData: data,
                });
              }
              },
              (_, error) => {
              console.error('データの取得中にエラーが発生しました:', error);
              }
          );
        } else {
          //console.log('babyDataテーブルが存在しません');
        }
        },
        (_, error) => {
        console.error('テーブルの存在確認中にエラーが発生しました:', error);
        }
      );
      
    });
  }, []); // 初回のみ実行

  const contextValue = useMemo(() => {
    return { babyState, babyDispatch };
  }, [babyState, babyDispatch]);
  
  return (
    <BabyContext.Provider value={contextValue}>
      {children}
    </BabyContext.Provider>
  );
}

