import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useCurrentBabyContext } from '../../context/CurrentBabyContext';
import { CheckBox } from 'react-native-elements'

export default function BodyInputForm(props) {
    const { selectTime } = props;
    const { toggleModal } = props;
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();

    const date = new Date(selectTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = date.getDate();

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isWeightSelected, setWeightSelected] = useState(true);
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bodyText, setBodyText] = useState('');

    if (isNaN(weight)) {
        setWeight('')
    }
    if (isNaN(height)) {
        setHeight('')
    }

    useEffect(() => {
        const db = SQLite.openDatabase('BABY.db');
        db.transaction(
            (tx) => {
                // テーブルが存在しない場合は作成
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS CommonRecord_' + year + '_' + month + ' (record_id INTEGER PRIMARY KEY, baby_id INTEGER, day INTEGER, category TEXT NOT NULL, record_time DATETIME NOT NULL, memo TEXT, FOREIGN KEY (record_id) REFERENCES CommonRecord_' + year + '_' + month + '(record_id))',
                    [],
                    () => {
                        //console.log(commonRecordTable + 'テーブルが作成されました');
                    },
                    (error) => {
                        console.error('テーブルの作成中にエラーが発生しました:', error);
                    }
                );
                // テーブルが存在しない場合は作成
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS BodyRecord_' + year + '_' + month + ' (record_id INTEGER, height REAL, weight REAL)',
                    [],
                    () => {
                        //console.log('BodyRecord_' + year + '_' + month + 'テーブルが作成されました');
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

    const saveBodyDataToSQLite = () => {
        const db = SQLite.openDatabase('BABY.db');
        db.transaction(
            (tx) => {
                if (isWeightSelected) {
                    if (height !== "") {
                        tx.executeSql(
                            'INSERT INTO CommonRecord_' + year + '_' + month + ' (baby_id, day, category, memo, record_time) VALUES (?, ?, ?, ?, ?)',
                            [
                                currentBabyState.baby_id,
                                day,
                                'WEIGHT',
                                bodyText,
                                new Date(selectTime).toISOString()
                            ],
                            (_, result) => {
                                const lastInsertId = result.insertId;
                                tx.executeSql(
                                    'INSERT INTO BodyRecord_' + year + '_' + month + ' (record_id, weight, height) VALUES (?, ?, ?)',
                                    [
                                        lastInsertId,
                                        parseFloat(height),
                                        null
                                    ],
                                    (_, result) => {
                                        currentBabyDispatch({
                                            type: 'addBaby',
                                            name: currentBabyState.name,
                                            birthday: currentBabyState.birthday,
                                            baby_id: currentBabyState.baby_id,
                                        });
                                        toggleModal();
                                    },
                                    (_, error) => {
                                        console.error('データの挿入中にエラーが発生しました:', error);
                                    }
                                );
                            },
                            (_, error) => {
                                console.error('データの挿入中にエラーが発生しました:', error);
                            }
                        );
                    } else {
                        Alert.alert('体重が入力されていません');
                    }
                } else {
                    if (weight !== "") {
                        tx.executeSql(
                            'INSERT INTO CommonRecord_' + year + '_' + month + ' (baby_id, day, category, memo, record_time) VALUES (?, ?, ?, ?, ?)',
                            [
                                currentBabyState.baby_id,
                                day,
                                'HEIGHT',
                                bodyText,
                                new Date(selectTime).toISOString()
                            ],
                            (_, result) => {
                                const lastInsertId = result.insertId;
                                tx.executeSql(
                                    'INSERT INTO BodyRecord_' + year + '_' + month + ' (record_id, height, weight) VALUES (?, ?, ?)',
                                    [
                                        lastInsertId,
                                        null,
                                        parseFloat(weight)
                                    ],
                                    (_, result) => {
                                        currentBabyDispatch({
                                            type: 'addBaby',
                                            name: currentBabyState.name,
                                            birthday: currentBabyState.birthday,
                                            baby_id: currentBabyState.baby_id,
                                        });
                                        toggleModal();
                                    },
                                    (_, error) => {
                                        console.error('データの挿入中にエラーが発生しました:', error);
                                    }
                                );
                            },
                            (_, error) => {
                                console.error('データの挿入中にエラーが発生しました:', error);
                            }
                        );
                    } else {
                        Alert.alert('身長が入力されていません');
                    }
                }
            }
        );
    };

    return (
        <ScrollView scrollEnabled={false}>
            <View style={styles.inputTypeContainer}>
                <View style={styles.radioButton}>
                    <CheckBox
                        title='身長'
                        checked={!isWeightSelected}
                        onPress={() => {
                            if (height) {
                                setHeight('');
                            }
                            setWeightSelected(false);
                        }}
                    />
                    <CheckBox
                        title='体重'
                        checked={isWeightSelected}
                        onPress={() => {
                            if (weight) {
                                setWeight('');
                            }
                            setWeightSelected(true);
                        }}
                    />
                </View>
            </View>
            <View style={styles.inputContainer}>
                {isWeightSelected ? (
                    <Text>体重</Text>
                ) : (
                    <Text>身長</Text>
                )}
                <TextInput
                    keyboardType="decimal-pad"
                    value={isWeightSelected ? height : weight}
                    //style={[styles.input, !isWeightSelected && styles.disabledInput]}
                    style={styles.input}
                    onChangeText={(text) => {
                        if (isWeightSelected) {
                            setHeight(Number(text));
                        } else {
                            setWeight(Number(text));
                        }
                    }}
                    placeholder="入力してください"
                    textAlign={"center"}
                    maxLength={4}
                />
            </View>
            <View style={styles.inputMemoContainer}>
                <Text>メモ</Text>
                <TextInput
                    keyboardType="web-search"
                    value={bodyText}
                    multiline
                    style={styles.input}
                    onChangeText={(text) => { setBodyText(text); }}
                    placeholder="メモを入力"
                />
            </View>
            <View style={modalStyles.container}>
                <TouchableOpacity style={modalStyles.confirmButton} onPress={toggleModal} >
                    <Text style={modalStyles.confirmButtonText}>閉じる</Text>
                </TouchableOpacity>
                <TouchableOpacity style={modalStyles.confirmButton} onPress={saveBodyDataToSQLite} >
                    <Text style={modalStyles.confirmButtonText}>登録</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.advertisement}>
                <Image style={{ width: '100%' }}
                    resizeMode='contain'
                    source={require('../../img/IMG_3641.jpg')}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    inputTypeContainer: {
        paddingHorizontal: 27,
        paddingVertical: 10,
    },
    inputContainer: {
        paddingHorizontal: 27,
        paddingVertical: 10,
        height: 80,
        backgroundColor: '#859602'
    },
    inputMemoContainer: {
        paddingHorizontal: 27,
        paddingVertical: 10,
        height: 125,
        backgroundColor: '#859602'
    },
    input: {
        flex: 1,
        textAlignVertical: 'top',
        fontSize: 16,
        lineHeight: 25,
        backgroundColor: '#ffffff'
    },
    disabledInput: {
        backgroundColor: '#e0e0e0',
    },
    radioButton: {
        justifyContent: 'space-around',
    },
    advertisement: {
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
    },
});

const modalStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    confirmButton: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '5%',
        backgroundColor: '#FFF',
        borderColor: '#36C1A7',
        borderWidth: 1,
        borderRadius: 10,
        width: "40%",
    },
    confirmButtonText: {
        color: '#36C1A7',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
        fontSize: 16,
    },
});
