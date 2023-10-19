import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Button from '../components/Button';
import { useCurrentBabyContext } from '../context/CurrentBabyContext';

export default function BabyEditScreen(props) {
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();
    const { route, navigation } = props;
    const { id, name, birthday } = route.params;
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [nameData, setNameData] = useState(name);
    const [idData, setIdData] = useState(id);
    const [birthdayData, setBirthdayData] = useState(new Date(birthday));
    const [detaiBirthday, setDetailBirthday] = useState('');

    useEffect(() => {
        const date = new Date(birthday)
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        setDetailBirthday(year + '年' + (month + 1) + '月' + day + '日')
    }, [birthday]);

    useEffect(() => {
        setBirthdayData(new Date(birthday));
    }, [birthday]);

    const updateBabyData = () => {
        Alert.alert('以下の情報へ更新します\n名前:' + nameData + '\n誕生日:' + detaiBirthday, 'よろしいですか？', [
            {
                text: 'いいえ',
                onPress: () => {},
            },
            {
                text: 'はい',
                onPress: () => {
                    if (nameData !== "") {
                        const db = SQLite.openDatabase('BABY.db');
                        db.transaction(
                            (tx) => {
                            tx.executeSql(
                                'UPDATE baby_data SET name = ?, birthday = ? WHERE baby_id = ?',
                                [nameData, birthdayData.toISOString(), idData],
                                (_, result) => {
                                    currentBabyDispatch({
                                        type: 'addBaby',
                                        name: nameData,
                                        birthday: birthdayData,
                                        baby_id: idData,
                                    });
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
        if (currentBabyState.baby_id !== id) {
            Alert.alert('「' + nameData + '」に関する全ての記録が削除されます', 'よろしいですか？', [
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
                                    const db = SQLite.openDatabase('BABY.db');
                                    db.transaction(
                                    (tx) => {
                                        tx.executeSql(
                                        'DELETE FROM baby_data WHERE baby_id = ?',
                                        [idData],
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
        } else {
            Alert.alert('現在表示中の赤ちゃんは削除できません');
        }
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
        setBirthdayData(date);
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
                    value={nameData}
                    onChangeText={(text) => { setNameData(text); }}
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
                    value={new Date(birthdayData)}
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
                    date={new Date(birthdayData)}//ピッカー日付デフォルト
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
