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

    database.transaction(
      (tx) => {
        // テーブルが存在しない場合は作成
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS TestTable (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT)',
          [],
          () => {
            console.log('テーブルが作成されました');
          },
          (error) => {
            console.error('テーブルの作成中にエラーが発生しました:', error);
          }
        );
      },
      (error) => {
        console.error('データベースのオープン中にエラーが発生しました:', error);
      }
    );
  }, []);

  const createTable = () => {
    // テーブルを作成する関数は不要なので削除
  };

  const shareDatabase = async () => {
    try {
      // SQLiteデータベースファイルのURIを取得
      const dbFileUri = FileSystem.documentDirectory + 'DB.db';

      // データベースファイルを共有
      Sharing.shareAsync(dbFileUri)
        .then(() => {
          setMessage('データベースが共有されました');
        })
        .catch((error) => {
          setMessage('共有中にエラーが発生しました');
          console.error('共有中にエラーが発生しました:', error);
        });
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
          'INSERT INTO TestTable (text) VALUES (?)',
          [text],
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
      <Button title="データベースを共有" onPress={shareDatabase} />
      <Button title="テーブルを作成" onPress={createTable} />
      <Button title="データを挿入" onPress={insertData} />
    </View>
  );
}
