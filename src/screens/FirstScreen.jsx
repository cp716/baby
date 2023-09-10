import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, Button } from 'react-native';
import firebase from 'firebase';
import storage from '../context/Storage';
import { useCurrentBabyContext } from '../context/CurrentBabyContext';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function FirstScreen(props) {
    //const { navigation } = props;
    //const { toggleModal } = props;

    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();

    const date = new Date();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [birthday, setBirthday] = useState();
    const [detailTime, setDetailTime] = useState('誕生日を選択');
    
    //const [babyData, setBabyData] = useState('');
    const [babyName, setBabyName] = useState('');

    function handlePress() {
        
        const db = firebase.firestore();
        const { currentUser } = firebase.auth();
        //const ref = db.collection(`users/${currentUser.uid}/baby`);

        const ref = db.collection(`users/${currentUser.uid}/babyData`)
        if( babyName !== "" && birthday !== undefined) {
            Alert.alert('「' + babyName + '」を登録します', 'よろしいですか？', [
                {
                    text: 'キャンセル',
                    onPress: () => {},
                },
                {
                    text: '登録する',
                    //style: 'destructive',
                    onPress: () => {
                        //navigation.jumpTo('Home');
                        //toggleModal()
                        
                        ref.add({
                            babyName,
                            birthday,
                            //updatedAt: date,
                        })
                        .then((docRef) => {
                            console.log('登録しました', docRef.id);
                            currentBabyDispatch({ 
                                type: "addBaby",
                                babyName: babyName,
                                babyBirthday: birthday,
                                babyId: docRef.id,
                            })
                            storage.save({
                                key: 'selectbaby',
                                data: {
                                    babyName: babyName,
                                    birthday: birthday,
                                    babyId: docRef.id,
                                    //updatedAt: date,
                                },
                            })
                        })
                        .catch((error) => {
                            console.log('失敗しました', error);
                        });
                        //toggleModal()
                    },
                },
            ]);
        } else {
            Alert.alert("未入力です");
        }
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
        setDetailTime(date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日');
    };

    //決定ボタン押下時の処理
    const handleConfirm = (date) => {
        setBirthday(date);
        formatDatetime(date);
        hideDatePicker();
    };

    return (
        <ScrollView scrollEnabled={false}>
            <View style={styles.inputContainer}>
                <Text>名前</Text>
                <TextInput
                        keyboardType="web-search"
                        value={babyName}
                        style={styles.input}
                        onChangeText={(text) => { setBabyName(text); }}
                        //autoFocus
                        placeholder = "赤ちゃんの名前を入力"
                />
            </View>
            <View>
                        <Button title={String(detailTime)} onPress={showDatePicker} />
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            value={birthday}
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
                            date={birthday}//ピッカー日付デフォルト
                        />
                    </View>
            <View style={modalStyles.container}>
                <TouchableOpacity style={modalStyles.confirmButton} onPress={handlePress} >
                    <Text style={modalStyles.confirmButtonText}>登録</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    inputTypeContainer: {
        paddingHorizontal: 27,
        paddingVertical: 10,
        //height: 50,
        //backgroundColor: '#987652',
        //flex: 1,
        //flexDirection: 'row',
        //width: 350 ,
    },
    inputContainer: {
        paddingHorizontal: 27,
        paddingVertical: 10,
        height: 80,
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
});

const modalStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    confirmButton : {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop : '5%',
        backgroundColor : '#FFF',
        borderColor : '#36C1A7',
        borderWidth : 1,
        borderRadius : 10,
        width: "40%",
    },
    confirmButtonText : {
        color : '#36C1A7',
        fontWeight : 'bold',
        textAlign : 'center',
        padding: 10,
        fontSize: 16,
    },
});