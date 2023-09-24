import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Button from '../components/Button';

export default function BabyEditScreen(props) {
    const { route, navigation } = props;
    const { babyId, babyName, babyBirthday } = route.params;
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [babyNameData, setBabyNameData] = useState(babyName);
    const [babyIdData, setBabyIdData] = useState(babyId);
    const [babyBirthdayData, setBabyBirthdayData] = useState(new Date(babyBirthday));
    const [detaiBirthday, setDetailBirthday] = useState('');

    useEffect(() => {
        const date = new Date(babyBirthday)
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        setDetailBirthday(year + '年' + (month + 1) + '月' + day + '日')
    }, [babyBirthday]);

    console.log(new Date(babyBirthday))

    useEffect(() => {
        setBabyBirthdayData(new Date(babyBirthday));
    }, [babyBirthday]);

    const updateBabyData = () => {
        Alert.alert('以下の情報へ更新します\n名前:' + babyNameData + '\n誕生日:' + detaiBirthday, 'よろしいですか？', [
            {
                text: 'いいえ',
                onPress: () => {},
            },
            {
                text: 'はい',
                onPress: () => {
                    if (babyNameData !== "") {
                        const db = SQLite.openDatabase('DB.db');
                
                        db.transaction(
                            (tx) => {
                            tx.executeSql(
                                'UPDATE babyData SET babyName = ?, birthday = ? WHERE id = ?',
                                [babyNameData, babyBirthdayData.toISOString(), babyIdData],
                                (_, result) => {
                                Alert.alert('更新が完了しました');
                                navigation.goBack();
                                },
                                (_, error) => {
                                Alert.alert('更新中にエラーが発生しました');
                                console.error('データの更新中にエラーが発生しました:', error);
                                }
                            );
                            }
                        );
                    } else {
                        Alert.alert('名前は必須です');
                    }
                },
            },
        ]);




        
    };

    const deleteBabyData = () => {
        Alert.alert('「' + babyNameData + '」に関する全ての記録が削除されます', 'よろしいですか？', [
            {
                text: 'キャンセル',
                onPress: () => {},
            },
            {
                text: 'はい',
                style: 'destructive',
                onPress: () => {
                    Alert.alert('削除後はデータの復旧ができません', '本当によろしいですか？', [
                        {
                            text: 'キャンセル',
                            onPress: () => {},
                        },
                        {
                            text: '削除',
                            style: 'destructive',
                            onPress: () => {
                                const db = SQLite.openDatabase('DB.db');
                                db.transaction(
                                (tx) => {
                                    tx.executeSql(
                                    'DELETE FROM babyData WHERE id = ?',
                                    [babyIdData],
                                    (_, result) => {
                                        Alert.alert('削除が完了しました');
                                        navigation.goBack();
                                    },
                                    (_, error) => {
                                        Alert.alert('削除中にエラーが発生しました');
                                        console.error('データの削除中にエラーが発生しました:', error);
                                    }
                                    );
                                }
                                );
                            },
                        },
                    ]);
                },
            },
        ]);
    };

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
                        onPress={deleteBabyData}
                    />
                    <Button
                        label="更新"
                        onPress={updateBabyData}
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
