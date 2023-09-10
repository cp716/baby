import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from 'react-native';
import DrawerButton from '../components/DrawerButton';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { useDateTimeContext } from "../context/DateTimeContext";

export default function TestScreen(props) {
    const { dateTimeState } = useDateTimeContext();

    const { navigation } = props;
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <DrawerButton />,
        });
    }, []);

    const today = new Date()

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectTime, setselectTime] = useState(today);
    const [detailTime, setDetailTime] = useState(today.getFullYear() + '年' + (today.getMonth()+1) + '月' + today.getDate() + '日');

    const getNewDate = (date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        setDetailTime(dateTimeState.month + '月' + dateTimeState.day + '日')
        setselectTime(new Date(dateTimeState.year, dateTimeState.month-1 ))
    }
    
    //起動
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    //終了
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    //表示用のstateへ日時を代入
    const formatDatetime = (date) => {
        const year = date.getFullYear()
        const month = (date.getMonth()+1)
        const day = date.getDate()
        setDetailTime(year + '年' + month + '月' + day + '日');
    };

    //決定ボタン押下時の処理
    const handleConfirm = (date) => {
        setselectTime(date);
        formatDatetime(date);
        hideDatePicker();
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={[styles.dateTime , {height: '15%'}]}>
                <Button title={String(detailTime)} onPress={showDatePicker} />
                <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                value={selectTime}
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                                mode="date"//入力項目
                                locale='ja'//日本語化
                                display="spinner"//UIタイプ
                                confirmTextIOS="決定"//決定ボタンテキスト
                                cancelTextIOS="キャンセル"//キャンセルボタンテキスト
                                minuteInterval={5}//分数間隔
                                headerTextIOS=""//入力欄ヘッダーテキスト
                                textColor="blue"//ピッカーカラー
                                date={selectTime}//ピッカー日付デフォルト
                />
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
        height:'25%',
        width:'100%',
        position:'absolute',
        bottom: 0,
        borderTopWidth: 1,
        borderTopColor : 'rgba(0, 0, 0, 100)',
        //paddingBottom: 50,
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
    advertisement: {
        height: '40%',
        //width: '50%',
        alignItems:'center',
        backgroundColor: '#ffffff',
    },
});
