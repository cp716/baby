import React, { useState ,Component } from 'react';
import Swiper from 'react-native-swiper'
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Table, TableWrapper, Row, Col } from 'react-native-table-component';
import { useBabyRecordContext } from '../context/BabyRecordContext';
import Modal from "react-native-modal";
import DatePicker from 'react-native-modern-datepicker';

export default function RecordScreen() {
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const nowDateYear = new Date().getFullYear();
    const nowDateMonth = new Date().getMonth() + 1;
    const [date, setDate] = useState(`${nowDateYear}/${nowDateMonth.toString().padStart(2, "0")}/01`);
    const { babyRecordState, babyRecordDispatch } = useBabyRecordContext();
    let selectYear = date.slice( 0, 4 );
    let selectMonth = date.slice( 5, 7 );
    console.log(date)
    console.log(selectYear)
    console.log(selectMonth)
    const groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    const tableHead = ['授乳', '哺乳瓶', 'ご飯', 'トイレ', '病気', '体温']
    const sybTableHead = ['左', '右', 'ミルク', '母乳', '炭水化物', 'タンパク質', 'ミネラル', '調味料', '飲み物', 'おしっこ', 'うんち', '鼻水', '咳', '嘔吐', '発疹', '怪我', '薬', '最高', '最低']
    const widthArr = [100, 100, 250, 100, 300, 100]

    const lastDay = new Date( selectYear, selectMonth, 0 ) ;

    const tableData = [];
    for (let i = 1; i < lastDay.getDate() + 1; i += 1) {
    //for (let i = 1; i < 16; i += 1) {
        let junyLeftTotal = 0;
        let junyRightTotal = 0;
        let milkTotal = 0;
        let bonyuTotal = 0;
        let bonyuCount = 0;
        
        let oshikkoCount = 0;
        let unchiCount = 0;
        
        let maxBodyTemperature = '-';
        let minBodyTemperature = '-';

        let foodCount = 0;
        let tansuikabutsuCount = 0;
        let tampakushitsuCount = 0;
        let bitaminCount = 0;
        let chomiryoCount = 0;
        let drinkTotal = 0;

        let hanamizuCount = 0;
        let sekiCount = 0;
        let otoCount = 0;
        let hosshinCount = 0;
        let kegaCount = 0;
        let kusuriCount = 0;

        const x = babyRecordState.babyData.filter((data) => data.day == [i])
        const groupByCategory = groupBy(x, 'category');
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
            if(toilet[key].toilet.oshikko) {
                oshikkoCount += 1
            }
            if(toilet[key].toilet.unchi) {
                unchiCount += 1
            }
        }

        for (let key in food) {
            if(food[key].food.tansuikabutsu) {
                tansuikabutsuCount += 1
            }
            if(food[key].food.tampakushitsu) {
                tampakushitsuCount += 1
            }
            if(food[key].food.bitamin) {
                bitaminCount += 1
            }
            if(food[key].food.chomiryo) {
                chomiryoCount += 1
            }
            if(!isNaN(food[key].food.drink)) {
                drinkTotal += food[key].food.drink
            }
            foodCount += 1
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

        for (let key in disease) {
            if(!isNaN(disease[key].disease.bodyTemperature)) {
                maxBodyTemperature = disease[key].disease.bodyTemperature + '°'
                minBodyTemperature = disease[key].disease.bodyTemperature + '°'
            }
        }

        const rowData = [];

        rowData.push(`${junyLeftTotal}ml`);
        rowData.push(`${junyRightTotal}ml`);
        rowData.push(`${milkTotal}ml`);
        rowData.push(`${bonyuTotal}ml`);
        rowData.push(`${tansuikabutsuCount}回`);
        rowData.push(`${tampakushitsuCount}回`);
        rowData.push(`${bitaminCount}回`);
        rowData.push(`${chomiryoCount}回`);
        rowData.push(`${drinkTotal}ml`);
        rowData.push(`${oshikkoCount}回`);
        rowData.push(`${unchiCount}回`);
        rowData.push(`${hanamizuCount}回`);
        rowData.push(`${sekiCount}回`);
        rowData.push(`${otoCount}回`);
        rowData.push(`${hosshinCount}回`);
        rowData.push(`${kegaCount}回`);
        rowData.push(`${kusuriCount}`);
        rowData.push(`${maxBodyTemperature}`);
        rowData.push(`${minBodyTemperature}`);
        
        tableData.push(rowData);
    }

    const tableDateData = [];
    tableDateData.push(['']);
    tableDateData.push(['○月']);
    for (let i = 1; i < lastDay.getDate() + 1; i += 1) {
    //for (let i = 1; i < 16; i += 1) {
            const rowData = [];
        rowData.push(`${i}日`);
        tableDateData.push(rowData);
    }
    tableDateData.splice(17, 0, ['']);
    tableDateData.splice(18, 0, ['○月']);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.babyAddButton}
                onPress={() => {
                    toggleModal();
                }}
            >
                <Text style={styles.babyAddButtonText}>
                    {selectYear}年{selectMonth}月
                </Text>
            </TouchableOpacity>
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
                onIndexChanged={(index) => {console.log(index)}}
                showsPagination={true}//下部マーク
                loop={false}//連続ループ
                //index={dateTimeState.day - 1}
                loadMinimal={true}
                //renderPagination={renderPagination}
            >
                <View style={styles.table}>
                    <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                        {
                            tableDateData.slice(0,17).map((rowData, index) => (
                                <Row
                                    key={index}
                                    data={rowData}
                                    widthArr={[50]}
                                    style={styles.row}
                                    textStyle={styles.text}
                                />
                            ))
                        }
                    </Table>
                    <ScrollView horizontal={true} style={styles.dataWrapper}>
                        <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                            <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text}/>
                            <Row data={sybTableHead} widthArr={[50, 50, 50, 50, 50, 50, 50, 50, 50, 50,50, 50, 50, 50, 50, 50, 50, 50, 50]} style={styles.header} textStyle={styles.text}/>
                            {
                                tableData.slice(0,15).map((rowData, index) => (
                                    <Row
                                        key={index}
                                        data={rowData}
                                        widthArr={[50, 50, 50, 50, 50, 50, 50, 50, 50, 50,50, 50, 50, 50, 50, 50, 50, 50, 50]}
                                        style={styles.row}
                                        textStyle={styles.text}
                                    />
                                ))
                            }
                        </Table>
                        
                    </ScrollView>
                </View>
                <View style={styles.table}>
                    <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                        {
                            tableDateData.slice(17).map((rowData, index) => (
                                <Row
                                    key={index}
                                    data={rowData}
                                    widthArr={[50]}
                                    style={styles.row}
                                    textStyle={styles.text}
                                />
                            ))
                        }
                    </Table>
                    <ScrollView horizontal={true} style={styles.dataWrapper}>
                        <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                            <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text}/>
                            <Row data={sybTableHead} widthArr={[50, 50, 50, 50, 50, 50, 50, 50, 50, 50,50, 50, 50, 50, 50, 50, 50, 50, 50]} style={styles.header} textStyle={styles.text}/>
                            {
                                tableData.slice(15).map((rowData, index) => (
                                    <Row
                                        key={index}
                                        data={rowData}
                                        widthArr={[50, 50, 50, 50, 50, 50, 50, 50, 50, 50,50, 50, 50, 50, 50, 50, 50, 50, 50]}
                                        style={styles.row}
                                        textStyle={styles.text}
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
        padding: 16,
        paddingTop: 80,
        backgroundColor: '#fff',
    },
    table: { flexDirection: 'row' },
    header: { height: 30 },
    text: { textAlign: 'center', fontWeight: '100' },
    dataWrapper: { marginLeft: -1 }, //flexDirection: 'column'
    row: { height: 30 },
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
        padding: 10,
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