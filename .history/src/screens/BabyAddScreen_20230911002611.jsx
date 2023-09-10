import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, } from 'react-native';
import firebase from 'firebase';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useCurrentBabyContext } from '../context/CurrentBabyContext';

import Button from '../components/Button';

export default function BabyAddScreen(props) {
    const { navigation } = props;
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [birthday, setBirthday] = useState();
    const [detailTime, setDetailTime] = useState('誕生日を選択');
    
    const [babyName, setBabyName] = useState('');

    function handlePress() {
        if( babyName !== "" && birthday !== undefined) {
            const db = firebase.firestore();
            const { currentUser } = firebase.auth();
            const ref = db.collection(`users/${currentUser.uid}/babyData`)
            Alert.alert('以下の情報で登録します\n名前:' + babyName + '\n誕生日:' + detailTime, 'よろしいですか？', [
                {
                    text: 'キャンセル',
                    onPress: () => {},
                },
                {
                    text: '登録する',
                    //style: 'destructive',
                    onPress: () => {
                        //navigation.jumpTo('Home');
                        ref.add({
                            babyName,
                            birthday,
                        })
                        .then((docRef) => {
                            currentBabyDispatch({ 
                                type: "addBaby",
                                babyName: babyName,
                                babyBirthday: birthday,
                                babyId: docRef.id,
                            })
                        })
                        .catch((error) => {
                            console.log('失敗しました', error);
                        });
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
        <View style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.title}>赤ちゃん登録</Text>
                <Text style={styles.inputText}>名前</Text>
                <TextInput
                    style={styles.input}
                    value={babyName}
                    onChangeText={(text) => { setBabyName(text); }}
                    autoCapitalize="none"
                    keyboardType="default"
                    placeholder="入力してください"
                    placeholderTextColor="#BFBFBF"
                />
                <Text style={styles.inputText}>誕生日</Text>
                <TouchableOpacity style={styles.birthdayArea} onPress={showDatePicker}>
                    <Text style={styles.birthdayInput}>{detailTime}</Text>
                </TouchableOpacity>
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
                <Button
                    label="登録"
                    onPress={handlePress}
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
    inner: {
        paddingHorizontal: 27,
        paddingVertical: 24,
    },
    inputText: {
        fontSize: 15,
        lineHeight: 32,
        //fontWeight: 'bold',
        marginBottom: 1,
        color: '#737373',
    },
    title: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    input: {
        fontSize: 16,
        height: 48,
        borderColor: '#DDDDDD',
        borderWidth: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 8,
        marginBottom: 20,
    },
    birthdayInput: {
        fontSize: 16,
        height: 48,
        borderColor: '#DDDDDD',
        borderWidth: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 8,
        lineHeight: 48,
    },
    buttonArea: {
        flexDirection: 'row',
    },
});