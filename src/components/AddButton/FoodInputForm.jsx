import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import firebase from 'firebase';
import { useBabyContext } from '../../context/BabyContext';

import { CheckBox } from 'react-native-elements'

export default function FoodInputForm(props) {
    const { selectTime } = props;
    const { toggleModal } = props;

    const { currentBaby } = useBabyContext();
    const [babyIdData, setBabyIdData] = useState('');

    useEffect(() => {
        const currentBabyData = [];
        if(currentBaby !== "") {
            currentBaby.forEach((doc) => {
                const data = doc.data();
                setBabyIdData(data.babyId)
                //setBabyNameData(data.babyName)
                //setBabyBirthdayData(data.birthday)
            });
        }
    }, []);

    const date = new Date(selectTime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const [foodCheck, setFoodCheck] = useState(false);
    const [drinkCheck, setDrinkCheck] = useState(false);
    const [foodAmount, setFoodAmount] = useState('');
    const [drinkAmount, setDrinkAmount] = useState('');
    const [bodyText, setBodyText] = useState('');

    function handlePress() {
        const db = firebase.firestore();
        const { currentUser } = firebase.auth();
        const ref = db.collection(`users/${currentUser.uid}/babyData`).doc(babyIdData)
        .collection(`${year}_${month}`)
        if( foodCheck || drinkCheck ) {
            ref.add({
                'category':'FOOD',
                updatedAt: selectTime,
                day: day,
                bodyText,
                food: {
                    foodCheck: foodCheck,
                    drinkCheck: drinkCheck,
                    foodAmount: parseInt(foodAmount),
                    drinkAmount: parseInt(drinkAmount),
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
                        title='食事'
                        checked={foodCheck}
                        onPress={() => setFoodCheck(!foodCheck)}
                    />
                    <CheckBox
                        title='飲物'
                        checked={drinkCheck}
                        onPress={() => setDrinkCheck(!drinkCheck)}
                    />
                </View>
            </View>
            <View style={styles.inputContainer}>
                <Text>食物</Text>
                <TextInput
                        keyboardType="decimal-pad"
                        value={foodAmount}
                        style={[styles.input, !foodCheck && styles.disabledInput]}
                        onChangeText={(text) => { setFoodAmount(text); }}
                        //autoFocus
                        placeholder = "量を入力"
                        textAlign={"center"}//入力表示位置
                        maxLength={4}
                        editable={foodCheck} // foodCheck チェック時にのみ編集可能にする
                />
                <Text>飲物</Text>
                <TextInput
                        keyboardType="decimal-pad"
                        value={drinkAmount}
                        style={[styles.input, !drinkCheck && styles.disabledInput]}
                        onChangeText={(text) => { setDrinkAmount(text); }}
                        //autoFocus
                        placeholder = "量を入力"
                        textAlign={"center"}//入力表示位置
                        maxLength={4}
                        editable={drinkCheck} // drinkCheck チェック時にのみ編集可能にする
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
                />
            </View>
            <View style={modalStyles.container}>
                <TouchableOpacity style={modalStyles.confirmButton} onPress={toggleModal} >
                    <Text style={modalStyles.confirmButtonText}>close</Text>
                </TouchableOpacity>
                <TouchableOpacity style={modalStyles.confirmButton} onPress={handlePress} >
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
    disabledInput: {
        backgroundColor: '#e0e0e0', // 無効な入力フィールドの背景色
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