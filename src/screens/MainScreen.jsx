import React, { useEffect, useState }  from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native'
import * as SQLite from 'expo-sqlite'; // SQLiteをインポート
import firebase from 'firebase';

import MilkAddButton from '../components/AddButton/MilkAddButton';
import ToiletAddButton from '../components/AddButton/ToiletAddButton';
import DiseaseAddButton from '../components/AddButton/DiseaseAddButton';
import FoodAddButton from '../components/AddButton/FoodAddButton';
import FreeAddButton from '../components/AddButton/FreeAddButton';
import ModalSelectBaby from '../components/ModalSelectBaby';

import Datetime from '../components/Datetime';
import TableTitle from '../components/TableTitle';
import CreateData from '../components/CreateData';
import DailyTable from '../components/DailyTable';

import { useBabyContext } from '../context/BabyContext';
import { useDateTimeContext } from '../context/DateTimeContext';
import { useBabyRecordContext } from '../context/BabyRecordContext';
import { useCurrentBabyContext } from '../context/CurrentBabyContext';

export default function MainScreen(props) {
    const { baby } = useBabyContext();
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();
    const { dateTimeState, dateTimeDispatch } = useDateTimeContext();
    const { babyRecordState, babyRecordDispatch } = useBabyRecordContext();

    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [birthday, setBirthday] = useState('');
    const babyData = [];
    const isFocused = useIsFocused()
    
    const [todayData, setTodayData] = useState([]);
    const [babyRecord, setBabyRecord] = useState([]);
    const [day, setDay] = useState(dateTimeState.day);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setName()
        setBirthday()
        setId()
        loadBabyData();
    }, [currentBabyState, dateTimeState, todayData, isFocused]);



    
    const [todayData2, setTodayData2] = useState([]);
    // SQLiteからデータを取得する関数
    const database = SQLite.openDatabase('DB.db');
    const loadBabyData = () => {
        database.transaction((tx) => {
            // テーブルの存在を確認
            tx.executeSql(
                'PRAGMA table_info(ToiletRecord_' + dateTimeState.year + '_' + String(dateTimeState.month).padStart(2, '0') + ');',
                [],
                (_, { rows }) => {
                if (rows.length > 0) {
                    // テーブルが存在する場合のみSELECT文を実行
                    tx.executeSql(
                    'SELECT * FROM ToiletRecord_' + dateTimeState.year + '_' + String(dateTimeState.month).padStart(2, '0') + ' WHERE babyId = ? AND day = ?;',
                    [currentBabyState.id, dateTimeState.day],
                    (_, { rows }) => {
                        const data = rows._array; // クエリ結果を配列に変換
                        setTodayData2(data);
                    },
                    (_, error) => {
                        console.error('データの取得中にエラーが発生しました:', error);
                    }
                    );
                } else {
                    console.log('テーブルが存在しません');
                }
                },
                (_, error) => {
                console.error('テーブルの存在確認中にエラーが発生しました:', error);
                }
            );
        });
    };

    if(baby !== "") {
        baby.forEach((doc) => {
            const data = doc.data();
            babyData.push({
                id: doc.id,
                babyName: data.babyName,
                birthday: data.birthday,
            });
        });
    }

    useEffect(() => {
        setLoading(true);
        const cleanupFuncs = {
            auth: () => {},
            memos: () => {},
        };
        cleanupFuncs.auth = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                if(currentBabyState.id !== '') {
                    const db = firebase.firestore();
                    const ref = db.collection(`users/${user.uid}/babyData`).doc(currentBabyState.id.toString())
                    .collection(`${dateTimeState.year}_${dateTimeState.month}`).orderBy('updatedAt', 'asc');
                    //.collection(`${dateTimeState.year}/${dateTimeState.month}/${dateTimeState.day}`).orderBy('updatedAt', 'asc');
                    cleanupFuncs.memos = ref.onSnapshot((snapshot) => {
                    const userMemos = [];
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        userMemos.push({
                            id: doc.id,
                            timeLeft: data.timeLeft,
                            timeRight: data.timeRight,
                            milk: data.milk,
                            category: data.category,
                            bonyu: data.bonyu,
                            toilet: data.toilet,
                            disease: data.disease,
                            bodyTemperature: data.bodyTemperature,
                            food: data.food,
                            freeText: data.freeText,
                            bodyText: data.bodyText,
                            selectBaby: data.selectBaby,
                            day: data.day,
                            updatedAt: data.updatedAt.toDate(),
                        });
                    });
                    setTodayData(userMemos.filter((memo) => memo.day == [dateTimeState.day]));
                    //setTodayData(userMemos);
                    babyRecordDispatch({ type: "return", data: babyRecord})
                    setLoading(false);
                    }, () => {
                    setLoading(false);
                    });
                }
            } else {
                firebase.auth().signInAnonymously()
                .catch(() => {
                    Alert.alert('エラー', 'アプリを再起動してください');
                })
                .then(() => { setLoading(false); });
            }
        });
        return () => {
            cleanupFuncs.auth();
            cleanupFuncs.memos();
        };
    }, [currentBabyState.id, dateTimeState]);

    if (babyData.length == 0) {
        return (
            <View style={styles.container}>
                <View style={[emptyStyles.inner, {height: '100%'}]}>
                    <Text style={emptyStyles.title}>最初に赤ちゃんを登録してください</Text>
                </View>
            </View>
        );
    }

    if (todayData2.length === 0) {
        return (
            <View style={styles.container}>
                <View style={[styles.dateTime , {height: '15%'}]}>
                    <Datetime style={styles.dateTime} />
                </View>
                <View style={{height: '5%'}}>
                    <View style={styles.tableTitle}>
                        <TableTitle title = '時間' />
                        <TableTitle title = '種類' />
                        <TableTitle title = '記録' />
                        <TableTitle title = 'メモ' />
                    </View>
                </View>
                <View style={[emptyStyles.inner, {height: '40%'}]}>
                    <Text style={emptyStyles.title}>最初の記録を登録してください</Text>
                </View>
                <View style={[styles.footer , {height: '40%'}]}>
                    <View style={styles.button}>
                        <DailyTable todayData={todayData} />
                    </View>
                    <View style={styles.button}>
                        <DiseaseAddButton />
                        <ToiletAddButton />
                        <FoodAddButton />
                        <MilkAddButton />
                    </View>
                    <View style={styles.button}>
                        <FreeAddButton />
                        <FreeAddButton />
                        <FreeAddButton />
                        <ModalSelectBaby />
                    </View>
                </View>
            </View>
        );
    }
    
    return (
        <View style={styles.container}>
            <View style={[styles.dateTime , {height: '15%'}]}>
                <Datetime style={styles.dateTime} />
            </View>
            <View style={{height: '5%'}}>
                <View style={styles.tableTitle}>
                    <TableTitle title = '時間' />
                    <TableTitle title = '種類' />
                    <TableTitle title = '記録' />
                    <TableTitle title = 'メモ' />
                </View>
            </View>
            <View style={{height: '40%'}}>
                <CreateData todayData2={todayData2} />
            </View>
            <View style={[styles.footer , {height: '40%'}]}>
                <View style={styles.button}>
                    <DailyTable todayData={todayData} />
                </View>
                <View style={styles.button}>
                    <DiseaseAddButton />
                    <ToiletAddButton />
                    <FoodAddButton />
                    <MilkAddButton />
                </View>
                <View style={styles.button}>
                    <FreeAddButton />
                    <FreeAddButton />
                    <FreeAddButton />
                    <ModalSelectBaby />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8',
    },
    footer: {
        //height:'25%',
        //width:'100%',
        //position:'absolute',
        //bottom: 0,
        borderTopWidth: 1,
        borderTopColor : 'rgba(0, 0, 0, 100)',
        //paddingBottom: 50,
        //backgroundColor: '#937720',
        //textAlign: 'center',
        justifyContent: 'center',
        //alignItems: 'center',
    },
    dateTime: {
        //backgroundColor: '#ffffff',
        //flexDirection: 'row',
        //paddingVertical: 16,
        //justifyContent: 'center',
        //borderTopWidth: 0.5,
        //borderBottomWidth: 0.5,
        //borderTopColor : 'rgba(0, 0, 0, 100)',
        //borderBottomColor: 'rgba(0, 0, 0, 100)',
        //height: 50,
        //marginBottom:1,
        //marginBottom:1,
        //textAlign: 'center',
        justifyContent: 'center',
        //alignItems: 'center',
        //position: 'absolute',
        //marginTop: 'auto',
        //marginBottom: 'auto',
        //fontSize: 30,
    },
    tableTitle: {
        flexDirection: 'row',
    },
    button: {
        flexDirection: 'row',
        //paddingLeft: 'auto',
        //paddingRight: 'auto',
        marginBottom: 'auto',
        marginTop: 'auto',
        alignItems: 'center',
        justifyContent: 'space-around',//横並び均等配置
        //backgroundColor: 'red',
    },
});

const emptyStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inner: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        marginBottom: 24,
    },
    button: {
        alignSelf: 'center',
    }
});
