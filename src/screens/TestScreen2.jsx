import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import firebase from 'firebase/app';
import 'firebase/firestore';
import * as SQLite from 'expo-sqlite';
import { useCurrentBabyContext } from '../context/CurrentBabyContext';
import Button from '../components/Button';

export default function BabyAddScreen(props) {
  const { navigation } = props;
  const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [birthday, setBirthday] = useState();
  const [detailTime, setDetailTime] = useState('誕生日を選択');
  const [babyName, setBabyName] = useState('');
  const [message, setMessage] = useState('');
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
          'CREATE TABLE IF NOT EXISTS babyData (id INTEGER PRIMARY KEY AUTOINCREMENT, babyName TEXT, birthday DATETIME)',
          [],
          () => {
            console.log('テーブルが作成されました');
          },
          (error) => {
            console.error('テーブルの作成中にエラーが発生しました:', error);
          }
        );
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS currentBaby (id INTEGER PRIMARY KEY AUTOINCREMENT, babyName TEXT, birthday DATETIME)',
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

  const handleBabyRegistration = () => {
    if (babyName !== "" && birthday !== undefined) {
      Alert.alert(
        "データを保存しますか？",
        "",
        [
          {
            text: "キャンセル",
            onPress: () => {},
            style: "cancel"
          },
          {
            text: "保存",
            onPress: () => {
              // SQLiteに赤ちゃんデータを保存
              saveBabyDataToSQLite();

              // Firestoreに赤ちゃんデータを保存
              saveBabyDataToFirestore();
            }
          }
        ]
      );
    } else {
      Alert.alert("未入力です");
    }
  };

  const saveBabyDataToSQLite = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'INSERT INTO babyData (babyName, birthday) VALUES (?, ?)',
          [babyName, new Date(birthday).toISOString()], // Firestore Timestampに変換した日付を保存
          (_, result) => {
            setMessage('データがテーブルに挿入されました');
          },
          (_, error) => {
            setMessage('データの挿入中にエラーが発生しました');
            console.error('データの挿入中にエラーが発生しました:', error);
          }
        );
        tx.executeSql(
          'INSERT INTO currentBaby (babyName, birthday) VALUES (?, ?)',
          [babyName, new Date(birthday).toISOString()], // Firestore Timestampに変換した日付を保存
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

  function convertToFirestoreTimestamp(data) {
    return data.map((item) => ({
      babyName: item.babyName,
      birthday: firebase.firestore.Timestamp.fromDate(new Date(item.birthday)),
      id: item.id,
    }));
  }

  const saveBabyDataToFirestore = async () => {
    const firestore = firebase.firestore();
  
    try {
      // Firestoreのコレクションへの参照を取得
      const collectionRef = firestore.collection(`users/${currentUser.uid}/babyData`);
  
      // SQLiteのbabyDataテーブルからbirthdayを取得
      const sqliteBirthday = await new Promise((resolve, reject) => {
        db.transaction(
          (tx) => {
            tx.executeSql(
              'SELECT * FROM babyData',
              [babyName],
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
      console.log(firestoreTimestampData)
      
      // データを一括で保存
      await Promise.all(firestoreTimestampData.map(async (item) => {
        // ドキュメントを追加
        await collectionRef.add({
          babyName: item.babyName,
          birthday: item.birthday,
          id: item.id,
        });
      }));
  
      
      Alert.alert("データがFirestoreに保存されました");
    } catch (error) {
      console.error('Firestoreへの保存中にエラーが発生しました:', error);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const formatDatetime = (date) => {
    setDetailTime(date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日');
  };

  const handleConfirm = (date) => {
    setBirthday(date);
    formatDatetime(date);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>赤ちゃん登録</Text>
        <Text style={styles.inputText}>名前</Text>
        <TextInput
          style={styles.input}
          value={babyName}
          onChangeText={(text) => { setBabyName(text); }}
          autoCapitalize="none"
          keyboardType="default"
          placeholder="入力してください"
          placeholderTextColor="#BFBFBF"
        />
        <Text style={styles.inputText}>誕生日</Text>
        <TouchableOpacity style={styles.birthdayArea} onPress={showDatePicker}>
          <Text style={styles.birthdayInput}>{detailTime}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          value={birthday}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          mode="date"
          locale='ja'
          display="spinner"
          confirmTextIOS="決定"
          cancelTextIOS="キャンセル"
          minuteInterval={5}
          headerTextIOS=""
          textColor="blue"
          date={birthday}
        />
        <Button
          label="赤ちゃん登録"
          onPress={handleBabyRegistration}
        />
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
