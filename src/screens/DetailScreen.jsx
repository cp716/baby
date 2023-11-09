import React, { useState } from "react";
import { Button, View, StyleSheet, Text } from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import MilkEditForm from "../components/EditForm/MilkEditForm";
import FoodEditForm from "../components/EditForm/FoodEditForm";
import DiseaseEditForm from "../components/EditForm/DiseaseEditForm";
import ToiletEditForm from "../components/EditForm/ToiletEditForm";
import FreeEditForm from "../components/EditForm/FreeEditForm";
import { useDateTimeContext } from '../context/DateTimeContext';

export default function DetailScreen(props) {
    const { dateTimeState, dateTimeDispatch } = useDateTimeContext();
    const { babyData }  = props;
    const { toggleModal } = props;
    const dateTime = new Date(babyData.record_time);

    const month = dateTime.getMonth();
    const day = dateTime.getDate();
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const mdhm =  month + 1 + '月' + day + '日' + hours + '時' + minutes + '分';

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectTime, setselectTime] = useState(dateTime);
    const [detailTime, setDetailTime] = useState(mdhm);
    
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
        const month = date.getMonth();
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        setDetailTime(month + 1 + '月' + day + '日' + hours + '時' + minutes + '分');
    };

    //決定ボタン押下時の処理
    const handleConfirm = (date) => {
        setselectTime(date);
        formatDatetime(date);
        dateTimeDispatch({ type: "timeUpdate", hours: dateTimeState.hours, minutes: dateTimeState.minutes });
        hideDatePicker();
    };

    return (
        <View style={modalStyles.container}>
            <View>
                <Button title={String(detailTime)} onPress={showDatePicker} />
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    value={selectTime}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    mode="time"//入力項目
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
            <View>
                {(() => {
                    if (babyData.category == 'JUNYU' || babyData.category == 'MILK' || babyData.category == 'BONYU') {
                        return (
                            <MilkEditForm selectTime={selectTime} babyData={babyData} toggleModal={toggleModal} />
                        );
                    } else if (babyData.category == 'FOOD' || babyData.category == 'DRINK') {
                        return (
                            <FoodEditForm selectTime={selectTime} babyData={babyData} toggleModal={toggleModal} />
                        );
                    } else if (babyData.category == 'TOILET') {
                        return (
                            <ToiletEditForm selectTime={selectTime} babyData={babyData} toggleModal={toggleModal} />
                        );
                    } else if (babyData.category == 'DISEASE') {
                        return (
                            <DiseaseEditForm selectTime={selectTime} babyData={babyData} toggleModal={toggleModal} />
                        );
                    } else if (babyData.category == 'FREE') {
                        return (
                            <FreeEditForm selectTime={selectTime} babyData={babyData} toggleModal={toggleModal} />
                        );
                    }
                })()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputTypeContainer: {
        paddingHorizontal: 27,
        paddingVertical: 10,
        height: 50,
        backgroundColor: '#987652',
        //flex: 1,
        flexDirection: 'row',
        //width: 350 ,
        
    },
    inputContainer: {
        paddingHorizontal: 27,
        paddingVertical: 10,
        height: 150,
        backgroundColor: '#859602'
        //flex: 1,
    },
    input: {
        flex: 1,
        textAlignVertical: 'top',
        fontSize: 16,
        lineHeight: 24,
        backgroundColor: '#ffffff'
    },
    iconStyle: {
        marginLeft: 'auto',
        marginRight: 'auto',
    },
});

const modalStyles = StyleSheet.create({
    modalButton : {
        backgroundColor : '#FFF',
        borderColor : '#36C1A7',
        borderWidth : 1,
        borderRadius : 10,
    },
    container : {
        backgroundColor : '#F0F4F8',
        padding : '5%',
        borderColor : '#F0F4F8',
        borderWidth : 5,
        borderRadius : 10,
    },
    modalButtonText : {
        color : '#36C1A7',
        fontWeight : 'bold',
        textAlign : 'center',
        padding: 10,
        fontSize: 20,
    },
    //arrow : {
        //color : '#36C1A7',
    //},
});
