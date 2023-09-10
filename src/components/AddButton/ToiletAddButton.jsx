import React, { useState } from "react";
import { Button, View, StyleSheet, Text, Image } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ToiletInputForm from "./ToiletInputForm";
import ModalSelectBaby from "../ModalSelectBaby";
import Modal from "react-native-modal";
import CircleButton from "../CircleButton";
import { useDateTimeContext } from "../../context/DateTimeContext";

export default function ToiletAddButton() {
    const { dateTimeState } = useDateTimeContext();

    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const [isBabyModalVisible, setBabyModalVisible] = useState(false);
    const toggleBabyModal = () => {
        setBabyModalVisible(!isBabyModalVisible);
    };

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectTime, setselectTime] = useState();
    const [detailTime, setDetailTime] = useState();

    const getNewDate = (date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        setDetailTime(dateTimeState.month + '月' + dateTimeState.day + '日' + hours + '時' + minutes + '分')
        setselectTime(new Date(dateTimeState.year, dateTimeState.month-1, dateTimeState.day, hours, minutes, "00" ))
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
        const hours = date.getHours();
        const minutes = date.getMinutes();
        setDetailTime(dateTimeState.month + '月' + dateTimeState.day + '日' + hours + '時' + minutes + '分');
    };

    //決定ボタン押下時の処理
    const handleConfirm = (date) => {
        setselectTime(date);
        formatDatetime(date);
        hideDatePicker();
    };

    return (
        <View>
            <CircleButton
                name="toilet"
                onPress={() => {
                    toggleModal();
                    getNewDate(new Date(Math.floor(new Date().getTime()/1000/60/5)*1000*60*5));
                }}
                onLongPress={() => {
                    toggleBabyModal();
                }}
                //style={{ top: 80, bottom: 'auto'}}
            />
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
                    <Text style={modalStyles.title}>トイレ登録</Text>
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
                        <ToiletInputForm selectTime={selectTime} toggleModal={toggleModal}/>
                    </View>
                </View>
            </Modal>
            <Modal isVisible={isBabyModalVisible}
                onBackdropPress={toggleBabyModal}
                backdropTransitionOutTiming={0}
                //modalレパートリー
                //"bounce" | "flash" | "jello" | "pulse" | "rotate" | "rubberBand" | "shake" | "swing" | "tada" | "wobble" | "bounceIn" | "bounceInDown" | "bounceInUp" | "bounceInLeft" | "bounceInRight" | "bounceOut" | "bounceOutDown" | "bounceOutUp" | "bounceOutLeft" | "bounceOutRight" | "fadeIn" | "fadeInDown" | "fadeInDownBig" | "fadeInUp" | "fadeInUpBig" | "fadeInLeft" | "fadeInLeftBig" | "fadeInRight" | "fadeInRightBig" | "fadeOut" | "fadeOutDown" | "fadeOutDownBig" | "fadeOutUp" | "fadeOutUpBig" | "fadeOutLeft" | "fadeOutLeftBig" | "fadeOutRight" | "fadeOutRightBig" | "flipInX" | "flipInY" | "flipOutX" | "flipOutY" | "lightSpeedIn" | "lightSpeedOut" | "slideInDown" | "slideInUp" | "slideInLeft" | "slideInRight" | "slideOutDown" | "slideOutUp" | "slideOutLeft" | "slideOutRight" | "zoomIn" | "zoomInDown" | "zoomInUp" | "zoomInLeft" | "zoomInRight" | "zoomOut" | "zoomOutDown" | "zoomOutUp" | "zoomOutLeft" | "zoomOutRight" |
                //animationIn="fadeInUpBig"
                //animationOut="fadeOutDownBig"
                animationIn="fadeIn"
                animationOut="fadeOut"
                //avoidKeyboard={true}
                //swipeDirection="down"
                //onSwipeComplete={toggleBabyModal}
                >
                <View style={modalStyles.container}>
                    <Text style={modalStyles.title}>表示中の赤ちゃんを変更</Text>
                    <View>
                        <ModalSelectBaby selectTime={selectTime} toggleBabyModal={toggleBabyModal}/>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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