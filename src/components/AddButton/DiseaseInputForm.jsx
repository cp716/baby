import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useCurrentBabyContext } from '../../context/CurrentBabyContext';
import { CheckBox } from 'react-native-elements'

export default function DiseaseInputForm(props) {
    const { selectTime } = props;
    const { toggleModal } = props;
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();

    const date = new Date(selectTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = date.getDate();
    
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [memo, setMemo] = useState('');
    const [bodyTemperature, setBodyTemperature] = useState('');

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
                'CREATE TABLE IF NOT EXISTS DiseaseRecord_' + year + '_' + month + ' (record_id INTEGER, body_temperature REAL)',
                [],
                () => {
                    //console.log('DiseaseRecord_' + year + '_' + month + 'テーブルが作成されました');
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

    const saveDiseaseDataToSQLite = () => {
        const db = SQLite.openDatabase('BABY.db');
        db.transaction(
            (tx) => {
                let temperature = 0;
                if (bodyTemperature !== '') {
                    temperature = Number(bodyTemperature);
                    if (isNaN(temperature)) {
                        Alert.alert("有効な値を入力してください");
                        return;
                    }
                }
                if(selectedCategory == 'TAION' && temperature < 32 || selectedCategory == 'TAION' && temperature > 43 || selectedCategory == 'TAION' &&  temperature === 0) {
                    Alert.alert("32℃から43℃までの値を入力してください");
                    return;
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
                            'INSERT INTO DiseaseRecord_' + year + '_' + month + ' (record_id, body_temperature) VALUES (?, ?)',
                            [lastInsertId, parseFloat(temperature)],
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
                )
            }
        );
    };

    const handleButtonPress = () => {
        const nowDate = new Date();
        const nowYear = nowDate.getFullYear();
        const nowMonth = String(nowDate.getMonth() + 1).padStart(2, '0');
        const nowDay = nowDate.getDate();

        if (selectedCategory !== null) {
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
                            saveDiseaseDataToSQLite();
                        },
                    },
                ]);
                
            } else {
                saveDiseaseDataToSQLite();
            }
        } else {
            Alert.alert('記録する項目を選んでください');
        }
    };
    
    return (
        <ScrollView scrollEnabled={false}>
            <View style={styles.radioButtonContainer}>
                <View style={styles.radioButton}>
                    <CheckBox
                        title="鼻水"
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={selectedCategory === 'HANAMIZU'}
                        onPress={() => {
                            if (selectedCategory !== 'HANAMIZU') {
                            setSelectedCategory('HANAMIZU');
                            setBodyTemperature('');
                            }
                        }}                        containerStyle={styles.checkboxContainer}
                        titleProps={{ style: styles.checkboxTitle }}
                    />
                </View>
                <View style={styles.radioButton}>
                    <CheckBox
                        title="咳"
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={selectedCategory === 'SEKI'}
                        onPress={() => {
                            if (selectedCategory !== 'SEKI') {
                            setSelectedCategory('SEKI');
                            setBodyTemperature('');
                            }
                        }}                        containerStyle={styles.checkboxContainer}
                        titleProps={{ style: styles.checkboxTitle }}
                    />
                </View>
            </View>
            <View style={styles.radioButtonContainer}>
                <View style={styles.radioButton}>
                    <CheckBox
                        title="嘔吐"
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={selectedCategory === 'OTO'}
                        onPress={() => {
                            if (selectedCategory !== 'OTO') {
                            setSelectedCategory('OTO');
                            setBodyTemperature('');
                            }
                        }}                        containerStyle={styles.checkboxContainer}
                        titleProps={{ style: styles.checkboxTitle }}
                    />
                </View>
                <View style={styles.radioButton}>
                    <CheckBox
                        title="発疹"
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={selectedCategory === 'HOSSHIN'}
                        onPress={() => {
                            if (selectedCategory !== 'HOSSHIN') {
                            setSelectedCategory('HOSSHIN');
                            setBodyTemperature('');
                            }
                        }}                        containerStyle={styles.checkboxContainer}
                        titleProps={{ style: styles.checkboxTitle }}
                    />
                </View>
            </View>
            <View style={styles.radioButtonContainer}>
                <View style={styles.radioButton}>
                    <CheckBox
                        title="怪我"
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={selectedCategory === 'KEGA'}
                        onPress={() => {
                            if (selectedCategory !== 'KEGA') {
                            setSelectedCategory('KEGA');
                            setBodyTemperature('');
                            }
                        }}                        containerStyle={styles.checkboxContainer}
                        titleProps={{ style: styles.checkboxTitle }}
                    />
                </View>
                <View style={styles.radioButton}>
                    <CheckBox
                        title="薬"
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={selectedCategory === 'KUSURI'}
                        onPress={() => {
                            if (selectedCategory !== 'KUSURI') {
                            setSelectedCategory('KUSURI');
                            setBodyTemperature('');
                            }
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
                                <Text>体温</Text>
                                <TextInput
                                    keyboardType="decimal-pad"
                                    value={bodyTemperature}
                                    style={[
                                        styles.bodyTemperatureInput,
                                        selectedCategory === 'TAION' ? styles.editableInput : styles.disabledInput,
                                    ]}
                                    onChangeText={(text) => {
                                        if (selectedCategory === 'TAION') {
                                            setBodyTemperature(Number(text));
                                        }
                                    }}
                                    textAlign={"center"}
                                    maxLength={4}
                                    editable={selectedCategory === 'TAION'}
                                    //placeholder = "(32~42)"
                                    placeholderTextColor="#737373"
                                />
                                <Text>℃</Text>
                            </View>
                        }
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={selectedCategory === 'TAION'}
                        onPress={() => setSelectedCategory('TAION')}
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
    bodyTemperatureInput: {
        width: '60%', // 横幅の設定
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
