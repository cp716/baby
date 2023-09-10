import React, { useEffect, useState }  from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native'

import firebase from 'firebase';
import storage from '../context/Storage';
import Swiper from 'react-native-swiper'

import MilkAddButton from '../components/AddButton/MilkAddButton';
import ToiletAddButton from '../components/AddButton/ToiletAddButton';
import DiseaseAddButton from '../components/AddButton/DiseaseAddButton';
import FoodAddButton from '../components/AddButton/FoodAddButton';
import FreeAddButton from '../components/AddButton/FreeAddButton';

import Datetime from '../components/Datetime';
import TableTitle from '../components/TableTitle';
import CreateData from '../components/CreateData';
import DailyTable from '../components/DailyTable';

import { useBabyContext } from '../context/BabyContext';
import { useCurrentBabyContext } from '../context/CurrentBabyContext';
import { useDateTimeContext } from '../context/DateTimeContext';
import { useBabyRecordContext } from '../context/BabyRecordContext';

export default function MainScreen(props) {
    const { baby } = useBabyContext();
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();
    const { dateTimeState, dateTimeDispatch } = useDateTimeContext();
    const { babyRecordState, babyRecordDispatch } = useBabyRecordContext();

    const { navigation } = props;
    const [todayData, setTodayData] = useState([]);
    const [indexCount, setIndexCount] = useState(0);
    const [babyRecord, setBabyRecord] = useState([]);
    const [day, setDay] = useState(dateTimeState.day - 1);


    //const todayData = memos.filter((memo) => memo.day == [dateTimeState.day]);

    const [isLoading, setLoading] = useState(false);

    const isFocused = useIsFocused()

    const [babyNameData, setBabyNameData] = useState('');
    const [babyIdData, setBabyIdData] = useState('');
    const [babyBirthdayData, setBabyBirthdayData] = useState('');

    useEffect(() => {
        storage.load({
            key : 'selectbaby',
        }).then(data => {
            // 読み込み成功時処理
            setBabyNameData(data.babyName)
            setBabyIdData(data.babyId)
            setBabyBirthdayData(data.birthday)
        }).catch(err => {
            // 読み込み失敗時処理
            console.log(err)
        });
    }, [currentBabyState,isFocused]);

    useEffect(() => {
        setLoading(true);
        const cleanupFuncs = {
            auth: () => {},
            memos: () => {},
        };
        cleanupFuncs.auth = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                if(babyIdData !== '') {
                    const db = firebase.firestore();
                    const ref = db.collection(`users/${user.uid}/babyData`).doc(babyIdData)
                    .collection(`${dateTimeState.year}_${dateTimeState.month}`).orderBy('updatedAt', 'asc'); 
                    //.collection(`${dateTimeState.year}/${dateTimeState.month}/${dateTimeState.day}`).orderBy('updatedAt', 'asc');
                    cleanupFuncs.memos = ref.onSnapshot((snapshot) => {
                    const userMemos = [];
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        babyRecord.push({
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
                    //setTodayData(userMemos.filter((memo) => memo.day == [dateTimeState.day]));
                    const weeklyDate = [];
                    weeklyDate.push({id: indexCount, data: babyRecord.filter((data) => data.day == [dateTimeState.day - 1])});
                    setIndexCount(indexCount + 1)
                    weeklyDate.push({id: indexCount, data: babyRecord.filter((data) => data.day == [dateTimeState.day])});
                    setIndexCount(indexCount + 1)
                    weeklyDate.push({id: indexCount, data: babyRecord.filter((data) => data.day == [dateTimeState.day + 1])});
                    setIndexCount(indexCount + 1)
                    //weeklyDate.push(userMemos.filter((memo) => memo.day == [dateTimeState.day - 3]));
                    //weeklyDate.push(userMemos.filter((memo) => memo.day == [dateTimeState.day - 2]));
                    //weeklyDate.push(userMemos.filter((memo) => memo.day == [dateTimeState.day - 1]));
                    //weeklyDate.push(userMemos.filter((memo) => memo.day == [dateTimeState.day]));
                    //weeklyDate.push(userMemos.filter((memo) => memo.day == [dateTimeState.day + 1]));
                    //weeklyDate.push(userMemos.filter((memo) => memo.day == [dateTimeState.day + 2]));
                    //weeklyDate.push(userMemos.filter((memo) => memo.day == [dateTimeState.day + 3]));
                    setTodayData(weeklyDate);
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
    }, [babyIdData, dateTimeState]);

    const babyData = [];
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

    if (babyData.length == 0) {
        return (
            <View style={styles.container}>
                <View style={[emptyStyles.inner, {height: '100%'}]}>
                    <Text style={emptyStyles.title}>最初に赤ちゃんを登録してください</Text>
                </View>
            </View>
        );
    }

    if (todayData.length === 0) {
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
                        <TableTitle title = {'修正\n確認'} />
                    </View>
                </View>
                <View style={[emptyStyles.inner, {height: '65%'}]}>
                    <Text style={emptyStyles.title}>最初の記録を登録してください</Text>
                </View>
                <View style={[styles.button , {height: '15%'}]}>
                    <FreeAddButton />
                    <DiseaseAddButton />
                    <ToiletAddButton />
                    <FoodAddButton />
                    <MilkAddButton />
                </View>
            </View>
        );
    }
    const date = new Date( dateTimeState.year, dateTimeState.month, 0 ) ;
    let y = [...Array(date.getDate())]
    {(() => {
        for (let i = 1; i < date.getDate() + 1; i += 1) {
            let x = [];
            for( let item of todayData.filter((memo) => memo.day == [i]) ) {
                x.push(item)
            }
            if(x.length > 0) {
                //y.push(x)
                y[i-1] = x
            }
        }
        console.log(y)
    })()}
    const renderPagination = (index, total, context) => {
        console.log(context.props.index)
        todayData.push({id: indexCount, data: babyRecord.filter((data) => data.day == [day])})
        //setIndexCount(indexCount + 1)
        //dateTimeDispatch({ type: "slideDay"})//, index: index
        //return(
            //dateTimeDispatch({ type: "slideDay", index: index})
            //todayData.push({id: indexCount + 1, data: babyRecord.filter((data) => data.day == [day])})
            //<Text>{index}</Text>
        //)
    }
    console.log(todayData)

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
                    <TableTitle title = {'修正\n確認'} />
                </View>
            </View>
            <View style={{height: '40%'}}>
                <Swiper
                    style={styles.wrapper}
                    showsButtons={true}//サイドボタン
                    //onIndexChanged={(index) => {dateTimeDispatch({ type: "swipeDate", index: index})}}
                    //showsPagination={true}//下部マーク
                    index={1}
                    loadMinimal={true}
                    renderPagination={renderPagination}
                >
                    {
                        todayData.map((data, key) => (
                            //console.log(data.data)
                            <CreateData key={key} todayData={data.data} />
                        ))
                    }
                </Swiper>
            </View>
            <View style={[styles.footer , {height: '25%'}]}>
                <DailyTable todayData={todayData} />
            </View>
            <View style={[styles.button , {height: '15%'}]}>
                <FreeAddButton />
                <DiseaseAddButton />
                <ToiletAddButton />
                <FoodAddButton />
                <MilkAddButton />
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
        //marginLeft: 'auto',
        //marginRight: 'auto',
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
