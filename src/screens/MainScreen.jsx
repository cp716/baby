import React, { useEffect, useState }  from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

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

import { useDateTimeContext } from '../context/DateTimeContext';
import { useBabyRecordContext } from '../context/BabyRecordContext';
import { useCurrentBabyContext } from '../context/CurrentBabyContext';

export default function MainScreen(props) {
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();
    const { dateTimeState, dateTimeDispatch } = useDateTimeContext();
    const { babyRecordState, babyRecordDispatch } = useBabyRecordContext();

    const [todayData, setTodayData] = useState([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        loadBabyData();
    }, [currentBabyState, dateTimeState]);
    
    const [toiletData, setToiletData] = useState([]);
    const [foodData, setFoodData] = useState([]);

    const commonRecordTable = `CommonRecord_${dateTimeState.year}_${String(dateTimeState.month).padStart(2, '0')}`;
    const toiletRecordTable = `ToiletRecord_${dateTimeState.year}_${String(dateTimeState.month).padStart(2, '0')}`;
    const foodRecordTable = `FoodRecord_${dateTimeState.year}_${String(dateTimeState.month).padStart(2, '0')}`;

    // SQLiteからデータを取得する関数
    const database = SQLite.openDatabase('DB.db');
    const loadBabyData = () => {
        database.transaction((tx) => {
            // テーブルの存在を確認
            tx.executeSql(
                'PRAGMA table_info(' + toiletRecordTable + ');',
                [],
                (_, { rows }) => {
                if (rows.length > 0) {
                    // テーブルが存在する場合のみSELECT文を実行
                    tx.executeSql(
                        'SELECT CommonRecord_2023_10.*, ' + toiletRecordTable + '.oshikko, ' + toiletRecordTable + '.unchi FROM ' + commonRecordTable + ' LEFT JOIN ' + toiletRecordTable + ' ON ' + commonRecordTable + '.record_id = ' + toiletRecordTable + '.record_id WHERE ' + commonRecordTable + '.day = ? AND ' + commonRecordTable + '.baby_id = ?;',
                        [dateTimeState.day, currentBabyState.id],
                        (_, { rows }) => {
                            const data = rows._array; // クエリ結果を配列に変換
                            setToiletData(data.filter(item => item.category === 'TOILET'))
                        },
                        (_, error) => {
                            console.error('データの取得中にエラーが発生しました:', error);
                            // エラー詳細情報をコンソールに表示する
                            console.log('エラー詳細:', error);
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
            tx.executeSql(
                'PRAGMA table_info(' + foodRecordTable + ');',
                [],
                (_, { rows }) => {
                if (rows.length > 0) {
                    // テーブルが存在する場合のみSELECT文を実行
                    tx.executeSql(
                        'SELECT CommonRecord_2023_10.*, ' + foodRecordTable + '.food, ' + foodRecordTable + '.drink, ' + foodRecordTable + '.foodAmount, ' + foodRecordTable + '.drinkAmount FROM ' + commonRecordTable + ' LEFT JOIN ' + foodRecordTable + ' ON ' + commonRecordTable + '.record_id = ' + foodRecordTable + '.record_id WHERE ' + commonRecordTable + '.day = ? AND ' + commonRecordTable + '.baby_id = ?;',
                        [dateTimeState.day, currentBabyState.id],
                        (_, { rows }) => {
                            const data = rows._array; // クエリ結果を配列に変換
                            setFoodData(data.filter(item => item.category === 'FOOD'));
                        },
                        (_, error) => {
                            console.error('データの取得中にエラーが発生しました:', error);
                            // エラー詳細情報をコンソールに表示する
                            console.log('エラー詳細:', error);
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

    if (currentBabyState.id === "") {
        return (
            <View style={styles.container}>
                <View style={[emptyStyles.inner, {height: '100%'}]}>
                    <Text style={emptyStyles.title}>最初に赤ちゃんを登録してください</Text>
                </View>
            </View>
        );
    }

    if (toiletData.length === 0 && foodData.length === 0) {
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
                <CreateData toiletData={toiletData} foodData={foodData}/>
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
