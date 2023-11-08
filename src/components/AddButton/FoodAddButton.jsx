import React, { useState } from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import FoodInputForm from "./FoodInputForm";
import Modal from "react-native-modal";
import CircleButton from "../CircleButton";
import { useDateTimeContext } from "../../context/DateTimeContext";

export default function FoodAddButton() {
    const { dateTimeState } = useDateTimeContext();

    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectTime, setselectTime] = useState();
    const [detailTime, setDetailTime] = useState();

    const getNewDate = (date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        setDetailTime(dateTimeState.month + '月' + dateTimeState.day + '日' + '  ' + hours + '時' + minutes + '分')
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
        setDetailTime(dateTimeState.month + '月' + dateTimeState.day + '日' + '  ' + hours + '時' + minutes + '分');
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
                name="food-fork-drink"
                onPress={() => {
                    toggleModal();
                    getNewDate(new Date(Math.floor(new Date().getTime()/1000/60/5)*1000*60*5));
                }}
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
                    <View>
                        <TouchableOpacity
                            onPress={showDatePicker}
                            style={styles.buttonContainer} // ボタンコンテナのスタイルを設定
                        >
                            <Text style={styles.buttonText}>{String(detailTime)}</Text>
                        </TouchableOpacity>
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
                        <FoodInputForm selectTime={selectTime} toggleModal={toggleModal}/>
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
    buttonContainer: {
        backgroundColor: '#fff',
        borderColor: '#737373',
        borderWidth: 0.5,
        borderRadius: 5,
        padding: '5%',
        margin: '5%',
        width: '85%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    buttonText: {
        color: '#0080FF',
        //fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
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
});
