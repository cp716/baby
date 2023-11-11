import React, { useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { useCurrentBabyContext } from '../../context/CurrentBabyContext';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';
import { CheckBox } from 'react-native-elements'

export default function FoodEditForm(props) {
    const { selectTime } = props;
    const { babyData } = props;
    const { toggleModal } = props;
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();

    const year = selectTime.getFullYear();
    const month = String(selectTime.getMonth() + 1).padStart(2, '0');

    const [selectedCategory, setSelectedCategory] = useState(babyData.category);
    const [amount, setAmount] = useState(String(babyData.amount) == 0 ? '' : String(babyData.amount));
    const [memo, setMemo] = useState(babyData.memo);

    function handlePress() {
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
                        let amountToSave = 0;
                        if (amount !== '') {
                            amountToSave = Number(amount);
                        }
                        db.transaction(
                            (tx) => {
                                tx.executeSql(
                                    'UPDATE CommonRecord_' + year + '_' + month + ' SET category = ?, memo = ?, record_time = ? WHERE record_id = ?',
                                    [
                                        selectedCategory,
                                        memo,
                                        new Date(selectTime).toISOString(),
                                        babyData.record_id
                                    ],
                                    (_, result) => {
                                        tx.executeSql(
                                            'UPDATE FoodRecord_' + year + '_' + month + ' SET amount = ? WHERE record_id = ?',
                                            [
                                                amountToSave,
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
                                'DELETE FROM FoodRecord_' + year + '_' + month + ' WHERE record_id = ?',
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
                    {selectedCategory === 'FOOD' || selectedCategory === 'DRINK' ? 
                        (selectedCategory === 'FOOD' ? '食べ物(単位/g)' : '飲み物(単位/ml)') : '量'}
                </Text>
                <TextInput
                    keyboardType="number-pad"
                    value={amount}
                    style={styles.amountInput}
                    onChangeText={(text) => {
                        setAmount(text);
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
                    //placeholder="入力してください"
                />
            </View>
            <View style={modalStyles.container}>
                <TouchableOpacity style={modalStyles.confirmDeleteButton} onPress={deleteItem}>
                    <Text style={modalStyles.confirmDeleteButtonText}>削除</Text>
                </TouchableOpacity>
                <TouchableOpacity style={modalStyles.confirmButton} onPress={handlePress}>
                    <Text style={modalStyles.confirmButtonText}>更新</Text>
                </TouchableOpacity>
            </View>
            <View style={modalStyles.container}>
                <TouchableOpacity style={modalStyles.confirmCloseButton} onPress={toggleModal}>
                    <Text style={modalStyles.confirmCloseButtonText}>閉じる</Text>
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
        width: '45%', // チェックボックスの幅を均等に設定
    },
    checkboxContainer: {
        //width: '80%',
    },
    checkboxTitle: {
        fontSize: 15,
    },
    advertisement: {
        paddingTop: '5%',
        //paddingBottom: '5%',
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
        //marginTop: '5%',
        //backgroundColor: '#FFF',
        backgroundColor : '#FFDB59',
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
    confirmDeleteButton: {
        marginLeft: 'auto',
        marginRight: 'auto',
        //marginTop: '5%',
        backgroundColor: '#FFF',
        //backgroundColor : '#F97773',
        //borderColor: '#737373',
        //borderWidth: 0.5,
        borderRadius: 10,
        width: '40%',
    },
    confirmDeleteButtonText: {
        color: '#737373',
        //fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
        fontSize: 16,
    },
    confirmCloseButton: {
        marginLeft: 'auto',
        marginRight: 'auto',
        //marginTop: '5%',
        backgroundColor: '#FFF',
        //backgroundColor : '#F97773',
        //borderColor: '#737373',
        //borderWidth: 0.5,
        borderRadius: 10,
        width: '40%',
    },
    confirmCloseButtonText: {
        color: '#737373',
        //fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
        fontSize: 16,
    },
});
