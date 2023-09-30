import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';
import firebase from 'firebase';
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
    
    const [oshikko, setOshikko] = useState(0);
    const [unchi, setUnchi] = useState(0);
    const [bodyText, setBodyText] = useState('');

    useEffect(() => {
        const db = SQLite.openDatabase('DB.db');
        db.transaction(
            (tx) => {
                // テーブルが存在しない場合は作成
                tx.executeSql(
                'CREATE TABLE IF NOT EXISTS ToiletRecord_' + year + '_' + month + ' (id INTEGER PRIMARY KEY, babyId INTEGER, day INTEGER, category TEXT, oshikko INTEGER, unchi INTEGER, bodyText TEXT, updatedAt DATETIME)',
                [],
                () => {
                    console.log('ToiletRecord_' + year + '_' + month + 'テーブルが作成されました');
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

    const saveToiletDataToSQLite = () => {
        const db = SQLite.openDatabase('DB.db');
        db.transaction(
        (tx) => {
            tx.executeSql(
            'INSERT INTO ToiletRecord_' + year + '_' + month + ' (babyId, day, category, oshikko, unchi, bodyText, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                currentBabyState.id,
                day,
                'TOILET',
                oshikko,
                unchi,
                bodyText,
                new Date(selectTime).toISOString()
            ],
            (_, result) => {
                // 画面リフレッシュのためcurrentBabyStateを更新
                currentBabyDispatch({
                    type: 'addBaby',
                    name: currentBabyState.name,
                    birthday: currentBabyState.birthday,
                    id: currentBabyState.id,
                });
                toggleModal()
            },
            (_, error) => {
                console.error('データの挿入中にエラーが発生しました:', error);
            }
            );
        }
        );
    };
    
    function handlePress() {
        const db = firebase.firestore();
        const { currentUser } = firebase.auth();
        const ref = db.collection(`users/${currentUser.uid}/babyData`).doc(currentBabyState.id.toString())
        .collection(`${year}_${month}`)

        if( oshikko || unchi ) {
            ref.add({
                'category':'TOILET',
                updatedAt: selectTime,
                day: day,
                bodyText,
                toilet: {
                    oshikko: oshikko,
                    unchi: unchi,
                },
            })
            .then((docRef) => {
                console.log('書き込みました', docRef.id);
            })
            .catch((error) => {
                console.log('失敗しました', error);
            });
            toggleModal()
        } else {
            Alert.alert("未入力です");
        }
    }

    return (
        <ScrollView scrollEnabled={false}>
            <View style={styles.inputTypeContainer}>
                <View style={styles.radioButton}>
                    <CheckBox
                        title='おしっこ'
                        //checked={oshikko}
                        //onPress={() => setOshikko(!oshikko)}
                        checked={oshikko === 1} // valueが1の場合に選択済み、それ以外の場合は未選択
                        onPress={() => {setOshikko(oshikko === 1 ? 0 : 1);}}
                    />
                    <CheckBox
                        title='うんち'
                        //checked={unchi}
                        //onPress={() => setUnchi(!unchi)}
                        checked={unchi === 1} // valueが1の場合に選択済み、それ以外の場合は未選択
                        onPress={() => {setUnchi(unchi === 1 ? 0 : 1);}}
                    />
                </View>
            </View>
            <View style={styles.inputContainer}>
                <Text>メモ</Text>
                <TextInput
                        keyboardType="web-search"
                        value={bodyText}
                        multiline
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
                <TouchableOpacity style={modalStyles.confirmButton} onPress={saveToiletDataToSQLite} >
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