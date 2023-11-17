import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, Text } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

export default function TestScreen() {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [db, setDb] = useState(null);

  useEffect(() => {
    // SQLiteデータベースを開くか作成する
    const database = SQLite.openDatabase('BABY.db');
    setDb(database);
  
    // テーブル一覧を取得してログに表示
    database.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table';",
          [],
          (_, resultSet) => {
            const tableNames = resultSet.rows._array.map((table) => table.name);
            console.log("テーブル一覧:", tableNames.join(", "));
          },
          (_, error) => {
            console.error("テーブル一覧の取得中にエラーが発生しました:", error);
          }
        );
      }
    );
  }, []);
  
  const deleteAllTables = () => {
    if (db) {
      db.transaction(
        (tx) => {
          // データベース内の全てのテーブルを取得
          tx.executeSql(
            'SELECT name FROM sqlite_master WHERE type="table";',
            [],
            (_, resultSet) => {
              const tableNames = resultSet.rows._array.map((row) => row.name);
              tableNames.forEach((tableName) => {
                if (tableName !== 'sqlite_sequence') {
                  // sqlite_sequence テーブル以外のテーブルを削除
                  tx.executeSql(
                    `DROP TABLE IF EXISTS ${tableName}`,
                    [],
                    () => {
                      console.log(`テーブル ${tableName} が削除されました`);
                    },
                    (error) => {
                      console.error(`テーブル ${tableName} の削除中にエラーが発生しました:`, error);
                    }
                  );
                }
              });
            },
            (error) => {
              setMessage('テーブルの取得中にエラーが発生しました');
              console.error('テーブルの取得中にエラーが発生しました:', error);
            }
          );
        }
      );
    }
  };
  
  const shareDatabaseAsJSON = async () => {
    try {
      // SQLiteデータベースからデータを取得
      db.transaction(
        (tx) => {
          tx.executeSql(
            //'SELECT * FROM CommonRecord_2023_11',
            'SELECT * FROM DiseaseRecord_2023_11',
            [],
            (_, resultSet) => {
              const data = resultSet.rows._array; // データをJSON形式に変換
              const jsonData = JSON.stringify(data, null, 2); // インデントを追加して読みやすくする
              // JSONデータを一時ファイルに書き込み
              const filePath = FileSystem.cacheDirectory + 'database.json';
              FileSystem.writeAsStringAsync(filePath, jsonData, { encoding: FileSystem.EncodingType.UTF8 })
                .then(() => {
                  // ファイルを共有
                  Sharing.shareAsync(filePath)
                    .then(() => {
                      setMessage('データベースがJSON形式で共有されました');
                    })
                    .catch((error) => {
                      setMessage('共有中にエラーが発生しました');
                      console.error('共有中にエラーが発生しました:', error);
                    });
                })
                .catch((error) => {
                  setMessage('ファイルの書き込み中にエラーが発生しました');
                  console.error('ファイルの書き込み中にエラーが発生しました:', error);
                });
            },
            (_, error) => {
              setMessage('データの取得中にエラーが発生しました');
              console.error('データの取得中にエラーが発生しました:', error);
            }
          );
        }
      );
    } catch (error) {
      setMessage('共有中にエラーが発生しました');
      console.error('共有中にエラーが発生しました:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{message}</Text>
      <Button title="テーブルを削除" onPress={deleteAllTables} />
      <Button title="データベースをJSON形式で共有" onPress={shareDatabaseAsJSON} />
    </View>
  );
}
