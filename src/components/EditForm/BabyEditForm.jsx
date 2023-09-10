import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import storage from '../../context/Storage';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, Button } from 'react-native';
import { useBabyContext } from '../../context/BabyContext';
import { useCurrentBabyContext } from '../../context/CurrentBabyContext';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function BabyEditForm(props) {
    const { babyData } = props;
    const { toggleModal } = props;

    const { baby } = useBabyContext();
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [detaiBirthday, setDetailBirthday] = useState('誕生日を選択');

    const [babyNameData, setBabyNameData] = useState('');
    const [babyIdData, setBabyIdData] = useState('');
    const [babyBirthdayData, setBabyBirthdayData] = useState('');

    useEffect(() => {
        storage.load({
            key : 'selectbaby',
        }).then(data => {
            // 読み込み成功時処理
            setBabyNameData(data.babyName)
            setBabyIdData(data.babyId)
            setBabyBirthdayData(new Date(data.babyBirthday))

            const date = new Date(data.babyBirthday)
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            setDetailBirthday(year + '年' + (month + 1) + '月' + day + '日')
        }).catch(err => {
            // 読み込み失敗時処理
            console.log(err)
        });
    }, [baby, currentBabyState]);

    function handlePress() {            
        if( babyNameData !== "") {
            const { currentUser } = firebase.auth();
            const db = firebase.firestore();
            const ref = db.collection(`users/${currentUser.uid}/babyData`).doc(babyIdData);
            Alert.alert('「' + babyNameData + '」の情報を更新します', 'よろしいですか？', [
                {
                    text: 'キャンセル',
                    onPress: () => {},
                },
                {
                    text: '登録する',
                    //style: 'destructive',
                    onPress: () => {
                        //navigation.jumpTo('Home');
                        toggleModal()
                        ref.set({
                            babyName: babyNameData,
                            birthday: babyBirthdayData,
                        })
                        .then((docRef) => {
                            currentBabyDispatch({ 
                                type: "addBaby",
                                babyName: babyNameData,
                                babyBirthday: babyBirthdayData,
                                babyId: babyIdData,
                            })
                        })
                        .catch((error) => {
                            console.log('失敗しました', error);
                        });
                    },
                },
            ]);
        } else {
            Alert.alert("未入力です");
        }
    }

    function deleteItem() {
        const { currentUser } = firebase.auth();
        if(currentUser) {
            const db = firebase.firestore();
            const ref = db.collection(`users/${currentUser.uid}/babyData`).doc(babyIdData);
            Alert.alert('削除します', 'よろしいですか？', [
                {
                    text: 'キャンセル',
                    onPress: () => {},
                },
                {
                    text: '削除する',
                    style: 'destructive',
                    onPress: () => {
                        toggleModal()
                        ref.delete().catch(() => {
                            Alert.alert('削除に失敗しました');
                        });
                    },
                },
            ]);
        }
    }

    //起動
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    //終了
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    //表示用のstateへ日時を代入
    const formatDatetime = (date) => {
        setDetailBirthday(date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日');
    };

    //決定ボタン押下時の処理
    const handleConfirm = (date) => {
        setBabyBirthdayData(date);
        formatDatetime(date);
        hideDatePicker();
    };

    return (
        <ScrollView scrollEnabled={false}>
            <View style={styles.inputContainer}>
                <Text>名前</Text>
                <TextInput
                        keyboardType="web-search"
                        value={babyNameData}
                        style={styles.input}
                        onChangeText={(text) => { setBabyNameData(text); }}
                        //autoFocus
                        placeholder = "赤ちゃんの名前を入力"
                />
            </View>
            <View>
                        <Button title={detaiBirthday} onPress={showDatePicker} />
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            value={new Date(babyBirthdayData)}
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                            mode="date"//入力項目
                            locale='ja'//日本語化
                            display="spinner"//UIタイプ
                            confirmTextIOS="決定"//決定ボタンテキスト
                            cancelTextIOS="キャンセル"//キャンセルボタンテキスト
                            minuteInterval={5}//分数間隔
                            headerTextIOS=""//入力欄ヘッダーテキスト
                            textColor="blue"//ピッカーカラー
                            date={new Date(babyBirthdayData)}//ピッカー日付デフォルト
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
        height: 75,
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
});
