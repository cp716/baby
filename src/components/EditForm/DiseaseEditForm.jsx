import React, { useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { useCurrentBabyContext } from '../../context/CurrentBabyContext';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';
import { CheckBox } from 'react-native-elements'

export default function DiseaseEditForm(props) {
    const { selectTime } = props;
    const { babyData } = props;
    const { toggleModal } = props;
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();
    
    const year = selectTime.getFullYear();
    const month = String(selectTime.getMonth() + 1).padStart(2, '0');

    const [selectedCategory, setSelectedCategory] = useState(babyData.category);
    const [memo, setMemo] = useState(babyData.memo);
    const [bodyTemperature, setBodyTemperature] = useState(String(babyData.body_temperature) == 0 ? '' : String(babyData.body_temperature));

    function handlePress() {
        let temperature = 0;
        if (bodyTemperature !== '') {
            temperature = Number(bodyTemperature);
            if (isNaN(temperature)) {
                Alert.alert("有効な値を入力してください");
                return;
            }
        }
        if(selectedCategory == 'TAION' && bodyTemperature < 32 || selectedCategory == 'TAION' && bodyTemperature > 43 || selectedCategory == 'TAION' &&  bodyTemperature === 0) {
            Alert.alert("32℃から43℃までの値を入力してください");
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
                        //let temperature = 0;
                        //if (bodyTemperature !== "") {
                        //    temperature = bodyTemperature
                        //}
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
                                            'UPDATE DiseaseRecord_' + year + '_' + month + ' SET body_temperature = ? WHERE record_id = ?',
                                            [
                                                parseFloat(temperature),
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
                                'DELETE FROM DiseaseRecord_' + year + '_' + month + ' WHERE record_id = ?',
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
                                        setBodyTemperature(text)
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
                    maxLength={100}
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
