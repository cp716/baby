import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useCurrentBabyContext } from '../../context/CurrentBabyContext';
import { CheckBox } from 'react-native-elements'

export default function ToiletInputForm(props) {
    const { selectTime } = props;
    const { toggleModal } = props;
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();

    const date = new Date(selectTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = date.getDate();
    
    const [junyuLeft,  setJunyuLeft] = useState('');
    const [junyuRight,  setJunyuRight] = useState('');
    const [milk,  setMilk] = useState('');
    const [bonyu,  setBonyu] = useState('');
    const [memo, setMemo] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

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
                if (milk) {
                    tx.executeSql(
                        'INSERT INTO CommonRecord_' + year + '_' + month + ' (baby_id, day, category, memo, record_time) VALUES (?, ?, ?, ?, ?)',
                        [
                            currentBabyState.baby_id,
                            day,
                            'MILK',
                            memo,
                            new Date(selectTime).toISOString()
                        ],
                        (_, result) => {
                            const lastInsertId = result.insertId;
                            tx.executeSql(
                                'INSERT INTO MilkRecord_' + year + '_' + month + ' (record_id, milk, bonyu, junyu_left, junyu_right) VALUES (?, ?, ?, ?, ?)',
                                [
                                    lastInsertId,
                                    milk,
                                    0,
                                    0,
                                    0
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
                            memo,
                            new Date(selectTime).toISOString()
                        ],
                        (_, result) => {
                            const lastInsertId = result.insertId;
                            tx.executeSql(
                                'INSERT INTO MilkRecord_' + year + '_' + month + ' (record_id, milk, bonyu, junyu_left, junyu_right) VALUES (?, ?, ?, ?, ?)',
                                [
                                    lastInsertId,
                                    0,
                                    bonyu,
                                    0,
                                    0
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
                if (junyuLeft || junyuRight) {
                    let left = 0;
                    let right = 0;
                    if (junyuLeft !== "") {
                        left = junyuLeft
                    }
                    if(junyuRight !== "") {
                        right = junyuRight
                    }
                    tx.executeSql(
                        'INSERT INTO CommonRecord_' + year + '_' + month + ' (baby_id, day, category, memo, record_time) VALUES (?, ?, ?, ?, ?)',
                        [
                            currentBabyState.baby_id,
                            day,
                            'JUNYU',
                            memo,
                            new Date(selectTime).toISOString()
                        ],
                        (_, result) => {
                            const lastInsertId = result.insertId;
                            tx.executeSql(
                                'INSERT INTO MilkRecord_' + year + '_' + month + ' (record_id, milk, bonyu, junyu_left, junyu_right) VALUES (?, ?, ?, ?, ?)',
                                [
                                    lastInsertId,
                                    0,
                                    0,
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
            }
        );
    };

    const handleButtonPress = () => {
        const nowDate = new Date();
        const nowYear = nowDate.getFullYear();
        const nowMonth = String(nowDate.getMonth() + 1).padStart(2, '0');
        const nowDay = nowDate.getDate();

        if (selectedCategory !== null) {
            if (
            (milk || bonyu || junyuLeft || junyuRight) &&
            (Number.isInteger(milk) || Number.isInteger(bonyu) || Number.isInteger(junyuLeft) || Number.isInteger(junyuRight))
            ) {
                if(nowYear + nowMonth + nowDay !== year + month + day){
                    Alert.alert('本日の記録ではありません', '登録してもよろしいですか？', [
                        {
                            text: 'キャンセル',
                            style: 'cancel',
                            onPress: () => {return;},
                        },
                        {
                            text: '登録',
                            style: 'destructive',
                            onPress: () => {
                                saveMilkDataToSQLite();
                            },
                        },
                    ]);
                    
                } else {
                    saveMilkDataToSQLite();
                }
            } else {
                Alert.alert('有効な値(整数)を入力してください');
            }
        } else {
            Alert.alert('記録する項目を選んでください');
        }
    };
    
    return (
        <ScrollView scrollEnabled={false}>
            <View style={styles.radioButtonContainer}>
                <View style={styles.bodyTemperatureRadioButton}>
                    <CheckBox
                        title={
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.amountText}>
                                    <Text style={{ textAlign: 'center' }}>{`母乳\n(哺乳瓶)`}</Text>
                                </View>
                                <TextInput
                                    keyboardType="number-pad"
                                    value={bonyu}
                                    style={[
                                        styles.amountInput,
                                        selectedCategory === 'BONYU' ? styles.editableInput : styles.disabledInput,
                                    ]}
                                    onChangeText={(text) => {
                                        setBonyu(Number(text));
                                    }}
                                    textAlign={"center"}
                                    maxLength={3}
                                    editable={selectedCategory === 'BONYU'}
                                    //placeholder = "(32~42)"
                                    placeholderTextColor="#737373"
                                />
                                <Text>ml</Text>
                            </View>
                        }
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={selectedCategory === 'BONYU'}
                        onPress={() => {
                            setSelectedCategory('BONYU')
                            setJunyuLeft('');
                            setJunyuRight('');
                            setMilk('');
                        }}
                        containerStyle={styles.checkboxContainer}
                        titleProps={{ style: styles.checkboxTitle }}
                    />
                </View>
            </View>
            <View style={styles.radioButtonContainer}>
                <View style={styles.bodyTemperatureRadioButton}>
                    <CheckBox
                        title={
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.amountText}>
                                    <Text style={{ textAlign: 'center' }}>{`ミルク\n(哺乳瓶)`}</Text>
                                </View>
                                <TextInput
                                    keyboardType="number-pad"
                                    value={milk}
                                    style={[
                                        styles.amountInput,
                                        selectedCategory === 'MILK' ? styles.editableInput : styles.disabledInput,
                                    ]}
                                    onChangeText={(text) => {
                                        if (selectedCategory === 'MILK') {
                                            setMilk(Number(text));
                                        }
                                    }}
                                    textAlign={"center"}
                                    maxLength={3}
                                    editable={selectedCategory === 'MILK'}
                                    //placeholder = "(32~42)"
                                    placeholderTextColor="#737373"
                                />
                                <Text>ml</Text>
                            </View>
                        }
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={selectedCategory === 'MILK'}
                        onPress={() => {
                            setSelectedCategory('MILK')
                            setJunyuLeft('');
                            setJunyuRight('');
                            setBonyu('');
                        }}
                        containerStyle={styles.checkboxContainer}
                        titleProps={{ style: styles.checkboxTitle }}
                    />
                </View>
            </View>
            <View style={styles.radioButtonContainer}>
                <View style={styles.bodyTemperatureRadioButton}>
                    <CheckBox
                        title={
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '5%' }}>
                                    <View style={styles.amountText}>
                                        <Text style={{ textAlign: 'center' }}>{`授乳(左)`}</Text>
                                    </View>
                                    <TextInput
                                        keyboardType="number-pad"
                                        value={junyuLeft}
                                        style={[
                                            styles.amountInput,
                                            selectedCategory === 'JUNYU' ? styles.editableInput : styles.disabledInput,
                                        ]}
                                        onChangeText={(text) => {
                                            if (selectedCategory === 'JUNYU') {
                                                setJunyuLeft(Number(text));
                                            }
                                        }}
                                        textAlign={"center"}
                                        maxLength={2}
                                        editable={selectedCategory === 'JUNYU'}
                                        //placeholder = "(32~42)"
                                        placeholderTextColor="#737373"
                                    />
                                    <Text>分</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={styles.amountText}>
                                        <Text style={{ textAlign: 'center' }}>{`授乳(右)`}</Text>
                                    </View>
                                    <TextInput
                                        keyboardType="number-pad"
                                        value={junyuRight}
                                        style={[
                                            styles.amountInput,
                                            selectedCategory === 'JUNYU' ? styles.editableInput : styles.disabledInput,
                                        ]}
                                        onChangeText={(text) => {
                                            if (selectedCategory === 'JUNYU') {
                                                setJunyuRight(Number(text));
                                            }
                                        }}
                                        textAlign={"center"}
                                        maxLength={2}
                                        editable={selectedCategory === 'JUNYU'}
                                        //placeholder = "(32~42)"
                                        placeholderTextColor="#737373"
                                    />
                                    <Text>分</Text>
                                </View>
                            </View>
                        }
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={selectedCategory === 'JUNYU'}
                        onPress={() => {
                            setSelectedCategory('JUNYU')
                            setMilk('');
                            setBonyu('');
                        }}
                        containerStyle={styles.checkboxContainer}
                        titleProps={{ style: styles.checkboxTitle }}
                    />
                </View>
            </View>
            <View style={styles.inputMemoContainer}>
                <Text style={styles.inputTitle}>メモ</Text>
                <TextInput
                    keyboardType="web-search"
                    value={memo}
                    multiline
                    style={styles.memoInput}
                    onChangeText={(text) => setMemo(text)}
                    maxLength={100}
                />
            </View>
            <View style={modalStyles.container}>
                <TouchableOpacity style={modalStyles.confirmCloseButton} onPress={toggleModal}>
                    <Text style={modalStyles.confirmCloseButtonText}>閉じる</Text>
                </TouchableOpacity>
                <TouchableOpacity style={modalStyles.confirmButton} onPress={handleButtonPress}>
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
        paddingHorizontal: 10,
        paddingTop: '5%',
    },
    inputBodyTemperatureContainer: {
        paddingHorizontal: 20,
        paddingTop: '5%',
        height: 90,
        flexDirection: 'row',
        justifyContent: 'space-around',
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
    amountText: {
        width: '35%',
        //justifyContent: 'center'
    },
    amountInput: {
        width: '40%', // 横幅の設定
        height: 30, // または必要な縦幅に設定
        fontSize: 16,
        backgroundColor: '#ffffff',
        borderColor: '#737373',
        borderWidth: 0.5,
        borderRadius: 5,
        marginLeft: 10,
        marginRight: 10
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
        width: '45%', // チェックボックスの幅を均等に設定
    },
    bodyTemperatureRadioButton: {
        width: '95%', // チェックボックスの幅を均等に設定
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
    editableInput: {
        backgroundColor: '#FFFFFF', // 編集可能な場合の背景色
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
        backgroundColor: '#f4cdcd',
        borderColor: '#f4cdcd',
        borderWidth: 0.5,
        borderRadius: 10,
        width: '40%',
    },
    confirmButtonText: {
        color: '#312929',
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
