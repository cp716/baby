import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
            bodyTemperature = disease[key].disease.bodyTemperature + '°'
            bodyTemperatureTime = (disease[key].updatedAt.getHours()) + '時' + (disease[key].updatedAt.getMinutes()) + '分'
        }
    }
    for (let key in food) {
        if(!isNaN(food[key].food.drink)) {
            drinkTotal += food[key].food.drink
        }
        foodCount += 1
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.tableSpace}>
                <View style={styles.table}>
                    <View style={styles.tableTitle1}>
                        <Text style={styles.tableText}>授乳</Text>
                    </View>
                    <View style={styles.tableTitle2}>
                        <Text style={styles.tableText}>左</Text>
                        <Text style={styles.tableText}>右</Text>
                    </View>
                    <View style={styles.tableTitle2}>
                        <Text style={styles.tableText}>{junyLeftTotal}分</Text>
                        <Text style={styles.tableText}>{junyRightTotal}分</Text>
                    </View>
                </View>
                <View style={styles.table}>
                    <View style={styles.tableTitle1}>
                        <Text style={styles.tableText}>哺乳瓶</Text>
                    </View>
                    <View style={styles.tableTitle2}>
                        <Text style={styles.tableText}>ミルク</Text>
                        <Text style={styles.tableText}>母乳</Text>
                    </View>
                    <View style={styles.tableTitle2}>
                        <Text style={styles.tableText}>{milkTotal}ml</Text>
                        <Text style={styles.tableText}>{bonyuTotal}ml</Text>
                    </View>
                </View>
            </View>
            <View style={styles.tableSpace}>
                <View style={styles.table}>
                    <View style={styles.tableTitle1}>
                        <Text style={styles.tableText}>飲食</Text>
                    </View>
                    <View style={styles.tableTitle2}>
                        <Text style={styles.tableText}>ご飯</Text>
                        <Text style={styles.tableText}>飲物</Text>
                    </View>
                    <View style={styles.tableTitle2}>
                        <Text style={styles.tableText}>{foodCount}回</Text>
                        <Text style={styles.tableText}>{drinkTotal}ml</Text>
                    </View>
                </View>
                <View style={styles.table}>
                    <View style={styles.tableTitle1}>
                        <Text style={styles.tableText}>体温</Text>
                    </View>
                    <View style={styles.tableTitle2}>
                        <Text style={styles.tableText}>{bodyTemperature}</Text>
                    </View>
                    <View style={styles.tableTitle2}>
                        <Text style={styles.tableText}>{bodyTemperatureTime}</Text>
                    </View>
                </View>
                <View style={styles.table}>
                    <View style={styles.tableTitle1}>
                        <Text style={styles.tableText}>トイレ</Text>
                    </View>
                    <View style={styles.tableTitle2}>
                        <Text style={styles.tableText}>おしっこ</Text>
                        <Text style={styles.tableText}>うんち</Text>
                    </View>
                    <View style={styles.tableTitle2}>
                        <Text style={styles.tableText}>{oshikkoCount}回</Text>
                        <Text style={styles.tableText}>{unchiCount}回</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: 'red',
        justifyContent: 'center',
        //flexDirection: 'row',
        //borderTopWidth: 1,
        justifyContent: 'space-around',//横並び均等配置,
        //backgroundColor: '#eee8aa',
    },
    tableSpace: {
        //backgroundColor: 'red',
        justifyContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',//横並び均等配置
    },
    table: {
        //backgroundColor: '#eee8aa',
        //flexDirection: 'row',
        //paddingVertical: 16,
        //justifyContent: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
        borderWidth: 3,
        borderColor: '#c8e1ff',
        borderRadius: 10,
        height: '100%',
        alignItems: 'center',
        width: '30%',
    },
    tabledesign: {
        //flexDirection: 'row',
        //alignItems:'center',
    },
    tableTitle1: {
        flexDirection: 'row',
        //padding: 3 ,
        //margin: '1%',
        //paddingLeft: '10%',
        //paddingRight: '10%',
        //fontWeight: 'bold',
        //backgroundColor: '#676556',
        //width: '90%',
        flexGrow: 1,
        //textAlign: 'center',
        alignItems: 'center',//縦中央
        justifyContent: 'center',//横中央
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
        //justifyContent: 'center',//横中央
        //textAlign: 'center',
        //lineHeight: 1,
        fontSize: 15,
    },
});