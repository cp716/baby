import React, { useState, useEffect } from 'react';
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
            headerTitleStyle: {
                //fontFamily: 'San Francisco',
                fontSize: 20, // フォントサイズを調整できます
                color: '#312929', // テキストの色をカスタマイズ
            },
        });
    }, []);

    const [monthData, setMonthData] = useState([]);
    const [babyNameData, setBabyNameData] = useState('');
    const [babyIdData, setBabyIdData] = useState('');
    const [babyBirthdayData, setBabyBirthdayData] = useState('');


    const [monthToiletData, setMonthToiletData] = useState([]);

    useEffect(() => {
        loadBabyData();
    }, [currentBabyState, date]);

    const [milkData, setMilkData] = useState([]);
    const [toiletData, setToiletData] = useState([]);
    const [foodData, setFoodData] = useState([]);
    const [diseaseData, setDiseaseData] = useState([]);

    const commonRecordTable = `CommonRecord_${selectYear}_${String(selectMonth).padStart(2, '0')}`;
    const milkRecordTable = `MilkRecord_${selectYear}_${String(selectMonth).padStart(2, '0')}`;
    const toiletRecordTable = `ToiletRecord_${selectYear}_${String(selectMonth).padStart(2, '0')}`;
    const foodRecordTable = `FoodRecord_${selectYear}_${String(selectMonth).padStart(2, '0')}`;
    const diseaseRecordTable = `DiseaseRecord_${selectYear}_${String(selectMonth).padStart(2, '0')}`;

    // SQLiteの各テーブルからデータを取得
    const database = SQLite.openDatabase('BABY.db');
    const loadBabyData = () => {
        database.transaction((tx) => {
            tx.executeSql(
                'PRAGMA table_info(' + milkRecordTable + ');',
                [],
                (_, { rows }) => {
                if (rows.length > 0) {
                    // テーブルが存在する場合のみSELECT文を実行
                    tx.executeSql(
                        'SELECT ' + commonRecordTable + '.*, ' + milkRecordTable + '.milk, ' + milkRecordTable + '.bonyu, ' + milkRecordTable + '.junyu_left, ' + milkRecordTable + '.junyu_right FROM ' + commonRecordTable + ' LEFT JOIN ' + milkRecordTable + ' ON ' + commonRecordTable + '.record_id = ' + milkRecordTable + '.record_id WHERE ' + commonRecordTable + '.baby_id = ?;',
                        [currentBabyState.baby_id],
                        (_, { rows }) => {
                            const data = rows._array; // クエリ結果を配列に変換
                            setMilkData(data.filter(item => ['MILK', 'BONYU', 'JUNYU'].includes(item.category)))
                        },
                        (_, error) => {
                            console.error('データの取得中にエラーが発生しました:', error);
                            // エラー詳細情報をコンソールに表示する
                            console.log('エラー詳細:', error);
                        }
                    );
                } else {
                    //console.log('ToiletRecordテーブルが存在しません');
                    setMilkData([])
                }
                },
                (_, error) => {
                console.error('テーブルの存在確認中にエラーが発生しました:', error);
                }
            );
            tx.executeSql(
                'PRAGMA table_info(' + toiletRecordTable + ');',
                [],
                (_, { rows }) => {
                if (rows.length > 0) {
                    // テーブルが存在する場合のみSELECT文を実行
                    tx.executeSql(
                        //'SELECT ' + commonRecordTable + '.*, ' + toiletRecordTable + '.oshikko, ' + toiletRecordTable + '.unchi FROM ' + commonRecordTable + ' LEFT JOIN ' + toiletRecordTable + ' ON ' + commonRecordTable + '.record_id = ' + toiletRecordTable + '.record_id WHERE ' + commonRecordTable + '.baby_id = ?;',
                        'SELECT ' + commonRecordTable + '.* FROM ' + commonRecordTable +  ' WHERE ' + commonRecordTable + '.day = ? AND ' + commonRecordTable + '.baby_id = ?;',
                        [currentBabyState.baby_id],
                        (_, { rows }) => {
                            const data = rows._array; // クエリ結果を配列に変換
                            setToiletData(data.filter(item => item.category === 'OSHIKKO' || item.category === 'UNCHI'))
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
                        'SELECT ' + commonRecordTable + '.*, ' + foodRecordTable + '.amount FROM ' + commonRecordTable + ' LEFT JOIN ' + foodRecordTable + ' ON ' + commonRecordTable + '.record_id = ' + foodRecordTable + '.record_id WHERE ' + commonRecordTable + '.baby_id = ?;',
                        [currentBabyState.baby_id],
                        (_, { rows }) => {
                            const data = rows._array; // クエリ結果を配列に変換
                            setFoodData(data.filter(item => item.category === 'FOOD' || item.category === 'DRINK'));
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
            tx.executeSql(
                'PRAGMA table_info(' + diseaseRecordTable + ');',
                [],
                (_, { rows }) => {
                if (rows.length > 0) {
                    // テーブルが存在する場合のみSELECT文を実行
                    tx.executeSql(
                        'SELECT ' + commonRecordTable + '.*, ' + diseaseRecordTable + '.body_temperature FROM ' + commonRecordTable + ' LEFT JOIN ' + diseaseRecordTable + ' ON ' + commonRecordTable + '.record_id = ' + diseaseRecordTable + '.record_id WHERE ' + commonRecordTable + '.baby_id = ?;',
                        [currentBabyState.baby_id],
                        (_, { rows }) => {
                            const data = rows._array; // クエリ結果を配列に変換
                            setDiseaseData(data.filter(item => item.category === 'HANAMIZU' || item.category === 'SEKI' || item.category === 'OTO' || item.category === 'HOSSHIN' || item.category === 'KEGA' || item.category === 'KUSURI' || item.category === 'TAION'));
                        },
                        (_, error) => {
                            console.error('データの取得中にエラーが発生しました:', error);
                            // エラー詳細情報をコンソールに表示する
                            console.log('エラー詳細:', error);
                        }
                    );
                } else {
                    //console.log('DiseaseRecordテーブルが存在しません');
                    setDiseaseData([]);
                }
                },
                (_, error) => {
                console.error('テーブルの存在確認中にエラーが発生しました:', error);
                }
            );
        });
    };

    const tableHead = ['授乳', '哺乳瓶', '飲食', 'トイレ', '病気', '体温']
    const sybTableHead = ['左', '右', 'ミルク', '母乳', '食物', '食物量', '飲物', '飲物量', 'おしっこ', 'うんち', '鼻水', '咳', '嘔吐', '発疹', '怪我', '薬', '最高', '最低']
    const widthArr = [100, 100, 200, 100, 300, 100]

    const lastDay = new Date( selectYear, selectMonth, 0 ) ;

    // フォーマット関数を定義
    function formatTime(time) {
        return time ? time + '分' : '-';
    }

    function formatGram(total) {
        return (total !== null && total !== undefined && total !== 0) ? total + 'g' : '-';
    }

    function formatMl(total) {
        return (total !== null && total !== undefined && total !== 0) ? total + 'ml' : '-';
    }

    function formatCount(count) {
        return count ? count + '回' : '-';
    }

    function formatTemperature(temperature) {
        return (temperature !== null && temperature !== undefined && temperature !== 0 && temperature !== Infinity && temperature !== -Infinity) ? temperature + '℃' : '-';
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
        
        let maxBodyTemperature = -Infinity; // 最初にマイナス無限大で初期化
        let minBodyTemperature = Infinity; // 最初に無限大で初期化

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

        const milk  = milkData.filter((data) => data.day == [i])
        const toilet  = toiletData.filter((data) => data.day == [i])
        const disease  = diseaseData.filter((data) => data.day == [i])
        const food  = foodData.filter((data) => data.day == [i])

        for (let key in milk) {
            junyLeftTotal += milk[key].junyu_left
            junyRightTotal += milk[key].junyu_right
        }

        for (let key in milk) {
            milkTotal += milk[key].milk
        }

        for (let key in milk) {
            bonyuTotal += milk[key].bonyu
            bonyuCount += 1
        }

        for (let key in toilet) {
            if(toilet[key].category == 'OSHIKKO') {
                oshikkoCount += 1
            }
            if(toilet[key].category == 'UNCHI') {
                unchiCount += 1
            }
        }

        for (let key in food) {
            if(food[key].category == 'FOOD') {
                foodCount += 1
            }
            if(food[key].category == 'DRINK') {
                drinkCount += 1
            }
        }

        for (let key in food) {
            if(food[key].category == 'FOOD') {
                foodAmount += food[key].amount
            } else if(food[key].category == 'DRINK') {
                drinkAmount += food[key].amount
            }
        }

        for (let key in disease) {
            if(disease[key].category == 'HANAMIZU') {
                hanamizuCount += 1
            }
            if(disease[key].category == 'SEKI') {
                sekiCount += 1
            }
            if(disease[key].category == 'OTO') {
                otoCount += 1
            }
            if(disease[key].category == 'HOSSHIN') {
                hosshinCount += 1
            }
            if(disease[key].category == 'KEGA') {
                kegaCount += 1
            }
            if(disease[key].category == 'KUSURI') {
                kusuriCount += 1
            }

            for (let key in disease) {
                if (disease[key].category == 'TAION') {
                    const temperature = parseFloat(disease[key].body_temperature); // body_temperature を数値に変換
                    if (temperature > maxBodyTemperature) {
                        maxBodyTemperature = temperature; // より大きい値が見つかれば更新
                    }
                }
            }
            for (let key in disease) {
                if (disease[key].category == 'TAION') {
                    const temperature = parseFloat(disease[key].body_temperature); // body_temperature を数値に変換
                    if (temperature < minBodyTemperature && temperature !== 0) {
                        minBodyTemperature = temperature; // より小さい値が見つかれば更新
                    }
                }
            }
        }

        const rowData = [];
        rowData.push(`${formatTime(junyLeftTotal)}`);
        rowData.push(`${formatTime(junyRightTotal)}`);
        rowData.push(`${formatMl(milkTotal)}`);
        rowData.push(`${formatMl(bonyuTotal)}`);
        rowData.push(`${formatCount(foodCount)}`);
        rowData.push(`${formatGram(foodAmount)}`);
        rowData.push(`${formatCount(drinkCount)}`);
        rowData.push(`${formatMl(drinkAmount)}`);
        rowData.push(`${formatCount(oshikkoCount)}`);
        rowData.push(`${formatCount(unchiCount)}`);
        rowData.push(`${formatCount(hanamizuCount)}`);
        rowData.push(`${formatCount(sekiCount)}`);
        rowData.push(`${formatCount(otoCount)}`);
        rowData.push(`${formatCount(hosshinCount)}`);
        rowData.push(`${formatCount(kegaCount)}`);
        rowData.push(`${formatCount(kusuriCount)}`);
        rowData.push(`${formatTemperature(maxBodyTemperature)}`);
        rowData.push(`${formatTemperature(minBodyTemperature)}`);
        
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
    row: { height: 40 , backgroundColor: '#FFFFFF',},
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