import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Table, TableWrapper, Row, Col } from 'react-native-table-component';

export default function DailyTable(props) {
    const { milkData } = props;
    const { toiletData } = props;
    const { foodData } = props;
    const { diseaseData } = props;
    const { bodyData } = props;

    // フォーマット関数を定義
    function formatTime(time) {
        return time ? time + '分' : '-';
    }

    function formatMl(total) {
        return total ? total + 'ml' : '-';
    }

    function formatGram(total) {
        return total ? total + 'g' : '-';
    }

    function formatKgram(total) {
        return total ? total + 'kg' : '-';
    }

    function formatCm(total) {
        return total ? total + 'cm' : '-';
    }

    function formatCount(count) {
        return count ? count + '回' : '-';
    }

    function formatTemperatureTime(temperature) {
        return temperature ? temperature + '' : '-';
    }

    function formatTemperature(temperature) {
        return temperature ? '最新\n' + temperature + '℃' : '-';
    }

    let junyLeftTotal = 0;
    let junyRightTotal = 0;
    let milkTotal = 0;
    let bonyuTotal = 0;
    let bonyuCount = 0;
    let oshikkoCount = 0;
    let unchiCount = 0;
    let bodyTemperature = 0;
    let bodyTemperatureTime = 0;
    let foodCount = 0;
    let foodTotal = 0;
    let drinkCount = 0;
    let drinkTotal = 0;
    let heightValue = 0;
    let weightValue = 0;

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
        if(toiletData[key].category == 'OSHIKKO') {
            oshikkoCount += 1
        } else if(toiletData[key].category == 'UNCHI') {
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
        if(foodData[key].amount && foodData[key].category == 'FOOD') {
            foodTotal += foodData[key].amount
        } else if(foodData[key].amount && foodData[key].category == 'DRINK') {
            drinkTotal += foodData[key].amount
        }
        if(foodData[key].category == 'FOOD') {
            foodCount += 1
        } else if(foodData[key].category == 'DRINK') {
            drinkCount += 1
        }
    }

    for (let key in bodyData) {
        const value = parseFloat(bodyData[key].value); // value を数値に変換
        const dateTimeString = bodyData[key].record_time;
        const dateTime = new Date(dateTimeString);
            if (bodyData[key].category == 'HEIGHT') {
                // 現在の体温が最新の場合、または bodyTemperature が null の場合
                heightValue = parseFloat(bodyData[key].value);
            } else if(bodyData[key].category == 'WEIGHT') {
                weightValue = parseFloat(bodyData[key].value);
            }
        //}
    }

    const tableHead_1 = ['授乳', '哺乳瓶', '飲食']
    const tableData_1 = ['左\n' + formatTime(junyLeftTotal), '右\n' + formatTime(junyRightTotal), 'ミルク\n' + formatMl(milkTotal), '母乳\n' + formatMl(bonyuTotal), '食物\n' + formatGram(foodTotal), '飲物\n' + formatMl(drinkTotal)]
    const tableHead_2 = ['トイレ', '睡眠', '体温', '身長', '体重']
    const tableData_2 = ['尿\n' + formatCount(oshikkoCount), 'うんち\n' + formatCount(unchiCount), 'XX分', formatTemperature(bodyTemperature), formatCm(heightValue), formatKgram(weightValue)]
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
        backgroundColor: '#f4cdcd',
        //borderTopRightRadius: 10,
        //borderTopLeftRadius: 10,
        //height: '100%',
        //alignItems: 'center',
        //width: '30%',
    },
    tableRow_2: {
        backgroundColor: '#FFFFFF',
    },
    tableRow_3: {
        backgroundColor: '#f4cdcd',
    },
    tableRow_4: {
        backgroundColor: '#FFFFFF',
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