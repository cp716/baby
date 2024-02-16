import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as SQLite from 'expo-sqlite';
import { useCurrentBabyContext } from '../../context/CurrentBabyContext';
import Button from '../../components/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BabyInputForm(props) {
    const { navigation } = props;
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [birthday, setBirthday] = useState();
    const [detailTime, setDetailTime] = useState('誕生日を選択');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [db, setDb] = useState(null);

    useEffect(() => {
        // SQLiteデータベースを開くか作成する
        const database = SQLite.openDatabase('BABY.db');
        setDb(database);

        database.transaction(
            (tx) => {
                // テーブルが存在しない場合は作成
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS baby_data (baby_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, birthday DATETIME)',
                    [],
                    () => {
                        //console.log('テーブルが作成されました');
                    },
                    (error) => {
                        console.error('テーブルの作成中にエラーが発生しました:', error);
                    }
                );
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS current_baby (baby_id INTEGER PRIMARY KEY, name TEXT, birthday DATETIME)',
                    [],
                    () => {
                        //console.log('テーブルが作成されました');
                    },
                    (error) => {
                        console.error('テーブルの作成中にエラーが発生しました:', error);
                    }
                );
            },
            (error) => {
                console.error('データベースのオープン中にエラーが発生しました:', error);
            }
        );
    }, []);

    const handleBabyRegistration = () => {
        if (name !== "" && birthday !== undefined) {
            Alert.alert('以下の情報で登録します\n名前:' + name + '\n誕生日:' + detailTime, 'よろしいですか？', [
                {
                    text: "キャンセル",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "保存",
                    onPress: () => {
                        // SQLiteに赤ちゃんデータを保存
                        saveBabyDataToSQLite();
                    }
                }
            ]
            );
        } else {
            Alert.alert("未入力です");
        }
    };

    const saveBabyDataToSQLite = () => {
        db.transaction(
            (tx) => {
                tx.executeSql(
                    'INSERT INTO baby_data (name, birthday) VALUES (?, ?)',
                    [name, new Date(birthday).toISOString()],
                    (_, result) => {
                        setMessage('データがテーブルに挿入されました');
                        const insertedId = result.insertId; // 挿入した行のIDを取得
                        tx.executeSql(
                            'SELECT EXISTS (SELECT 1 FROM current_baby)',
                            [],
                            (_, resultSet) => {
                                const dataExists = resultSet.rows.item(0)[Object.keys(resultSet.rows.item(0))[0]];
                                if (dataExists == 1) {
                                    // データが存在する場合、UPDATEを実行
                                    tx.executeSql(
                                        'UPDATE current_baby SET name = ?, birthday = ?, baby_id = ?',
                                        [name, new Date(birthday).toISOString(), insertedId],
                                        (_, result) => {
                                            setMessage('データが更新されました');
                                        },
                                        (_, error) => {
                                            setMessage('データの更新中にエラーが発生しました');
                                            console.error('データの更新中にエラーが発生しました:', error);
                                        }
                                    );
                                } else {
                                    // データが存在しない場合、INSERTを実行
                                    tx.executeSql(
                                        'INSERT INTO current_baby (name, birthday, baby_id) VALUES (?, ?, ?)',
                                        [name, new Date(birthday).toISOString(), insertedId],
                                        (_, result) => {
                                            setMessage('データが挿入されました');
                                        },
                                        (_, error) => {
                                            setMessage('データの挿入中にエラーが発生しました');
                                            console.error('データの挿入中にエラーが発生しました:', error);
                                        }
                                    );
                                }
                            },
                            (_, error) => {
                                setMessage('データの存在チェック中にエラーが発生しました');
                                console.error('データの存在チェック中にエラーが発生しました:', error);
                            }
                        );
                        currentBabyDispatch({ type: "addBaby", name: name, birthday: new Date(birthday).toISOString(), baby_id: insertedId })
                    },
                    (_, error) => {
                        setMessage('データの挿入中にエラーが発生しました');
                        console.error('データの挿入中にエラーが発生しました:', error);
                    }
                );
            }
        );
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const formatDatetime = (date) => {
        setDetailTime(date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日');
    };

    const handleConfirm = (date) => {
        setBirthday(date);
        formatDatetime(date);
        hideDatePicker();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={styles.inner}>
                    <MaterialCommunityIcons name='baby-face-outline' size={50} color="#737373" style={{ alignSelf: 'center' }} />
                    <Text style={styles.title}>赤ちゃんの情報を登録しよう</Text>
                    <Text style={styles.inputText}>名前</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={(text) => { setName(text); }}
                        autoCapitalize="none"
                        keyboardType="default"
                        placeholder="入力してください"
                        placeholderTextColor="#BFBFBF"
                        maxLength={10}
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
                        mode="date"
                        locale='ja'
                        display="spinner"
                        confirmTextIOS="決定"
                        cancelTextIOS="キャンセル"
                        minuteInterval={5}
                        headerTextIOS=""
                        textColor="blue"
                        date={birthday}
                    />
                    <Button
                        label="登録"
                        onPress={handleBabyRegistration}
                    />
                    <Text style={{ textAlign: 'center', paddingTop: 24 }}>※後で編集できます</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        backgroundColor: '#F0F4F8',
        borderRadius: 10,
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
        fontSize: 20,
        lineHeight: 32,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
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
