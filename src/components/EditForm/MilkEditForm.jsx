import React, { useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { useCurrentBabyContext } from '../../context/CurrentBabyContext';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';
import { CheckBox } from 'react-native-elements'

export default function ToiletEditForm(props) {
    const { selectTime } = props;
    const { babyData } = props;
    const { toggleModal } = props;
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();
    
    const year = selectTime.getFullYear();
    const month = String(selectTime.getMonth() + 1).padStart(2, '0');

    const [selectedCategory, setSelectedCategory] = useState(babyData.category);
    const [junyuLeft, setJunyuLeft] = useState(String(babyData.junyu_left) == 0 ? '' : String(babyData.junyu_left));
    const [junyuRight, setJunyuRight] = useState(String(babyData.junyu_right) == 0 ? '' : String(babyData.junyu_right));
    const [milk, setMilk] = useState(String(babyData.milk) == 0 ? '' : String(babyData.milk));
    const [bonyu, setBonyu] = useState(String(babyData.bonyu) == 0 ? '' : String(babyData.bonyu));
    const [memo, setMemo] = useState(babyData.memo);

    function saveMilkDataToSQLite() {
        const db = SQLite.openDatabase('BABY.db');
        db.transaction(
            (tx) => {
                if (selectedCategory == 'MILK') {
                    return (
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
                                    'UPDATE MilkRecord_' + year + '_' + month + ' SET milk = ?, bonyu = ?, junyu_left = ?, junyu_right = ? WHERE record_id = ?',
                                    [
                                        Number(milk),
                                        0,
                                        0,
                                        0,
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
                        )
                    );
                }
                if (selectedCategory == 'BONYU') {
                    return (
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
                                    'UPDATE MilkRecord_' + year + '_' + month + ' SET milk = ?, bonyu = ?, junyu_left = ?, junyu_right = ? WHERE record_id = ?',
                                    [
                                        0,
                                        Number(bonyu),
                                        0,
                                        0,
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
                        )
                    );
                }
                if (selectedCategory == 'JUNYU') {
                    let left = 0;
                    let right = 0;
                    if (junyuLeft !== "") {
                        left = Number(junyuLeft)
                    }
                    if(junyuRight !== "") {
                        right = Number(junyuRight)
                    }
                    return (
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
                                    'UPDATE MilkRecord_' + year + '_' + month + ' SET milk = ?, bonyu = ?, junyu_left = ?, junyu_right = ? WHERE record_id = ?',
                                    [
                                        0,
                                        0,
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
                    );
                }
            }
        );
    }

    const handlePress = () => {
        if (selectedCategory !== null) {
            if (
            (Number(milk) !== 0 || Number(bonyu) !== 0 || Number(junyuLeft)  !== 0 || Number(junyuRight) !== 0) &&
            (Number.isInteger(Number(milk)) && Number.isInteger(Number(bonyu)) && Number.isInteger(Number(junyuLeft)) && Number.isInteger(Number(junyuRight)))
            ) {
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
                            saveMilkDataToSQLite();
                        },
                    },
                ]);
            } else {
                Alert.alert('有効な値(整数)を入力してください');
            }
        } else {
            Alert.alert('記録する項目を選んでください');
        }
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
                                'DELETE FROM MilkRecord_' + year + '_' + month + ' WHERE record_id = ?',
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
                                        setBonyu(text);
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
                                            setMilk(text);
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
                                                setJunyuLeft(text);
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
                                                setJunyuRight(text);
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
        justifyContent: 'center'
    },
    amountInput: {
        width: '30%', // 横幅の設定
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
