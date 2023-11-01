import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useCurrentBabyContext } from '../../context/CurrentBabyContext';
import { CheckBox } from 'react-native-elements';

export default function FoodInputForm(props) {
    const { selectTime } = props;
    const { toggleModal } = props;
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();

    const date = new Date(selectTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = date.getDate();

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [amount, setAmount] = useState('');
    const [bodyText, setBodyText] = useState('');

    useEffect(() => {
        const db = SQLite.openDatabase('BABY.db');
        db.transaction(
            (tx) => {
                // テーブルが存在しない場合は作成
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS CommonRecord_' + year + '_' + month + ' (record_id INTEGER PRIMARY KEY, baby_id INTEGER, day INTEGER, category TEXT NOT NULL, record_time DATETIME NOT NULL, memo TEXT, FOREIGN KEY (record_id) REFERENCES CommonRecord_' + year + '_' + month + '(record_id))',
                    [],
                    () => {
                        // console.log(commonRecordTable + 'テーブルが作成されました');
                    },
                    (error) => {
                        console.error('テーブルの作成中にエラーが発生しました:', error);
                    }
                );
                // テーブルが存在しない場合は作成
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS FoodRecord_' + year + '_' + month + ' (record_id INTEGER, amount INTEGER)',
                    [],
                    () => {
                        // console.log('FoodRecord_' + year + '_' + month + 'テーブルが作成されました');
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

    const saveFoodDataToSQLite = () => {
        const db = SQLite.openDatabase('BABY.db');
        db.transaction(
            (tx) => {
                if (selectedCategory !== null) {
                    let amountToSave = null;
                    if (amount !== '') {
                        amountToSave = Number(amount);
                    }
                    tx.executeSql(
                        'INSERT INTO CommonRecord_' + year + '_' + month + ' (baby_id, day, category, memo, record_time) VALUES (?, ?, ?, ?, ?)',
                        [
                            currentBabyState.baby_id,
                            day,
                            selectedCategory === 'food' ? 'FOOD' : 'DRINK',
                            bodyText,
                            new Date(selectTime).toISOString(),
                        ],
                        (_, result) => {
                            const lastInsertId = result.insertId;
                            tx.executeSql(
                                'INSERT INTO FoodRecord_' + year + '_' + month + ' (record_id, amount) VALUES (?, ?)',
                                [lastInsertId, amountToSave],
                                (_, result) => {
                                    // 画面リフレッシュのためcurrentBabyStateを更新
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
                    Alert.alert('カテゴリが選択されていません');
                }
            }
        );
    };

    return (
        <ScrollView scrollEnabled={false}>
            <View style={styles.inputTypeContainer}>
                <View style={styles.radioButton}>
                <CheckBox
                    title='食事'
                    checked={selectedCategory === 'food'}
                    onPress={() => {
                        if (selectedCategory !== 'food') {
                            setSelectedCategory('food');
                            setAmount('');
                        }
                    }}
                />
                <CheckBox
                    title='飲物'
                    checked={selectedCategory === 'drink'}
                    onPress={() => {
                        if (selectedCategory !== 'drink') {
                            setSelectedCategory('drink');
                            setAmount('');
                        }
                    }}
                />
                </View>
            </View>
            <View style={styles.inputContainer}>
                <Text>
                    {selectedCategory === 'food' ? '食物' : selectedCategory === 'drink' ? '飲物' : ''}
                </Text>
                <TextInput
                    keyboardType="decimal-pad"
                    value={amount}
                    style={styles.input}
                    onChangeText={(text) => {
                        setAmount(Number(text));
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
                    onChangeText={(text) => setBodyText(text)}
                    placeholder="メモを入力"
                />
            </View>
            <View style={modalStyles.container}>
                <TouchableOpacity style={modalStyles.confirmButton} onPress={toggleModal}>
                    <Text style={modalStyles.confirmButtonText}>閉じる</Text>
                </TouchableOpacity>
                <TouchableOpacity style={modalStyles.confirmButton} onPress={saveFoodDataToSQLite}>
                    <Text style={modalStyles.confirmButtonText}>登録</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.advertisement}>
                <Image style={{ width: '100%' }} resizeMode='contain' source={require('../../img/IMG_3641.jpg')} />
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
        height: 120,
        backgroundColor: '#859602',
    },
    inputMemoContainer: {
        paddingHorizontal: 27,
        paddingVertical: 10,
        height: 125,
        backgroundColor: '#859602',
    },
    input: {
        flex: 1,
        textAlignVertical: 'top',
        fontSize: 16,
        lineHeight: 25,
        backgroundColor: '#ffffff',
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
        width: '40%',
    },
    confirmButtonText: {
        color: '#36C1A7',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
        fontSize: 16,
    },
});
