import React, { useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { useCurrentBabyContext } from '../../context/CurrentBabyContext';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';
import { CheckBox } from 'react-native-elements'

export default function BodyEditForm(props) {
    const { selectTime } = props;
    const { babyData } = props;
    const { toggleModal } = props;
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();

    const year = selectTime.getFullYear();
    const month = String(selectTime.getMonth() + 1).padStart(2, '0');

    const [selectedCategory, setSelectedCategory] = useState(babyData.category);
    const [value, setValue] = useState(String(babyData.value) == 0 ? '' : String(babyData.value));
    const [memo, setMemo] = useState(babyData.memo);

    function saveBodyDataToSQLite() {
        let valueToSave = 0;
        if (value !== '') {
            valueToSave = Number(value);
            if (isNaN(valueToSave)) {
                Alert.alert("有効な値を入力してください");
                return;
            }
        } else {
            Alert.alert("値を入力してください");
            return;
        }
        valueToSave = Math.floor(valueToSave * 10) / 10;
        if(selectedCategory == 'HEIGHT' && valueToSave < 20 || selectedCategory == 'HEIGHT' && valueToSave > 150 || selectedCategory == 'HEIGHT' &&  valueToSave === 0) {
            Alert.alert("20cmから150cmまでの値を入力してください");
            return;
        }
        if(selectedCategory == 'WEIGHT' && valueToSave < 1 || selectedCategory == 'WEIGHT' && valueToSave > 50 || selectedCategory == 'WEIGHT' &&  valueToSave === 0) {
            Alert.alert("1kgから50kgまでの値を入力してください");
            return;
        }
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
                                    'UPDATE CommonRecord_' + year + '_' + month + ' SET category = ?, memo = ?, record_time = ? WHERE record_id = ?',
                                    [
                                        selectedCategory,
                                        memo,
                                        new Date(selectTime).toISOString(),
                                        babyData.record_id
                                    ],
                                    (_, result) => {
                                        tx.executeSql(
                                            'UPDATE BodyRecord_' + year + '_' + month + ' SET value = ? WHERE record_id = ?',
                                            [
                                                valueToSave,
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

    const handlePress = () => {
        Alert.alert('更新します', 'よろしいですか？', [
            {
                text: 'キャンセル',
                style: 'cancel',
                onPress: () => {},
            },
            {
                text: '更新',
                style: 'default',
                onPress: () => {
                    saveBodyDataToSQLite();
                },
            },
        ]);
    };

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
                                'DELETE FROM BodyRecord_' + year + '_' + month + ' WHERE record_id = ?',
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
                        title="身長"
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={selectedCategory === 'HEIGHT'}
                        onPress={() => setSelectedCategory('HEIGHT')}
                        containerStyle={styles.checkboxContainer}
                        titleProps={{ style: styles.checkboxTitle }}
                    />
                </View>
                <View style={styles.radioButton}>
                    <CheckBox
                        title="体重"
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={selectedCategory === 'WEIGHT'}
                        onPress={() => setSelectedCategory('WEIGHT')}
                        containerStyle={styles.checkboxContainer}
                        titleProps={{ style: styles.checkboxTitle }}
                    />
                </View>
            </View>
            <View style={styles.inputValueContainer}>
                <Text style={styles.inputTitle}>
                    {selectedCategory === 'HEIGHT' || selectedCategory === 'WEIGHT' ? 
                        (selectedCategory === 'HEIGHT' ? '身長(cm)' : '体重(kg)') : '身長 or 体重'}
                </Text>
                <TextInput
                    keyboardType="decimal-pad"
                    value={value}
                    style={styles.valueInput}
                    onChangeText={(text) => {
                        setValue(text);
                    }}
                    textAlign={"center"}
                    maxLength={5}
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
                <TouchableOpacity style={modalStyles.confirmButton} onPress={saveBodyDataToSQLite}>
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
    inputValueContainer: {
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
    valueInput: {
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
