import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore';
import * as SQLite from 'expo-sqlite';
import { useCurrentBabyContext } from '../context/CurrentBabyContext';
import Button from '../components/Button';

export default function BabyAddScreen(props) {
  const { navigation } = props;
  const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();

  const [db, setDb] = useState(null);

  const { currentUser } = firebase.auth();

  useEffect(() => {
    // SQLiteデータベースを開くか作成する
    const database = SQLite.openDatabase('DB.db');
    setDb(database);

    database.transaction(
      (tx) => {
        // テーブルが存在しない場合は作成
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS babyData (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, birthday DATETIME)',
          [],
          () => {
            console.log('テーブルが作成されました');
          },
          (error) => {
            console.error('テーブルの作成中にエラーが発生しました:', error);
          }
        );
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS currentBaby (id INTEGER PRIMARY KEY, name TEXT, birthday DATETIME)',
          [],
          () => {
            console.log('テーブルが作成されました');
          },
          (error) => {
            console.error('テーブルの作成中にエラーが発生しました:', error);
          }
        );
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS CommonRecord_2023_10 (record_id INTEGER PRIMARY KEY, baby_id INTEGER, day INTEGER, category TEXT NOT NULL, record_time DATETIME NOT NULL, memo TEXT, FOREIGN KEY (record_id) REFERENCES CommonRecord_2023_10(record_id))',
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

  function convertToFirestoreTimestamp(data) {
    return data.map((item) => ({
      name: item.name,
      birthday: firebase.firestore.Timestamp.fromDate(new Date(item.birthday)),
      id: item.id,
    }));
  }

  const saveBabyDataToFirestore = async () => {
    const firestore = firebase.firestore();
  
    try {
      // SQLiteのbabyDataテーブルからbirthdayを取得
      const sqliteBirthday = await new Promise((resolve, reject) => {
        db.transaction(
          (tx) => {
            tx.executeSql(
              'SELECT * FROM babyData',
              [],
              (_, resultSet) => {
                const data = resultSet.rows;//.item(0).birthday;
                resolve(data);
              },
              (_, error) => {
                reject(error);
              }
            );
          }
        );
      });
      // 日付データをFirestore Timestampに変換
      const firestoreTimestampData = convertToFirestoreTimestamp(sqliteBirthday._array);
      
      // Firestoreのコレクションへの参照を取得
      const collectionRef = firestore.collection(`users/${currentUser.uid}/babyData`);

      // コレクション内のすべてのドキュメントを削除
      await collectionRef.get().then(async (querySnapshot) => {
        const deletePromises = [];
        querySnapshot.forEach((doc) => {
          // 削除処理をPromiseとして配列に追加
          deletePromises.push(doc.ref.delete());
        });
        // すべての削除処理を待機
        await Promise.all(deletePromises);
      });

      // データを一括で保存
      await Promise.all(firestoreTimestampData.map(async (item) => {
        // ドキュメント名を指定してデータを追加
        await collectionRef.doc(item.id.toString()).set({
          name: item.name,
          birthday: item.birthday,
          id: item.id,
        });
      }));
      Alert.alert("データがFirestoreに保存されました");
    } catch (error) {
      console.error('Firestoreへの保存中にエラーが発生しました:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>テスト画面</Text>
        <Button
          label="Firestoreに登録"
          onPress={saveBabyDataToFirestore}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  inner: {
    paddingHorizontal: 27,
    paddingVertical: 24,
  },
  inputText: {
    fontSize: 15,
    lineHeight: 32,
    marginBottom: 1,
    color: '#737373',
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    fontSize: 16,
    height: 48,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  birthdayInput: {
    fontSize: 16,
    height: 48,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    lineHeight: 48,
  },
  buttonArea: {
    flexDirection: 'row',
  },
});
