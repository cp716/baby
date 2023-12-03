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
    
    const [bodyText, setBodyText] = useState('');
    const [hanamizu, setHanamizu] = useState(0);
    const [seki, setSeki] = useState(0);
    const [oto, setOto] = useState(0);
    const [hosshin, setHosshin] = useState(0);
    const [kega, setKega] = useState(0);
    const [kusuri, setKusuri] = useState(0);
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
                'CREATE TABLE IF NOT EXISTS DiseaseRecord_' + year + '_' + month + ' (record_id INTEGER, hanamizu INTEGER, seki INTEGER, oto INTEGER, hosshin INTEGER, kega INTEGER, kusuri INTEGER, body_temperature REAL)',
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
                if (hanamizu || seki || oto || hosshin || kega || kusuri || bodyTemperature) { // いずれかにチェックが入っている場合のみINSERTを実行
                    if(bodyTemperature >= 32 && bodyTemperature <= 43 || bodyTemperature == '') {
                        let temperature = 0;
                        if (bodyTemperature !== "") {
                            temperature = bodyTemperature
                        }
                        tx.executeSql(
                            'INSERT INTO CommonRecord_' + year + '_' + month + ' (baby_id, day, category, memo, record_time) VALUES (?, ?, ?, ?, ?)',
                            [
                                currentBabyState.baby_id,
                                day,
                                'DISEASE',
                                bodyText,
                                new Date(selectTime).toISOString()
                            ],
                            (_, result) => {
                                const lastInsertId = result.insertId;
                                tx.executeSql(
                                    'INSERT INTO DiseaseRecord_' + year + '_' + month + ' (record_id, hanamizu, seki, oto, hosshin, kega, kusuri, body_temperature) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                                    [
                                        lastInsertId,
                                        hanamizu,
                                        seki,
                                        oto,
                                        hosshin,
                                        kega,
                                        kusuri,
                                        parseFloat(temperature)
                                    ],
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
                        Alert.alert("32から43までで入力してください");
                    }
                } else {
                    Alert.alert('チェックが入っていません');
                }
            }
        );
    };
    
    return (
        <ScrollView scrollEnabled={false}>
            <View style={styles.radioButtonContainer}>
                <View style={styles.radioButton}>
                    <CheckBox
                        title='鼻水'
                        checked={hanamizu}
                        onPress={() => {setHanamizu(hanamizu === 1 ? 0 : 1);}}
                    />
                    <CheckBox
                        title='咳'
                        checked={seki}
                        onPress={() => {setSeki(seki === 1 ? 0 : 1);}}
                    />
                    <CheckBox
                        title='嘔吐'
                        checked={oto}
                        onPress={() => {setOto(oto === 1 ? 0 : 1);}}
                    />
                </View>
                <View style={styles.radioButton}>
                    <CheckBox
                        title='発疹'
                        checked={hosshin}
                        onPress={() => {setHosshin(hosshin === 1 ? 0 : 1);}}
                    />
                    <CheckBox
                        title='怪我'
                        checked={kega}
                        onPress={() => {setKega(kega === 1 ? 0 : 1);}}
                    />
                    <CheckBox
                        title='薬'
                        checked={kusuri}
                        onPress={() => {setKusuri(kusuri === 1 ? 0 : 1);}}
                    />
                </View>
            </View>
            <View style={styles.inputContainer}>
                <Text>体温</Text>
                <TextInput
                        keyboardType="decimal-pad"
                        value={bodyTemperature}
                        style={styles.input}
                        onChangeText={(text) => { setBodyTemperature(Number(text)); }}
                        //autoFocus
                        placeholder = "体温を入力"
                        textAlign={"center"}//入力表示位置
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
                        //autoFocus
                        placeholder = "メモを入力"
                        maxLength={100}
                />
            </View>
            <View style={modalStyles.container}>
                <TouchableOpacity style={modalStyles.confirmButton} onPress={toggleModal} >
                    <Text style={modalStyles.confirmButtonText}>close</Text>
                </TouchableOpacity>
                <TouchableOpacity style={modalStyles.confirmButton} onPress={saveDiseaseDataToSQLite} >
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
        //height: 50,
        //backgroundColor: '#987652',
        //flex: 1,
        //flexDirection: 'row',
        //width: 350 ,
        
    },
    inputContainer: {
        paddingHorizontal: 27,
        paddingVertical: 10,
        height: 75,
        backgroundColor: '#859602'
        //flex: 1,
    },
    inputMemoContainer: {
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
    radioButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',//横並び均等配置
    },
    radioButton: {
        //flexDirection: 'row',
        //paddingLeft: 'auto',
        //paddingRight: 'auto',
        //marginLeft: 'auto',
        //marginRight: 'auto',
        justifyContent: 'space-around',//横並び均等配置
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