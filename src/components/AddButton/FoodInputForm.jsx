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
    const [memo, setMemo] = useState('');

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
                            selectedCategory,
                            memo,
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
                    Alert.alert('記録する項目を選んでください');
                }
            }
        );
    };

    return (
        <ScrollView scrollEnabled={false}>
            <View style={styles.radioButtonContainer}>
                <View style={styles.radioButton}>
                    <CheckBox
                        title="食べ物"
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={selectedCategory === 'FOOD'}
                        onPress={() => setSelectedCategory('FOOD')}
                        containerStyle={styles.checkboxContainer}
                        titleProps={{ style: styles.checkboxTitle }}
                    />
                </View>
                <View style={styles.radioButton}>
                    <CheckBox
                        title="飲み物"
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={selectedCategory === 'DRINK'}
                        onPress={() => setSelectedCategory('DRINK')}
                        containerStyle={styles.checkboxContainer}
                        titleProps={{ style: styles.checkboxTitle }}
                    />
                </View>
            </View>
            <View style={styles.inputAmountContainer}>
                <Text style={styles.inputTitle}>
                    {selectedCategory === 'FOOD' || selectedCategory === 'DRINK' || selectedCategory === 'category1' || selectedCategory === 'category2' ? 
                        (selectedCategory === 'FOOD' ? '食べ物(単位/g)' : selectedCategory === 'DRINK' ? '飲み物(単位/ml)' : '量')
                        : '量'}
                </Text>
                <TextInput
                    keyboardType="number-pad"
                    value={amount}
                    style={styles.amountInput}
                    onChangeText={(text) => {
                        setAmount(Number(text));
                    }}
                    textAlign={"center"}
                    maxLength={3}
                />
            </View>
            <View style={styles.inputMemoContainer}>
                <Text style={styles.inputTitle}>メモ</Text>
                <TextInput
                    keyboardType="web-search"
                    value={memo}
                    multiline
                    style={styles.memoInput}
                    onChangeText={(text) => setMemo(text)}
                />
            </View>
            <View style={modalStyles.container}>
                <TouchableOpacity style={modalStyles.confirmCloseButton} onPress={toggleModal}>
                    <Text style={modalStyles.confirmCloseButtonText}>閉じる</Text>
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
        paddingHorizontal: 10,
        paddingTop: '5%',
    },
    inputAmountContainer: {
        paddingHorizontal: 20,
        paddingTop: '5%',
        height: 90,
        //backgroundColor: '#859602',
    },
    inputMemoContainer: {
        paddingHorizontal: 20,
        //paddingVertical: '5%',
        paddingTop: '5%',
        height: 130,
        //backgroundColor: '#859602',
    },
    inputTitle: {
        fontSize: 15,
        marginBottom: 5,
        color: '#737373',
    },
    amountInput: {
        flex: 1,
        textAlignVertical: 'top',
        fontSize: 16,
        //lineHeight: 20,
        backgroundColor: '#ffffff',
        borderColor: '#737373',
        borderWidth: 0.5,
        borderRadius: 5,
    },
    memoInput: {
        flex: 1,
        textAlignVertical: 'top',
        fontSize: 16,
        lineHeight: 25,
        backgroundColor: '#ffffff',
        borderColor: '#737373',
        borderWidth: 0.5,
        borderRadius: 5,
        padding: 10
    },
    disabledInput: {
        backgroundColor: '#e0e0e0',
    },
    radioButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around', // チェックボックスの左右配置を中央に
    },
    radioButton: {
        width: '40%', // チェックボックスの幅を均等に設定
    },
    checkboxContainer: {
        //width: '80%',
    },
    checkboxTitle: {
        fontSize: 15,
    },
    advertisement: {
        paddingTop: '5%',
        alignItems: 'center',
    },
});

const modalStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: '5%',
    },
    confirmButton: {
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: '#FFDB59',
        borderColor: '#FFDB59',
        borderWidth: 0.5,
        borderRadius: 10,
        width: '40%',
    },
    confirmButtonText: {
        color: '#737373',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
        fontSize: 16,
    },
    confirmCloseButton: {
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: '#FFF',
        borderRadius: 10,
        width: '40%',
    },
    confirmCloseButtonText: {
        color: '#737373',
        textAlign: 'center',
        padding: 10,
        fontSize: 16,
    },
});
