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
    const database = SQLite.openDatabase('DB.db');
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
  
  const createTable = () => {
    if (db) {
      db.transaction(
        (tx) => {
          // テーブル削除
          tx.executeSql(
            'DROP TABLE IF EXISTS ToiletRecord_2023_09',
            [],
            () => {
              console.log('古いテーブルが削除されました');
            },
            (error) => {
              setMessage('古いテーブルの削除中にエラーが発生しました');
              console.error('古いテーブルの削除中にエラーが発生しました:', error);
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
            'SELECT * FROM ToiletRecord_2023_10',
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

  const insertData = () => {
    // テキストをデータベースに挿入
    db.transaction(
      (tx) => {
        tx.executeSql(
          'INSERT INTO babyData (name, birthday) VALUES (?, ?)',
          [text, '201112319999'],
          (_, result) => {
            setMessage('データがテーブルに挿入されました');
          },
          (_, error) => {
            setMessage('データの挿入中にエラーが発生しました');
            console.error('データの挿入中にエラーが発生しました:', error);
          }
        );
      }
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {db ? (
        <Text>DBが作成されました</Text>
      ) : (
        <Text>データベースの作成中...</Text>
      )}
      <Text>{message}</Text>
      <TextInput
        style={{ width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        onChangeText={setText}
        value={text}
        placeholder="テキストを入力してください"
      />
      <Button title="テーブルを削除して再作成" onPress={createTable} />
      <Button title="データベースをJSON形式で共有" onPress={shareDatabaseAsJSON} />
      <Button title="データを挿入" onPress={insertData} />
    </View>
  );
}
