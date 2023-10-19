import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore';
import * as SQLite from 'expo-sqlite';
import { ProgressBar, Colors } from 'react-native-paper'; // ProgressBarを追加
import Loading from '../components/Loading';

import Button from '../components/Button';

export default function BackupScreen() {

  const { currentUser } = firebase.auth();
  const [backupInProgress, setBackupInProgress] = useState(false); // バックアップ中かどうかを管理するstate
  const [isLoading, setLoading] = useState(false);

  // テーブルごとにデータを変換するための関数を定義
  function convertTableDataToFirestoreData(tableName, data) {
    const tableNamePatternCommonRecord = /CommonRecord_\d{4}_\d{2}/;
    const tableNamePatternMilkRecord = /MilkRecord_\d{4}_\d{2}/;
    const tableNamePatternFoodRecord = /FoodRecord_\d{4}_\d{2}/;
    const tableNamePatternToiletRecord = /ToiletRecord_\d{4}_\d{2}/;
    const tableNamePatternDiseaseRecord = /DiseaseRecord_\d{4}_\d{2}/;
    const tableNamePatternFreeRecord = /FreeRecord_\d{4}_\d{2}/;

    if (tableName === 'baby_data') {
      return data.map((item) => ({
        name: item.name,
        birthday: firebase.firestore.Timestamp.fromDate(new Date(item.birthday)),
        baby_id: item.baby_id,
      }));
    } else if (tableName === 'current_baby') {
      return data.map((item) => ({
        name: item.name,
        birthday: firebase.firestore.Timestamp.fromDate(new Date(item.birthday)),
        baby_id: item.baby_id,
      }));
    } else if (tableName.match(tableNamePatternCommonRecord)) {
      return data.map((item) => ({
        record_id: item.record_id,
        baby_id: item.baby_id,
        day: item.day,
        category: item.category,
        record_time: firebase.firestore.Timestamp.fromDate(new Date(item.record_time)),
        memo: item.memo || '',
      }));
    } else if (tableName.match(tableNamePatternMilkRecord)) {
      return data.map((item) => ({
        record_id: item.record_id,
        milk: item.milk || 0,
        bonyu: item.bonyu || 0,
        junyu_left: item.junyu_left || 0,
        junyu_right: item.junyu_right || 0,
      }));
    } else if (tableName.match(tableNamePatternFoodRecord)) {
      return data.map((item) => ({
        record_id: item.record_id,
        food: item.food || 0,
        drink: item.drink || 0,
        foodAmount: item.foodAmount || 0,
        drinkAmount: item.drinkAmount || 0,
      }));
    } else if (tableName.match(tableNamePatternToiletRecord)) {
      return data.map((item) => ({
        record_id: item.record_id,
        oshikko: item.oshikko || 0,
        unchi: item.unchi || 0,
      }));
    } else if (tableName.match(tableNamePatternDiseaseRecord)) {
      return data.map((item) => ({
        record_id: item.record_id,
        hanamizu: item.hanamizu || 0,
        seki: item.seki || 0,
        oto: item.oto || 0,
        hosshin: item.hosshin || 0,
        kega: item.kega || 0,
        kusuri: item.kusuri || 0,
        body_temperature: item.body_temperature || 0,
      }));
    } else if (tableName.match(tableNamePatternFreeRecord)) {
      return data.map((item) => ({
        record_id: item.record_id,
        free_text: item.free_text,
      }));
    }
    // 他のテーブルに対するデータ変換処理も同様に追加
  }

  const saveAllTableDataToFirestore = async () => {
    setLoading(true); // バックアップが開始されたことをマーク
    const database = SQLite.openDatabase('BABY.db');
  
    try {
      // SQLiteのデータベースからテーブル名を取得
      const tableNames = await new Promise((resolve, reject) => {
        database.transaction(
          (tx) => {
            tx.executeSql(
              "SELECT name FROM sqlite_master WHERE type='table';",
              [],
              (_, resultSet) => {
                const names = resultSet.rows._array.map((row) => row.name);
                resolve(names);
              },
              (_, error) => {
                reject(error);
              }
            );
          }
        );
      });

      const firestore = firebase.firestore();

      // テーブルごとにデータを取得してFirestoreに保存
      await Promise.all(tableNames.map(async (tableName) => {
        const sqliteData = await new Promise((resolve, reject) => {
          database.transaction(
            (tx) => {
              tx.executeSql(
                `SELECT * FROM ${tableName}`,
                [],
                (_, resultSet) => {
                  const data = resultSet.rows;
                  resolve(data);
                },
                (_, error) => {
                  reject(error);
                }
              );
            }
          );
        });

        const firestoreTimestampData = convertTableDataToFirestoreData(tableName, sqliteData._array);
  
        // データが空でない場合のみFirestoreに保存
        if (firestoreTimestampData && firestoreTimestampData.length > 0) {
          const collectionRef = firestore.collection(`users/${currentUser.uid}/${tableName}`);

          // コレクション内のすべてのドキュメントを削除
          await collectionRef.get().then(async (querySnapshot) => {
            const deletePromises = [];
            querySnapshot.forEach((doc) => {
              deletePromises.push(doc.ref.delete());
            });
            await Promise.all(deletePromises);
          });

          await Promise.all(firestoreTimestampData.map(async (item) => {
            let collectionName;
            if (tableName === 'baby_data') {
              collectionName = item.baby_id.toString();
            } else if (tableName === 'current_baby') {
              collectionName = item.baby_id.toString();
            } else {
              collectionName = item.record_id.toString();
            }
            await collectionRef.doc(collectionName).set({
              ...item,
            });
          }));
        }
      }));

      Alert.alert("バックアップの作成が完了しました");
    } catch (error) {
      console.error('Firestoreへのデータの保存中にエラーが発生しました:', error);
    } finally {
      setLoading(false); // バックアップが完了したことをマーク
    }
  };

  return (
    <View style={styles.container}>
      <Loading isLoading={isLoading} />
      <View style={styles.inner}>
        <Text style={styles.title}>バックアップ</Text>
        <Button
          label="バックアップ作成"
          onPress={saveAllTableDataToFirestore}
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
  progressBar: {
    marginTop: 16, // ProgressBarのスタイルを調整
  },
});
