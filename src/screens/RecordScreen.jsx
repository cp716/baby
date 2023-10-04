import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import * as SQLite from 'expo-sqlite'; // SQLiteをインポート
import Swiper from 'react-native-swiper'
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import Modal from "react-native-modal";
import DatePicker from 'react-native-modern-datepicker';
import { useCurrentBabyContext } from '../context/CurrentBabyContext';

const nowDateYear = new Date().getFullYear();
const nowDateMonth = new Date().getMonth() + 1;
const nowDateDay = new Date().getDate();
let initialIndex;

if (nowDateDay <= 10) {
    initialIndex = 0;
} else if (nowDateDay <= 20) {
    initialIndex = 1;
} else {
    initialIndex = 2;
}

export default function RecordScreen(props) {
    const { navigation } = props;
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const [index, setIndex] = useState(initialIndex);
    const [date, setDate] = useState(`${nowDateYear}/${nowDateMonth.toString().padStart(2, "0")}/01`);
    let selectYear = date.slice( 0, 4 );
    let selectMonth = date.slice( 5, 7 );
    //const [selectYear, setSelectYear] = useState(date.slice( 0, 4 ));
    //const [selectMonth, setSelectMonth] = useState(date.slice( 5, 7 ));

    useEffect(() => {
        navigation.setOptions({
            headerTitle: currentBabyState.name + 'の記録',
        });
    }, [currentBabyState]);

    const groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };








    const [monthData, setMonthData] = useState([]);
    const [babyNameData, setBabyNameData] = useState('');
    const [babyIdData, setBabyIdData] = useState('');
    const [babyBirthdayData, setBabyBirthdayData] = useState('');


    const [monthToiletData, setMonthToiletData] = useState([]);

    useEffect(() => {
        loadBabyData();
    }, [currentBabyState, date]);

    const [toiletData, setToiletData] = useState([]);
    const [foodData, setFoodData] = useState([]);

    const commonRecordTable = `CommonRecord_${selectYear}_${String(selectMonth).padStart(2, '0')}`;
    const toiletRecordTable = `ToiletRecord_${selectYear}_${String(selectMonth).padStart(2, '0')}`;
    const foodRecordTable = `FoodRecord_${selectYear}_${String(selectMonth).padStart(2, '0')}`;

    // SQLiteの各テーブルからデータを取得
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
                        'SELECT ' + commonRecordTable + '.*, ' + toiletRecordTable + '.oshikko, ' + toiletRecordTable + '.unchi FROM ' + commonRecordTable + ' LEFT JOIN ' + toiletRecordTable + ' ON ' + commonRecordTable + '.record_id = ' + toiletRecordTable + '.record_id WHERE ' + commonRecordTable + '.baby_id = ?;',
                        [currentBabyState.id],
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
                    //console.log('ToiletRecordテーブルが存在しません');
                    setToiletData([])
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
                        'SELECT ' + commonRecordTable + '.*, ' + foodRecordTable + '.food, ' + foodRecordTable + '.drink, ' + foodRecordTable + '.foodAmount, ' + foodRecordTable + '.drinkAmount FROM ' + commonRecordTable + ' LEFT JOIN ' + foodRecordTable + ' ON ' + commonRecordTable + '.record_id = ' + foodRecordTable + '.record_id WHERE ' + commonRecordTable + '.baby_id = ?;',
                        [currentBabyState.id],
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
                    //console.log('FoodRecordテーブルが存在しません');
                    setFoodData([]);
                }
                },
                (_, error) => {
                console.error('テーブルの存在確認中にエラーが発生しました:', error);
                }
            );
        });
    };

    const tableHead = ['授乳', '哺乳瓶', 'ご飯', 'トイレ', '病気', '体温']
    const sybTableHead = ['左', '右', 'ミルク', '母乳', '食事', '食事量', '飲物', '飲物量', 'おしっこ', 'うんち', '鼻水', '咳', '嘔吐', '発疹', '怪我', '薬', '最高', '最低']
    const widthArr = [100, 100, 200, 100, 300, 100]

    const lastDay = new Date( selectYear, selectMonth, 0 ) ;

    const babyDataGrouping = () => {

    }

    // フォーマット関数を定義
    function formatTime(time) {
        return time ? time + '分' : '-';
    }

    function formatMilkTotal(total) {
        return total ? total + 'ml' : '-';
    }

    function formatCount(count) {
        return count ? count + '回' : '-';
    }

    function formatTemperature(temperature) {
        return temperature ? temperature + '°' : '-';
    }

    const tableData = [];
    for (let i = 1; i < lastDay.getDate() + 1; i += 1) {
        let junyLeftTotal = 0;
        let junyRightTotal = 0;
        let milkTotal = 0;
        let bonyuTotal = 0;
        let bonyuCount = 0;
        
        let oshikkoCount = 0;
        let unchiCount = 0;
        
        let maxBodyTemperature = 0;
        let minBodyTemperature = 0;

        let foodCount = 0;
        let drinkCount = 0;
        let foodAmount = 0;
        let drinkAmount = 0;

        let hanamizuCount = 0;
        let sekiCount = 0;
        let otoCount = 0;
        let hosshinCount = 0;
        let kegaCount = 0;
        let kusuriCount = 0;

        const x = monthToiletData.filter((data) => data.day == [i])
        const groupByCategory = groupBy(x, 'category');
        const junyu = groupByCategory.JUNYU
        const milk  = groupByCategory.MILK
        const bonyu  = groupByCategory.BONYU
        const toilet  = toiletData.filter((data) => data.day == [i])
        const disease  = groupByCategory.DISEASE
        const food  = foodData.filter((data) => data.day == [i])

        for (let key in junyu) {
            junyLeftTotal += junyu[key].timeLeft
            junyRightTotal += junyu[key].timeRight
        }
        if(junyLeftTotal == 0) {
            junyLeftTotal = '-'
        } else {
            junyLeftTotal = junyLeftTotal + '分'
        }
        if(junyRightTotal == 0) {
            junyRightTotal = '-'
        } else {
            junyRightTotal = junyRightTotal + '分'
        }

        for (let key in milk) {
            milkTotal += milk[key].milk
        }
        if(milkTotal == 0) {
            milkTotal = '-'
        } else {
            milkTotal = milkTotal + '\nml'
        }

        for (let key in bonyu) {
            bonyuTotal += bonyu[key].bonyu
            bonyuCount += 1
        }
        if(bonyuTotal == 0) {
            bonyuTotal = '-'
        } else {
            bonyuTotal = bonyuTotal + '\nml'
        }

        for (let key in toilet) {
            if(toilet[key].oshikko) {
                oshikkoCount += 1
            }
            if(toilet[key].unchi) {
                unchiCount += 1
            }
        }
        if(oshikkoCount == 0) {
            oshikkoCount = '-'
        } else {
            oshikkoCount = oshikkoCount + '回'
        }
        if(unchiCount == 0) {
            unchiCount = '-'
        } else {
            unchiCount = unchiCount + '回'
        }

        for (let key in food) {
            if(food[key].food) {
                foodCount += 1
            }
            if(food[key].drink) {
                drinkCount += 1
            }
            //if(!isNaN(food[key].food.drink)) {
            //    drinkTotal += food[key].food.drink
            //}
        }
        if(foodCount == 0) {
            foodCount = '-'
        } else {
            foodCount = foodCount + '回'
        }
        if(drinkCount == 0) {
            drinkCount = '-'
        } else {
            drinkCount = drinkCount + '回'
        }

        for (let key in food) {
            foodAmount += food[key].foodAmount
        }
        if(foodAmount == 0) {
            foodAmount = '-'
        } else {
            foodAmount = foodAmount + '\nml'
        }
        for (let key in food) {
            drinkAmount += food[key].drinkAmount
        }
        if(drinkAmount == 0) {
            drinkAmount = '-'
        } else {
            drinkAmount = drinkAmount + '\nml'
        }

        for (let key in disease) {
            if(disease[key].disease.hanamizu) {
                hanamizuCount += 1
            }
            if(disease[key].disease.seki) {
                sekiCount += 1
            }
            if(disease[key].disease.oto) {
                otoCount += 1
            }
            if(disease[key].disease.hosshin) {
                hosshinCount += 1
            }
            if(disease[key].disease.kega) {
                kegaCount += 1
            }
            if(disease[key].disease.kusuri) {
                kusuriCount += 1
            }
        }
        if(hanamizuCount == 0) {
            hanamizuCount = '-'
        } else {
            hanamizuCount = hanamizuCount + '回'
        }
        if(sekiCount == 0) {
            sekiCount = '-'
        } else {
            sekiCount = sekiCount + '回'
        }
        if(otoCount == 0) {
            otoCount = '-'
        } else {
            otoCount = otoCount + '回'
        }
        if(hosshinCount == 0) {
            hosshinCount = '-'
        } else {
            hosshinCount = hosshinCount + '回'
        }
        if(kegaCount == 0) {
            kegaCount = '-'
        } else {
            kegaCount = kegaCount + '回'
        }
        if(kusuriCount == 0) {
            kusuriCount = '-'
        } else {
            kusuriCount = kusuriCount + '回'
        }

        for (let key in disease) {
            if(!isNaN(disease[key].disease.bodyTemperature)) {
                maxBodyTemperature = disease[key].disease.bodyTemperature
                minBodyTemperature = disease[key].disease.bodyTemperature
            }
        }
        if(maxBodyTemperature == 0) {
            maxBodyTemperature = '-'
        } else {
            maxBodyTemperature = maxBodyTemperature + '°'
        }
        if(minBodyTemperature == 0) {
            minBodyTemperature = '-'
        } else {
            minBodyTemperature = minBodyTemperature + '°'
        }

        const rowData = [];

        rowData.push(`${junyLeftTotal}`);
        rowData.push(`${junyRightTotal}`);
        rowData.push(`${milkTotal}`);
        rowData.push(`${bonyuTotal}`);
        rowData.push(`${foodCount}`);
        rowData.push(`${foodAmount}`);
        rowData.push(`${drinkCount}`);
        rowData.push(`${drinkAmount}`);
        rowData.push(`${oshikkoCount}`);
        rowData.push(`${unchiCount}`);
        rowData.push(`${hanamizuCount}`);
        rowData.push(`${sekiCount}`);
        rowData.push(`${otoCount}`);
        rowData.push(`${hosshinCount}`);
        rowData.push(`${kegaCount}`);
        rowData.push(`${kusuriCount}`);
        rowData.push(`${maxBodyTemperature}`);
        rowData.push(`${minBodyTemperature}`);
        
        tableData.push(rowData);
    }

    const tableDateData = [];
    tableDateData.push(['']);
    tableDateData.push([selectMonth + '月']);
    for (let i = 1; i < lastDay.getDate() + 1; i += 1) {
    //for (let i = 1; i < 16; i += 1) {
            const rowData = [];
        rowData.push(`${i}日`);
        tableDateData.push(rowData);
    }
    tableDateData.splice(12, 0, ['']);
    tableDateData.splice(13, 0, [selectMonth + '月']);
    tableDateData.splice(24, 0, ['']);
    tableDateData.splice(25, 0, [selectMonth + '月']);

    const todayDate = new Date();
    const todayDay = todayDate.getDate();
    const isTodayRow = (rowData) => {
        return rowData[0] === todayDay + '日';
    };

    return (
        <View style={styles.container}>
            <View style={[styles.date , {height: '15%'}]}>
                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                        toggleModal();
                    }}
                >
                    <Text style={styles.modalButtonText}>
                        {selectYear}年{selectMonth}月
                    </Text>
                </TouchableOpacity>
            </View>
            <Modal isVisible={isModalVisible}
                onBackdropPress={toggleModal}
                backdropTransitionOutTiming={0}
                //modalレパートリー
                //"bounce" | "flash" | "jello" | "pulse" | "rotate" | "rubberBand" | "shake" | "swing" | "tada" | "wobble" | "bounceIn" | "bounceInDown" | "bounceInUp" | "bounceInLeft" | "bounceInRight" | "bounceOut" | "bounceOutDown" | "bounceOutUp" | "bounceOutLeft" | "bounceOutRight" | "fadeIn" | "fadeInDown" | "fadeInDownBig" | "fadeInUp" | "fadeInUpBig" | "fadeInLeft" | "fadeInLeftBig" | "fadeInRight" | "fadeInRightBig" | "fadeOut" | "fadeOutDown" | "fadeOutDownBig" | "fadeOutUp" | "fadeOutUpBig" | "fadeOutLeft" | "fadeOutLeftBig" | "fadeOutRight" | "fadeOutRightBig" | "flipInX" | "flipInY" | "flipOutX" | "flipOutY" | "lightSpeedIn" | "lightSpeedOut" | "slideInDown" | "slideInUp" | "slideInLeft" | "slideInRight" | "slideOutDown" | "slideOutUp" | "slideOutLeft" | "slideOutRight" | "zoomIn" | "zoomInDown" | "zoomInUp" | "zoomInLeft" | "zoomInRight" | "zoomOut" | "zoomOutDown" | "zoomOutUp" | "zoomOutLeft" | "zoomOutRight" |
                animationIn="fadeInUpBig"
                animationOut="fadeOutDownBig"
                avoidKeyboard={true}
                swipeDirection="down"
                onSwipeComplete={toggleModal}
                >
                <View style={modalStyles.container}>
                <DatePicker
                    mode="monthYear"
                    //selectorStartingYear={9000}
                    onMonthYearChange={selectedDate => {
                        setDate(selectedDate)
                        toggleModal()
                    }}
                    current={`${date.slice( 0, 4 )}/${date.slice( 5, 7 )}/01`}
                    //selected={`${date.slice( 0, 4 )}/${date.slice( 5, 7 )}/01`}
                    //current={date}
                    //selected={date}
                />
                </View>
            </Modal>
            <Swiper
                style={styles.wrapper}
                dot={<View style={{backgroundColor:'rgba(0,0,0,.2)', width: 8, height: 8,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
                horizontal={false}
                showsButtons={false}//サイドボタン
                //onIndexChanged={(index) => {console.log(index)}}
                showsPagination={true}//下部マーク
                loop={false}//連続ループ
                index={index}
                //loadMinimal={true}
                //renderPagination={renderPagination}
            >
                <View style={styles.table}>
                    <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                        {
                            tableDateData.slice(0,12).map((rowData, index) => (
                                <Row
                                    key={index}
                                    data={rowData}
                                    widthArr={[50]}
                                    style={{
                                        ...styles.row,
                                        ...(isTodayRow(rowData) ? { backgroundColor: '#D3EBE9' } : {}), // 今日の行は背景色を変更
                                    }}
                                    textStyle={styles.text}
                                />
                            ))
                        }
                    </Table>
                    <ScrollView horizontal={true} style={styles.dataWrapper}>
                        <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                            <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text}/>
                            <Row data={sybTableHead} widthArr={[50, 50, 50, 50, 50, 50, 50, 50, 50,50, 50, 50, 50, 50, 50, 50, 50, 50]} style={styles.header} textStyle={styles.text}/>
                            {
                                tableData.slice(0,10).map((rowData, index) => (
                                    <Row
                                        key={index}
                                        data={rowData}
                                        widthArr={[50, 50, 50, 50, 50, 50, 50, 50, 50, 50,50, 50, 50, 50, 50, 50, 50, 50]}
                                        style={styles.row}
                                        textStyle={styles.dataText}
                                    />
                                ))
                            }
                        </Table>
                        
                    </ScrollView>
                </View>
                <View style={styles.table}>
                    <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                        {
                            tableDateData.slice(12,24).map((rowData, index) => (
                                <Row
                                    key={index}
                                    data={rowData}
                                    widthArr={[50]}
                                    style={{
                                        ...styles.row,
                                        ...(isTodayRow(rowData) ? { backgroundColor: '#D3EBE9' } : {}), // 今日の行は背景色を変更
                                    }}
                                    textStyle={styles.text}
                                />
                            ))
                        }
                    </Table>
                    <ScrollView horizontal={true} style={styles.dataWrapper}>
                        <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                            <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text}/>
                            <Row data={sybTableHead} widthArr={[50, 50, 50, 50, 50, 50, 50, 50, 50,50, 50, 50, 50, 50, 50, 50, 50, 50]} style={styles.header} textStyle={styles.text}/>
                            {
                                tableData.slice(10,20).map((rowData, index) => (
                                    <Row
                                        key={index}
                                        data={rowData}
                                        widthArr={[50, 50, 50, 50, 50, 50, 50, 50, 50, 50,50, 50, 50, 50, 50, 50, 50, 50]}
                                        style={styles.row}
                                        textStyle={styles.dataText}
                                    />
                                ))
                            }
                        </Table>
                    </ScrollView>
                </View>
                <View style={styles.table}>
                    <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                        {
                            tableDateData.slice(24).map((rowData, index) => (
                                <Row
                                    key={index}
                                    data={rowData}
                                    widthArr={[50]}
                                    style={{
                                        ...styles.row,
                                        ...(isTodayRow(rowData) ? { backgroundColor: '#D3EBE9' } : {}), // 今日の行は背景色を変更
                                    }}
                                    textStyle={styles.text}
                                />
                            ))
                        }
                    </Table>
                    <ScrollView horizontal={true} style={styles.dataWrapper}>
                        <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                            <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text}/>
                            <Row data={sybTableHead} widthArr={[50, 50, 50, 50, 50, 50, 50, 50, 50,50, 50, 50, 50, 50, 50, 50, 50, 50]} style={styles.header} textStyle={styles.text}/>
                            {
                                tableData.slice(20).map((rowData, index) => (
                                    <Row
                                        key={index}
                                        data={rowData}
                                        widthArr={[50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]}
                                        style={styles.row}
                                        textStyle={styles.dataText}
                                    />
                                ))
                            }
                        </Table>
                    </ScrollView>
                </View>
            </Swiper>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: '#F0F4F8',
    },
    date: {
        flexDirection: 'row',
        height: 70,
        alignItems:'center',
        justifyContent: 'center',
    },
    modalButton : {
        backgroundColor : '#FFF',
        borderColor : '#36C1A7',
        borderWidth : 1,
        borderRadius : 10,
        //fontSize: 20,
        //paddingHorizontal: 10,
    },
    modalButtonText : {
        color : '#36C1A7',
        fontWeight : 'bold',
        textAlign : 'center',
        padding: 10,
        fontSize: 20,
    },
    dateArrow: {
        paddingHorizontal: 10,
    },
    table: { flexDirection: 'row', paddingLeft: '5%', paddingRight: '10%' },
    header: { height: 40, backgroundColor: '#D3EBE9', },
    text: { textAlign: 'center', fontWeight: '100' },
    dataText: { textAlign: 'center', fontWeight: 'bold' },
    //wrapper: { padding: '5%' },
    dataWrapper: { marginLeft: -1 }, //flexDirection: 'column'
    row: { height: 40 },
    dot: {
        marginLeft: 5,
    }
});

const modalStyles = StyleSheet.create({
    modalButton : {
        backgroundColor : '#FFF',
        borderColor : '#36C1A7',
        borderWidth : 1,
        borderRadius : 10,
    },
    modalButtonText : {
        color : '#36C1A7',
        fontWeight : 'bold',
        textAlign : 'center',
        //padding: 10,
        fontSize: 20,
    },
    container : {
        backgroundColor : '#FFF',
        padding : '5%',
        borderColor : '#36C1A7',
        borderWidth : 3,
        borderRadius : 20,
    },
    title : {
        color : '#36C1A7',
        fontWeight : 'bold',
        textAlign: 'center'
    },
    //arrow : {
        //color : '#36C1A7',
    //},
});