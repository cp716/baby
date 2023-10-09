import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Table, TableWrapper, Row, Col } from 'react-native-table-component';

export default function DailyTable(props) {
    const { todayData } = props;
    const { milkData } = props;
    const { toiletData } = props;
    const { foodData } = props;
    const { diseaseData } = props;

    // フォーマット関数を定義
    function formatTime(time) {
        return time ? time + '分' : '-';
    }

    function formatAmount(total) {
        return total ? total + 'ml' : '-';
    }

    function formatCount(count) {
        return count ? count + '回' : '-';
    }

    function formatTemperatureTime(temperature) {
        return temperature ? temperature + '' : '-';
    }

    function formatTemperature(temperature) {
        return temperature ? temperature + '℃' : '-';
    }

    let junyLeftTotal = 0;
    let junyRightTotal = 0;
    let milkTotal = 0;
    let bonyuTotal = 0;
    let bonyuCount = 0;
    let oshikkoCount = 0;
    let unchiCount = 0;
    let bodyTemperature = 0;
    let bodyTemperatureTime = '';
    let foodCount = 0;
    let drinkTotal = 0;

    for (let key in milkData) {
        junyLeftTotal += milkData[key].junyu_left
        junyRightTotal += milkData[key].junyu_right
    }
    for (let key in milkData) {
        milkTotal += milkData[key].milk
    }
    for (let key in milkData) {
        bonyuTotal += milkData[key].bonyu
        bonyuCount += 1
    }
    for (let key in toiletData) {
        if(toiletData[key].oshikko && toiletData[key].unchi) {
            oshikkoCount += 1
            unchiCount += 1
        }
        if(toiletData[key].oshikko && !toiletData[key].unchi) {
            oshikkoCount += 1
        }
        if(!toiletData[key].oshikko && toiletData[key].unchi) {
            unchiCount += 1
        }
    }
    
    for (let key in diseaseData) {
        const temperature = parseFloat(diseaseData[key].body_temperature); // body_temperature を数値に変換
        const dateTimeString = diseaseData[key].record_time;
        const dateTime = new Date(dateTimeString);
        if (!isNaN(diseaseData[key].body_temperature) && temperature !== 0) {
            const currentBodyTemperature = parseFloat(diseaseData[key].body_temperature);
    
            if (bodyTemperature === null || dateTime > bodyTemperatureTime) {
                // 現在の体温が最新の場合、または bodyTemperature が null の場合
                bodyTemperature = currentBodyTemperature;
                bodyTemperatureTime = dateTime;
            }
        }
    }
    // 最新の体温とその記録時間をフォーマットする場合
    if (bodyTemperature !== null) {
        bodyTemperatureTime = (new Date(bodyTemperatureTime).getHours()) + ':' + (new Date(bodyTemperatureTime).getMinutes());
    }
    for (let key in foodData) {
        if(foodData[key].food && foodData[key].drink) {
            foodCount += 1
            drinkTotal += 1
        }
        if(foodData[key].food && !foodData[key].drink) {
            foodCount += 1
        }
        if(!foodData[key].food && foodData[key].drink) {
            drinkTotal += 1
        }
    }

    const tableHead_1 = ['授乳', '哺乳瓶', '飲食']
    const tableData_1 = ['左\n' + formatTime(junyLeftTotal), '右\n' + formatTime(junyRightTotal), 'ミルク\n' + formatAmount(milkTotal), '母乳\n' + formatAmount(bonyuTotal), 'ご飯\n' + formatCount(foodCount), '飲物\n' + formatCount(drinkTotal)]
    const tableHead_2 = ['トイレ', '睡眠', '体温', '身長', '体重']
    const tableData_2 = ['尿\n' + formatCount(oshikkoCount), 'うんち\n' + formatCount(unchiCount), 'XX分', formatTemperatureTime(bodyTemperatureTime) + '\n' + formatTemperature(bodyTemperature), 'XXcm', 'XXkg']
    const widthArr_1 = [110, 110, 110]
    const widthArr_2 = [55, 55, 55, 55, 55, 55]
    const widthArr_3 = [110, 55, 55, 55, 55]

    return (
        <View style={styles.container}>
            <Table style={styles.table} widthArr={[330]} borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Row data={tableHead_1} widthArr={widthArr_1} style={styles.tableRow_1} textStyle={styles.tableText}/>
                <Row data={tableData_1} widthArr={widthArr_2} style={styles.tableRow_2} textStyle={styles.tableText}/>
                <Row data={tableHead_2} widthArr={widthArr_3} style={styles.tableRow_3} textStyle={styles.tableText}/>
                <Row data={tableData_2} widthArr={widthArr_2} style={styles.tableRow_4} textStyle={styles.tableText}/>
            </Table>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        //backgroundColor: 'red',
        justifyContent: 'center',
        flexDirection: 'row'
        //flexDirection: 'row',
        //borderTopWidth: 1,
        //justifyContent: 'space-around',//横並び均等配置,
        //backgroundColor: '#eee8aa',
    },
    table: {
        //backgroundColor: 'red',
        //justifyContent: 'center',
        alignItems: 'center',
        //margin: 'auto',
        //flexDirection: 'row',
        //justifyContent: 'space-around',//横並び均等配置
        //borderTopRightRadius: 10,
        //borderTopLeftRadius: 10,
    },
    tableRow_1: {
        //backgroundColor: '#eee8aa',
        //flexDirection: 'row',
        //paddingVertical: 16,
        //justifyContent: 'center',
        //margin: 'auto',
        //marginBottom: 'auto',
        //borderWidth: 3,
        //borderColor: '#c8e1ff',
        backgroundColor: '#D3EBE9',
        //borderTopRightRadius: 10,
        //borderTopLeftRadius: 10,
        //height: '100%',
        //alignItems: 'center',
        //width: '30%',
    },
    tableRow_2: {
        
    },
    tableRow_3: {
        backgroundColor: '#D3EBE9',
    },
    tableRow_4: {
        //borderBottomLeftRadius: 10,
        //borderBottomRightRadius: 10,
    },
    tabledesign: {
        //flexDirection: 'row',
        //alignItems:'center',
    },
    tableTitle2: {
        flexDirection: 'row',
        fontSize: 13,
        //lineHeight: 16,
        //padding: 3 ,
        //margin: '1%',
        //paddingLeft: '10%',
        //paddingRight: '10%',
        fontWeight: 'bold',
        //backgroundColor: '#676556',
        width: '100%',
        flexGrow: 1,
        textAlign: 'center',
        alignItems: 'center',//縦中央
        //justifyContent: 'center',//横中央
    },
    tableText: {
        //backgroundColor: 'red',
        //width: '20%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        textAlign: 'center',
        fontSize: 15,
    },
});