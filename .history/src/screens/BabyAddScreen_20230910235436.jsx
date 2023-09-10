import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, } from 'react-native';
import firebase from 'firebase';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import Button from '../components/Button';
import Loading from '../components/Loading';
import { translateErrors } from '../utils';

export default function BabyAddScreen(props) {
    const { navigation } = props;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const [isLoading, setLoading] = useState(true);
    const [isLoading, setLoading] = useState(false);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [detaiBirthday, setDetailBirthday] = useState('誕生日を選択');

    const [babyNameData, setBabyNameData] = useState('');
    const [babyIdData, setBabyIdData] = useState('');
    const [babyBirthdayData, setBabyBirthdayData] = useState('');

    function handlePress() {
        if( babyName !== "" && birthday !== undefined) {
            const db = firebase.firestore();
            const { currentUser } = firebase.auth();
            const ref = db.collection(`users/${currentUser.uid}/babyData`)
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
                        toggleModal()
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
        setDetailBirthday(date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日');
    };

    //決定ボタン押下時の処理
    const handleConfirm = (date) => {
        setBabyBirthdayData(date);
        formatDatetime(date);
        hideDatePicker();
    };

    return (
        <View style={styles.container}>
            <Loading isLoading={isLoading} />
            <View style={styles.inner}>
                <Text style={styles.title}>赤ちゃん登録</Text>
                <Text style={styles.inputText}>名前</Text>
                <TextInput
                    style={styles.input}
                    value={babyNameData}
                    onChangeText={(text) => { setBabyNameData(text); }}
                    autoCapitalize="none"
                    keyboardType="default"
                    placeholder="入力してください"
                    placeholderTextColor="#BFBFBF"
                />
                <Text style={styles.inputText}>誕生日</Text>
                <TouchableOpacity style={styles.birthdayArea} onPress={showDatePicker}>
                    <Text style={styles.birthdayInput}>{detaiBirthday}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    value={new Date(babyBirthdayData)}
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
                    date={new Date(babyBirthdayData)}//ピッカー日付デフォルト
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
});