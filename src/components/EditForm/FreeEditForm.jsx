import React, { useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { useCurrentBabyContext } from '../../context/CurrentBabyContext';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';
import { CheckBox } from 'react-native-elements'

export default function FreeEditForm(props) {
    const { selectTime } = props;
    const { babyData } = props;
    const { toggleModal } = props;
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();
    
    const year = selectTime.getFullYear();
    const month = String(selectTime.getMonth() + 1).padStart(2, '0');

    const [freeText, setFreeText] = useState(babyData.free_text);
    const [detailBody, setBodyText] = useState(babyData.memo);

    function handlePress() {
        if (freeText) {
            Alert.alert(
                '更新します', 'よろしいですか？',
                [
                    {
                        text: 'キャンセル',
                        style: 'cancel',
                        onPress: () => {},
                    },
                    {
                        text: '更新',
                        style: 'default',
                        onPress: () => {
                            const db = SQLite.openDatabase('BABY.db');
                            db.transaction(
                                (tx) => {
                                    tx.executeSql(
                                        'UPDATE CommonRecord_' + year + '_' + month + ' SET memo = ?, record_time = ? WHERE record_id = ?',
                                        [
                                            detailBody,
                                            new Date(selectTime).toISOString(),
                                            babyData.record_id
                                        ],
                                        (_, result) => {
                                            tx.executeSql(
                                                'UPDATE FreeRecord_' + year + '_' + month + ' SET free_text = ? WHERE record_id = ?',
                                                [
                                                    freeText,
                                                    babyData.record_id
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
                                }
                            );
                        },
                    },
                ],
            );
        } else {
            Alert.alert('チェックが入っていません');
        }
    }

    function deleteItem() {
        Alert.alert('削除します', 'よろしいですか？', [
            {
                text: 'キャンセル',
                style: 'cancel',
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
                        'DELETE FROM CommonRecord_' + year + '_' + month + ' WHERE record_id = ?',
                        [babyData.record_id],
                        (_, result) => {
                            tx.executeSql(
                                'DELETE FROM FreeRecord_' + year + '_' + month + ' WHERE record_id = ?',
                                [babyData.record_id],
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
                                    console.error('削除中にエラーが発生しました:', error);
                                }
                            );
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
    }

    return (
        <ScrollView scrollEnabled={false}>
            <View style={styles.inputContainer}>
                <Text>自由入力</Text>
                <TextInput
                        keyboardType="web-search"
                        value={freeText}
                        //multiline
                        style={styles.input}
                        onChangeText={(text) => { setFreeText(text); }}
                        //autoFocus
                        placeholder = "自由項目を入力"
                />
            </View>
            <View style={styles.inputTextContainer}>
                <Text>メモ</Text>
                <TextInput
                    keyboardType="web-search"
                    value={detailBody}
                    multiline
                    style={styles.input}
                    onChangeText={(text) => { setBodyText(text); }}
                    placeholder = "メモを入力"
                />
            </View>
            <View style={styles.container}>
                <TouchableOpacity style={styles.confirmButton} onPress={deleteItem} >
                    <Text style={styles.confirmButtonText}>削除</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={handlePress} >
                    <Text style={styles.confirmButtonText}>更新</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <TouchableOpacity style={styles.confirmButton} onPress={toggleModal} >
                    <Text style={styles.confirmButtonText}>close</Text>
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
    inputContainer: {
        paddingHorizontal: 27,
        paddingVertical: 10,
        height: 75,
        backgroundColor: '#859602'
        //flex: 1,
    },
    inputTextContainer: {
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
