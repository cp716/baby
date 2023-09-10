import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Table, TableWrapper, Row, Col } from 'react-native-table-component';

export default function DailyTable(props) {
    const { todayData } = props;
    let junyLeftTotal = 0;
    let junyRightTotal = 0;
    let milkTotal = 0;
    let bonyuTotal = 0;
    let bonyuCount = 0;
    let oshikkoCount = 0;
    let unchiCount = 0;
    let bodyTemperature = '記録なし';
    let bodyTemperatureTime = ''
    let foodCount = 0;
    let drinkTotal = 0;

    const groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };
    
    const groupByCategory = groupBy(todayData, 'category');
    const junyu = groupByCategory.JUNYU
    const milk  = groupByCategory.MILK
    const bonyu  = groupByCategory.BONYU
    const toilet  = groupByCategory.TOILET
    const disease  = groupByCategory.DISEASE
    const food  = groupByCategory.FOOD

    for (let key in junyu) {
        junyLeftTotal += junyu[key].timeLeft
        junyRightTotal += junyu[key].timeRight
    }
    for (let key in milk) {
        milkTotal += milk[key].milk
    }
    for (let key in bonyu) {
        bonyuTotal += bonyu[key].bonyu
        bonyuCount += 1
    }
    for (let key in toilet) {
        if(toilet[key].toilet.oshikko && toilet[key].toilet.unchi) {
            oshikkoCount += 1
            unchiCount += 1
        }
        if(toilet[key].toilet.oshikko && !toilet[key].toilet.unchi) {
            oshikkoCount += 1
        }
        if(!toilet[key].toilet.oshikko && toilet[key].toilet.unchi) {
            unchiCount += 1
        }
    }
    for (let key in disease) {
        if(!isNaN(disease[key].disease.bodyTemperature)) {
            bodyTemperature = disease[key].disease.bodyTemperature
            bodyTemperatureTime = (disease[key].updatedAt.getHours()) + '時' + (disease[key].updatedAt.getMinutes()) + '分'
        }
    }
    for (let key in food) {
        if(!isNaN(food[key].food.drink)) {
            drinkTotal += food[key].food.drink
        }
        foodCount += 1
    }

    const tableHead_1 = ['授乳', '哺乳瓶', '飲食']
    const tableData_1 = ['左\n' + junyLeftTotal + '分', '右\n' + junyRightTotal + '分', 'ミルク\n' + milkTotal + 'ml', '母乳\n' + bonyuTotal + 'ml', 'ご飯\n' + foodCount + '回', '飲物\n' + drinkTotal + 'ml']
    const tableHead_2 = ['トイレ', '睡眠', '体温', '身長', '体重']
    const tableData_2 = ['尿\n' + oshikkoCount + '回', 'うんち\n' + unchiCount + '回', 'XX分', bodyTemperature + '℃', 'XXcm', 'XXkg']
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