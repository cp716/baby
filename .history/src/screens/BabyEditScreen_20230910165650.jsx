import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, } from 'react-native';
import firebase from 'firebase';
import storage from '../context/Storage';

import Button from '../components/Button';

import { useBabyContext } from '../context/BabyContext';
import { useCurrentBabyContext } from '../context/CurrentBabyContext';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function BabyEditScreen(props) {
    const { navigation } = props;

    const { baby } = useBabyContext();
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [detaiBirthday, setDetailBirthday] = useState('誕生日を選択');

    const [babyNameData, setBabyNameData] = useState('');
    const [babyIdData, setBabyIdData] = useState('');
    const [babyBirthdayData, setBabyBirthdayData] = useState('');

    useEffect(() => {
        storage.load({
            key : 'selectbaby',
        }).then(data => {
            // 読み込み成功時処理
            setBabyNameData(data.babyName)
            setBabyIdData(data.babyId)
            setBabyBirthdayData(new Date(data.babyBirthday))

            const date = new Date(data.babyBirthday)
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            setDetailBirthday(year + '年' + (month + 1) + '月' + day + '日')
        }).catch(err => {
            // 読み込み失敗時処理
            console.log(err)
        });
    }, [baby, currentBabyState]);

    function handlePress() {            
        if( babyNameData !== "") {
            const { currentUser } = firebase.auth();
            const db = firebase.firestore();
            const ref = db.collection(`users/${currentUser.uid}/babyData`).doc(babyIdData);
            Alert.alert('「' + babyNameData + '」の情報を更新します', 'よろしいですか？', [
                {
                    text: 'いいえ',
                    onPress: () => {},
                },
                {
                    text: 'はい',
                    onPress: () => {
                        ref.set({
                            babyName: babyNameData,
                            birthday: babyBirthdayData,
                        })
                        .then((docRef) => {
                            currentBabyDispatch({ 
                                type: "addBaby",
                                babyName: babyNameData,
                                babyBirthday: babyBirthdayData,
                                babyId: babyIdData,
                            })
                            navigation.goBack();
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

    function deleteItem() {
        const { currentUser } = firebase.auth();
        if(currentUser) {
            const db = firebase.firestore();
            const ref = db.collection(`users/${currentUser.uid}/babyData`).doc(babyIdData);
            Alert.alert('削除します', 'よろしいですか？', [
                {
                    text: 'キャンセル',
                    onPress: () => {},
                },
                {
                    text: '削除する',
                    style: 'destructive',
                    onPress: () => {
                        ref.delete().catch(() => {
                            Alert.alert('削除に失敗しました');
                        });
                    },
                },
            ]);
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
            <View style={styles.inner}>
                <Text style={styles.title}>赤ちゃん編集</Text>
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
                <View style={styles.buttonArea}>
                    <Button
                        label="削除"
                        onPress={deleteItem}
                    />
                    <Button
                        label="更新"
                        onPress={handlePress}
                    />
                </View>
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
        marginBottom: 1,
        color: '#737373',
    },
    title: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    birthdayArea: {
        justifyContent: 'center'
    },
    input: {
        fontSize: 16,
        height: 48,
        borderColor: '#DDDDDD',
        borderWidth: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 8,
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