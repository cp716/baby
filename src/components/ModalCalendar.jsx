import React, { useState } from "react";
import { View, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import Modal from "react-native-modal";
import { useDateTimeContext } from "../context/DateTimeContext";

export default function ModalCalendar() {
    const { dateTimeState, dateTimeDispatch } = useDateTimeContext();
    const dayOfWeek = [ "日", "月", "火", "水", "木", "金", "土" ] ;

    //let test = false;
    const [test, settest] = useState(false);

    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const vacation = { color: 'red', selectedDotColor: 'blue'};
    const massage = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
    const workout = {key: 'workout', color: 'green'};

    //テキスト表示設定
    LocaleConfig.locales['jp'] = {
        monthNames: [
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '8月',
            '9月',
            '10月',
            '11月',
            '12月'
        ],
        monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        dayNames: ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜'],
        dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
        today: "Aujourd'hui"
    };
    LocaleConfig.defaultLocale = 'jp';

    return (
        <View>
            <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
                <Text style={styles.modalButtonText}>{String(dateTimeState.year + "年" + dateTimeState.month + "月" + dateTimeState.day + "日" + "(" + dayOfWeek[dateTimeState.youbiCount] + ")")}</Text>
            </TouchableOpacity>
            <Modal isVisible={isModalVisible}
                onBackdropPress={toggleModal}
                backdropTransitionOutTiming={0}
                //modalレパートリー
                //"bounce" | "flash" | "jello" | "pulse" | "rotate" | "rubberBand" | "shake" | "swing" | "tada" | "wobble" | "bounceIn" | "bounceInDown" | "bounceInUp" | "bounceInLeft" | "bounceInRight" | "bounceOut" | "bounceOutDown" | "bounceOutUp" | "bounceOutLeft" | "bounceOutRight" | "fadeIn" | "fadeInDown" | "fadeInDownBig" | "fadeInUp" | "fadeInUpBig" | "fadeInLeft" | "fadeInLeftBig" | "fadeInRight" | "fadeInRightBig" | "fadeOut" | "fadeOutDown" | "fadeOutDownBig" | "fadeOutUp" | "fadeOutUpBig" | "fadeOutLeft" | "fadeOutLeftBig" | "fadeOutRight" | "fadeOutRightBig" | "flipInX" | "flipInY" | "flipOutX" | "flipOutY" | "lightSpeedIn" | "lightSpeedOut" | "slideInDown" | "slideInUp" | "slideInLeft" | "slideInRight" | "slideOutDown" | "slideOutUp" | "slideOutLeft" | "slideOutRight" | "zoomIn" | "zoomInDown" | "zoomInUp" | "zoomInLeft" | "zoomInRight" | "zoomOut" | "zoomOutDown" | "zoomOutUp" | "zoomOutLeft" | "zoomOutRight" |
                animationIn="fadeIn"
                animationOut="fadeOut"
                >
                <View style={styles.container}>
                    <Text style={styles.title}>日付を選択してください</Text>
                    <Calendar
                        //6行表示
                        showSixWeeks
                        //カレンダー起動時の表示月
                        current={dateTimeState.year + '-' + ( '00' + dateTimeState.month ).slice( -2 ) + '-' + ( '00' + dateTimeState.day ).slice( -2 )}                        
                        //日付選択時の処理
                        onDayPress={day => {
                            dateTimeDispatch({
                                type: "selectDate",
                                year: day.year,
                                month: day.month,
                                day: day.day,
                                timestamp: new Date(day.timestamp)
                            })
                            settest(true)
                        }}
                        //日付長押し時の処理
                        onDayLongPress={day => {
                            //console.log('selected day', day);
                        }}
                        //カレンダートップ表示形式
                        monthFormat={'yyyy年 M月'}
                        //月切替時の処理
                        onMonthChange={month => {
                            //console.log('month changed', month);
                        }}
                        // 横スワイプ有効
                        enableSwipeMonths={true}
                        //カレンダー日付デザイン
                        markingType={'multi-dot'}
                        markedDates={{
                            //選択日カラー
                            [dateTimeState.year + '-' + ( '00' + dateTimeState.month ).slice( -2 ) + '-' + ( '00' + dateTimeState.day ).slice( -2 )]: {selected: true, selectedColor: '#36C1A7'},
                            //[dateTimeState.year + '-' + ( '00' + dateTimeState.month ).slice( -2 ) + '-' + ( '00' + dateTimeState.day ).slice( -2 )]: {dots: [vacation, massage, workout], selected: test, selectedColor: 'green'},
                            //'2023-01-20': {dots: [massage, workout], disabled: true}
                        }}

                        style={{
                            //borderWidth: 5,
                            //borderColor: 'gray',
                            //height: 400,
                            //borderRadius: 10,
                        }}

                        theme={{
                            'stylesheet.calendar.header': {
                                dayTextAtIndex0: {
                                color: 'red'
                                },
                                dayTextAtIndex1: {
                                    color: 'black'
                                },
                                dayTextAtIndex2: {
                                    color: 'black'
                                },
                                dayTextAtIndex3: {
                                    color: 'black'
                                },
                                dayTextAtIndex4: {
                                    color: 'black'
                                },
                                dayTextAtIndex5: {
                                    color: 'black'
                                },    
                                dayTextAtIndex6: {
                                color: 'blue'
                                },
                            },
                            //backgroundColor: 'red',
                            //calendarBackground: '#ffffff',
                            //textSectionTitleColor: '#b6c1cd',
                            //textSectionTitleDisabledColor: '#d9e1e8',
                            selectedDayBackgroundColor: '#00adf5',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#00adf5',
                            //dayTextColor: '#2d4150',
                            textDisabledColor: '#d9e1e8',
                            //dotColor: '#00adf5',
                            //selectedDotColor: '#ffffff',
                            arrowColor: '#36C1A7',
                            //disabledArrowColor: '#d9e1e8',
                            //monthTextColor: 'blue',
                            //indicatorColor: 'red',
                            //textDayFontFamily: 'monospace',
                            //textMonthFontFamily: 'monospace',
                            //textDayHeaderFontFamily: 'monospace',
                            //textDayFontWeight: '300',
                            //textMonthFontWeight: 'bold',
                            //textDayHeaderFontWeight: '600',
                            //textDayFontSize: 16,
                            //textMonthFontSize: 16,
                            //textDayHeaderFontSize: 16
                        }}
                    />
                    <TouchableOpacity style={styles.confirmButton} onPress={toggleModal} >
                        <Text style={styles.confirmButtonText}>close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalButton : {
        //backgroundColor : '#FFF',
        //borderColor : '#36C1A7',
        //borderWidth : 1,
        //borderRadius : 10,
    },
    modalButtonText : {
        color : '#737373',
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
    confirmButton : {
        marginTop : '5%',
        backgroundColor : '#FFF',
        borderColor : '#36C1A7',
        borderWidth : 1,
        borderRadius : 10,
    },
    confirmButtonText : {
        color : '#36C1A7',
        fontWeight : 'bold',
        textAlign : 'center',
        padding: 10,
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: '#eee8aa',
        //flexDirection: 'row',
        //paddingVertical: 16,
        //justifyContent: 'center',
        //height: '100%',
        //alignItems: 'center',
        //flexDirection: 'row',
        //alignItems:'center',
        //fontSize: 13,
        //lineHeight: 16,
        //padding: 3 ,
        //margin: '1%',
        //paddingLeft: '10%',
        //paddingRight: '10%',
        //backgroundColor: '#676556',
        width: '20%',
        //flexGrow: 1,
        textAlign: 'center',
    },
});