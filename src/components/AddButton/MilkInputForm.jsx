import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useCurrentBabyContext } from '../../context/CurrentBabyContext';

export default function ToiletInputForm(props) {
    const { selectTime } = props;
    const { toggleModal } = props;
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();

    const date = new Date(selectTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = date.getDate();
    
    const [timeLeft,  setTimeLeft] = useState('');
    const [timeRight,  setTimeRight] = useState('');
    const [milk,  setMilk] = useState('');
    const [bonyu,  setBonyu] = useState('');
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
                        //console.log(commonRecordTable + 'テーブルが作成されました');
                    },
                    (error) => {
                        console.error('テーブルの作成中にエラーが発生しました:', error);
                    }
                    );
                // テーブルが存在しない場合は作成
                tx.executeSql(
                'CREATE TABLE IF NOT EXISTS MilkRecord_' + year + '_' + month + ' (record_id INTEGER, milk INTEGER, bonyu INTEGER, junyu_left INTEGER, junyu_right INTEGER)',
                [],
                () => {
                    //console.log('MilkRecord_' + year + '_' + month + 'テーブルが作成されました');
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

    const saveMilkDataToSQLite = () => {
        const db = SQLite.openDatabase('BABY.db');
        db.transaction(
            (tx) => {
                if (milk || bonyu || timeLeft || timeRight) { // どちらか片方または両方のチェックが入っている場合のみINSERTを実行
                    if (milk) {
                        tx.executeSql(
                            'INSERT INTO CommonRecord_' + year + '_' + month + ' (baby_id, day, category, memo, record_time) VALUES (?, ?, ?, ?, ?)',
                            [
                                currentBabyState.baby_id,
                                day,
                                'MILK',
                                bodyText,
                                new Date(selectTime).toISOString()
                            ],
                            (_, result) => {
                                const lastInsertId = result.insertId;
                                tx.executeSql(
                                    'INSERT INTO MilkRecord_' + year + '_' + month + ' (record_id, milk) VALUES (?, ?)',
                                    [
                                        lastInsertId,
                                        milk,
                                    ],
                                    (_, result) => {
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
                    }
                    if (bonyu) {
                        tx.executeSql(
                            'INSERT INTO CommonRecord_' + year + '_' + month + ' (baby_id, day, category, memo, record_time) VALUES (?, ?, ?, ?, ?)',
                            [
                                currentBabyState.baby_id,
                                day,
                                'BONYU',
                                bodyText,
                                new Date(selectTime).toISOString()
                            ],
                            (_, result) => {
                                const lastInsertId = result.insertId;
                                tx.executeSql(
                                    'INSERT INTO MilkRecord_' + year + '_' + month + ' (record_id, bonyu) VALUES (?, ?)',
                                    [
                                        lastInsertId,
                                        bonyu,
                                    ],
                                    (_, result) => {
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
                    }
                    if (timeLeft || timeRight) {
                        let left = 0;
                        let right = 0;
                        if (timeLeft !== "") {
                            left = timeLeft
                        }
                        if(timeRight !== "") {
                            right = timeRight
                        }
                        tx.executeSql(
                            'INSERT INTO CommonRecord_' + year + '_' + month + ' (baby_id, day, category, memo, record_time) VALUES (?, ?, ?, ?, ?)',
                            [
                                currentBabyState.baby_id,
                                day,
                                'JUNYU',
                                bodyText,
                                new Date(selectTime).toISOString()
                            ],
                            (_, result) => {
                                const lastInsertId = result.insertId;
                                tx.executeSql(
                                    'INSERT INTO MilkRecord_' + year + '_' + month + ' (record_id, junyu_left, junyu_right) VALUES (?, ?, ?)',
                                    [
                                        lastInsertId,
                                        left,
                                        right,
                                    ],
                                    (_, result) => {
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
                    }
                    // 画面リフレッシュのためcurrentBabyStateを更新
                    currentBabyDispatch({
                        type: 'addBaby',
                        name: currentBabyState.name,
                        birthday: currentBabyState.birthday,
                        baby_id: currentBabyState.baby_id,
                    });
                } else {
                    Alert.alert('入力してください');
                }
            }
        );
    };
    
    return (
        <ScrollView scrollEnabled={false}>
            <View style={styles.inputTypeContainer}>
                <Text>左</Text>
                    <TextInput
                        keyboardType="number-pad"
                        returnKeyType = {"next"}
                        value={timeLeft}
                        textAlign={"center"}//入力表示位置
                        style={styles.input}
                        onChangeText={(text) => { setTimeLeft(Number(text));}}
                        //autoFocus
                        maxLength={2}
                    />
                <Text>分</Text>
                <Text>右</Text>
                    <TextInput
                        keyboardType="number-pad"
                        value={timeRight}
                        textAlign={"center"}//入力表示位置
                        style={styles.input}
                        onChangeText={(text) => { setTimeRight(Number(text)); }}
                        //autoFocus
                        maxLength={2}
                    />
                <Text>分</Text>
            </View>
            <View style={styles.inputTypeContainer}>
                <Text>ミルク</Text>
                    <TextInput
                        //name={'milk'}
                        keyboardType="number-pad"
                        type={"number"}
                        returnKeyType = {"next"}
                        value={milk}
                        textAlign={"center"}//入力表示位置
                        style={styles.input}
                        onChangeText={(text) => { setMilk(Number(text)); }}
                        //autoFocus
                        maxLength={3}
                    />
                <Text>ml</Text>
                <Text>母乳</Text>
                    <TextInput
                        keyboardType="number-pad"
                        value={bonyu}
                        textAlign={"center"}//入力表示位置
                        style={styles.input}
                        onChangeText={(text) => { setBonyu(Number(text)); }}
                        //autoFocus
                        maxLength={3}
                    />
                <Text>ml</Text>
            </View>
            <View style={styles.inputContainer}>
                <Text>メモ</Text>
                <TextInput
                        keyboardType="web-search"
                        value={bodyText}
                        multiline//複数行入力
                        style={styles.input}
                        onChangeText={(text) => { setBodyText(text); }}
                        //autoFocus
                        placeholder = "メモを入力"
                />
            </View>
            <View style={modalStyles.container}>
                <TouchableOpacity style={modalStyles.confirmButton} onPress={toggleModal} >
                    <Text style={modalStyles.confirmButtonText}>close</Text>
                </TouchableOpacity>
                <TouchableOpacity style={modalStyles.confirmButton} onPress={saveMilkDataToSQLite} >
                    <Text style={modalStyles.confirmButtonText}>登録</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.advertisement}>
                <Image style={{width: '100%'}}
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
        height: 50,
        backgroundColor: '#987652',
        //flex: 1,
        flexDirection: 'row',
        //width: 350 ,
        
    },
    inputContainer: {
        paddingHorizontal: 27,
        paddingVertical: 10,
        height: 125,
        backgroundColor: '#859602'
        //flex: 1,
    },
    input: {
        flex: 1,
        textAlignVertical: 'top',
        fontSize: 16,
        lineHeight: 25,
        backgroundColor: '#ffffff'
    },
    advertisement: {
        //marginTop: 'auto',
        //marginBottom: 'auto',
        paddingTop: 10,
        paddingBottom: 10,
        //height: '15%',
        //width: '50%',
        alignItems:'center',
        //backgroundColor: '#464876',
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