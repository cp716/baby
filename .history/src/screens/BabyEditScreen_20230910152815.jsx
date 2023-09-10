import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, } from 'react-native';
import firebase from 'firebase';
import storage from '../context/Storage';

import Button from '../components/Button';
import Loading from '../components/Loading';
import { translateErrors } from '../utils';

import { useBabyContext } from '../../context/BabyContext';
import { useCurrentBabyContext } from '../../context/CurrentBabyContext';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function BabyEditScreen(props) {
    const { navigation } = props;
    //const [isLoading, setLoading] = useState(true);
    const [isLoading, setLoading] = useState(false);

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

    function handlePressTest() {
        setLoading(true);
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredentail) => {
            const { user } = userCredentail;
            console.log(user.uid);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Setting'}],
            });
        })
        .catch((error) => {
            const errorMsg = translateErrors(error.code);
            Alert.alert(errorMsg.title, errorMsg.description);
        })
        .then(() => {
            setLoading(false);
        });   
    }

    return (
        <View style={styles.container}>
            <Loading isLoading={isLoading} />
            <View style={styles.inner}>
                <Text style={styles.title}>赤ちゃん編集</Text>
                <Text style={styles.inputText}>名前</Text>
                <TextInput
                    style={styles.input}
                    value={babyNameData}
                    onChangeText={(text) => { setEmail(text); }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="入力してください"
                    placeholderTextColor="#BFBFBF"
                    textContentType="emailAddress"
                />
                <Text style={styles.inputText}>誕生日</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={(text) => { setPassword(text); }}
                    autoCapitalize="none"
                    placeholder="入力してください"
                    placeholderTextColor="#BFBFBF"
                    secureTextEntry
                    textContentType="password"
                />
                <View style={styles.buttonArea}>
                    <Button
                        label="削除"
                        onPress={handlePress}
                    />
                    <Button
                        label="更新"
                        onPress={handlePress}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8',
    },
    inner: {
        paddingHorizontal: 27,
        paddingVertical: 24,
    },
    inputText: {
        fontSize: 15,
        lineHeight: 32,
        //fontWeight: 'bold',
        marginBottom: 1,
        color: '#737373',
    },
    title: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    input: {
        fontSize: 16,
        height: 48,
        borderColor: '#DDDDDD',
        borderWidth: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 8,
        marginBottom: 20,
    },
    buttonArea: {
        flexDirection: 'row',
    },
});