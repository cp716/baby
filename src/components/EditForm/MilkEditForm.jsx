import React, { useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { useCurrentBabyContext } from '../../context/CurrentBabyContext';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';

export default function ToiletEditForm(props) {
    const { selectTime } = props;
    const { babyData } = props;
    const { toggleModal } = props;
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();
    
    const year = selectTime.getFullYear();
    const month = String(selectTime.getMonth() + 1).padStart(2, '0');

    const [detailLeft, setTimeLeft] = useState(("00" + babyData.junyu_left ).slice(2));
    const [detailRight, setTimeRight] = useState(("00" + babyData.junyu_right ).slice(2));
    const [detailMilk, setMilk] = useState(("000" + babyData.milk).slice(3));
    const [detailBonyu, setBonyu] = useState(("000" + babyData.bonyu).slice(3));
    const [detailBody, setBodyText] = useState(babyData.memo);

    function handlePress() {
        if (detailMilk || detailBonyu || detailLeft || detailRight) {
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
                            const db = SQLite.openDatabase('DB.db');
                            db.transaction(
                                (tx) => {
                                    if (babyData.category == 'MILK') {
                                        return (
                                            tx.executeSql(
                                                'UPDATE CommonRecord_' + year + '_' + month + ' SET memo = ?, record_time = ? WHERE record_id = ?',
                                                [
                                                    detailBody,
                                                    new Date(selectTime).toISOString(),
                                                    babyData.record_id
                                                ],
                                                (_, result) => {
                                                    tx.executeSql(
                                                        'UPDATE MilkRecord_' + year + '_' + month + ' SET milk = ? WHERE record_id = ?',
                                                        [
                                                            Number(detailMilk),
                                                            babyData.record_id
                                                        ],
                                                        (_, result) => {
                                                            // 画面リフレッシュのためcurrentBabyStateを更新
                                                            currentBabyDispatch({
                                                                type: 'addBaby',
                                                                name: currentBabyState.name,
                                                                birthday: currentBabyState.birthday,
                                                                id: currentBabyState.id,
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
                                        );
                                    }
                                    if (babyData.category == 'BONYU') {
                                        return (
                                            tx.executeSql(
                                                'UPDATE CommonRecord_' + year + '_' + month + ' SET memo = ?, record_time = ? WHERE record_id = ?',
                                                [
                                                    detailBody,
                                                    new Date(selectTime).toISOString(),
                                                    babyData.record_id
                                                ],
                                                (_, result) => {
                                                    tx.executeSql(
                                                        'UPDATE MilkRecord_' + year + '_' + month + ' SET bonyu = ? WHERE record_id = ?',
                                                        [
                                                            Number(detailBonyu),
                                                            babyData.record_id
                                                        ],
                                                        (_, result) => {
                                                            // 画面リフレッシュのためcurrentBabyStateを更新
                                                            currentBabyDispatch({
                                                                type: 'addBaby',
                                                                name: currentBabyState.name,
                                                                birthday: currentBabyState.birthday,
                                                                id: currentBabyState.id,
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
                                        );
                                    }
                                    if (babyData.category == 'JUNYU') {
                                        let left = 0;
                                        let right = 0;
                                        if (babyData.timeLeft !== "") {
                                            left = Number(detailLeft)
                                        }
                                        if(babyData.timeRight !== "") {
                                            right = Number(detailRight)
                                        }
                                        return (
                                            tx.executeSql(
                                                'UPDATE CommonRecord_' + year + '_' + month + ' SET memo = ?, record_time = ? WHERE record_id = ?',
                                                [
                                                    detailBody,
                                                    new Date(selectTime).toISOString(),
                                                    babyData.record_id
                                                ],
                                                (_, result) => {
                                                    tx.executeSql(
                                                        'UPDATE MilkRecord_' + year + '_' + month + ' SET junyu_left = ?, junyu_right = ? WHERE record_id = ?',
                                                        [
                                                            left,
                                                            right,
                                                            babyData.record_id
                                                        ],
                                                        (_, result) => {
                                                            // 画面リフレッシュのためcurrentBabyStateを更新
                                                            currentBabyDispatch({
                                                                type: 'addBaby',
                                                                name: currentBabyState.name,
                                                                birthday: currentBabyState.birthday,
                                                                id: currentBabyState.id,
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
                                        );
                                    }
                                }
                            );
                        },
                    },
                ],
            );
        } else {
            Alert.alert('入力してください');
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
                    const db = SQLite.openDatabase('DB.db');
                    db.transaction(
                    (tx) => {
                        tx.executeSql(
                        'DELETE FROM CommonRecord_' + year + '_' + month + ' WHERE record_id = ?',
                        [babyData.record_id],
                        (_, result) => {
                            tx.executeSql(
                                'DELETE FROM MilkRecord_' + year + '_' + month + ' WHERE record_id = ?',
                                [babyData.record_id],
                                (_, result) => {
                                    // 画面リフレッシュのためcurrentBabyStateを更新
                                    currentBabyDispatch({
                                        type: 'addBaby',
                                        name: currentBabyState.name,
                                        birthday: currentBabyState.birthday,
                                        id: currentBabyState.id,
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
            {(() => {
                if (babyData.category == 'JUNYU') {
                    return (
                        <View style={styles.inputTypeContainer}>
                            <Text>左</Text>
                                <TextInput
                                    keyboardType="number-pad"
                                    returnKeyType = {"next"}
                                    value={detailLeft}
                                    textAlign={"center"}//入力表示位置
                                    multiline
                                    style={styles.input}
                                    onChangeText={(text) => { setTimeLeft(Number(text));}}
                                    //autoFocus
                                    maxLength={2}
                                />
                            <Text>分</Text>
                            <Text>右</Text>
                                <TextInput
                                    keyboardType="number-pad"
                                    value={detailRight}
                                    textAlign={"center"}//入力表示位置
                                    multiline
                                    style={styles.input}
                                    onChangeText={(text) => { setTimeRight(Number(text)); }}
                                    //autoFocus
                                    maxLength={2}
                                />
                            <Text>分</Text>
                        </View>
                    );
                } else if (babyData.category == 'MILK') {
                    return (
                        <View style={styles.inputTypeContainer}>
                            <Text>ミルク</Text>
                                <TextInput
                                    //name={'milk'}
                                    keyboardType="number-pad"
                                    type={"number"}
                                    returnKeyType = {"next"}
                                    value={detailMilk}
                                    textAlign={"center"}//入力表示位置
                                    multiline
                                    style={styles.input}
                                    onChangeText={(text) => { setMilk(Number(text)); }}
                                    //autoFocus
                                    maxLength={3}
                                />
                            <Text>ml</Text>
                        </View>
                    );
                } else if (babyData.category == 'BONYU') {
                    return (
                        <View style={styles.inputTypeContainer}>
                            <Text>母乳</Text>
                            <TextInput
                                keyboardType="number-pad"
                                value={detailBonyu}
                                textAlign={"center"}//入力表示位置
                                multiline
                                style={styles.input}
                                onChangeText={(text) => { setBonyu(Number(text)); }}
                                //autoFocus
                                maxLength={3}
                            />
                            <Text>ml</Text>
                        </View>
                    );
                }
            })()}
            <View style={styles.inputContainer}>
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
    inputTypeContainer: {
        paddingHorizontal: 27,
        paddingVertical: 10,
        height: 50,
        backgroundColor: '#987652',
        flexDirection: 'row',
    },
    inputContainer: {
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
