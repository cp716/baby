import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import firebase from 'firebase';
import storage from '../../context/Storage';

import { CheckBox } from 'react-native-elements'

export default function FoodInputForm(props) {
    const { selectTime } = props;
    const { toggleModal } = props;

    const [babyIdData, setBabyIdData] = useState('');

    useEffect(() => {
        storage.load({
            key : 'selectbaby',
        }).then(data => {
            // 読み込み成功時処理
            setBabyIdData(data.babyId)
        }).catch(err => {
            // 読み込み失敗時処理
            console.log(err)
        });
    }, []);

    const date = new Date(selectTime);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
        
    const [bodyText, setBodyText] = useState('');

    const [tansuikabutsu, setTansuikabutsu] = useState(false);
    const [tampakushitsu, setTampakushitsu] = useState(false);
    const [bitamin, setBitamin] = useState(false);
    const [chomiryo, setChomiryo] = useState(false);
    const [drink, setDrink] = useState('');

    function handlePress() {
        
        const db = firebase.firestore();
        const { currentUser } = firebase.auth();
        const ref = db.collection(`users/${currentUser.uid}/babyData`).doc(babyIdData)
        .collection(`${year}_${month}`)
        
        ref.add({
            'category':'FOOD',
            updatedAt: selectTime,
            day: day,
            bodyText,
            food: {
                tansuikabutsu: tansuikabutsu,
                tampakushitsu: tampakushitsu,
                bitamin: bitamin,
                chomiryo: chomiryo,
                drink: parseInt(drink),
            },
        })
        .then((docRef) => {
            console.log('書き込みました', docRef.id);
        })
        .catch((error) => {
            console.log('失敗しました', error);
        });
        toggleModal()
    }

    return (
        <ScrollView scrollEnabled={false}>
            <View style={styles.inputTypeContainer}>
                <View style={styles.radioButton}>
                    <CheckBox
                        title='炭水化物'
                        checked={tansuikabutsu}
                        onPress={() => setTansuikabutsu(!tansuikabutsu)}
                    />
                    <CheckBox
                        title='タンパク資'
                        checked={tampakushitsu}
                        onPress={() => setTampakushitsu(!tampakushitsu)}
                    />
                    <CheckBox
                        title='ビタミン・ミネラル'
                        checked={bitamin}
                        onPress={() => setBitamin(!bitamin)}
                    />
                    <CheckBox
                        title='調味料'
                        checked={chomiryo}
                        onPress={() => setChomiryo(!chomiryo)}
                    />
                </View>
            </View>
            <View style={styles.inputContainer}>
                <Text>飲み物</Text>
                <TextInput
                        keyboardType="decimal-pad"
                        value={drink}
                        style={styles.input}
                        onChangeText={(text) => { setDrink(text); }}
                        //autoFocus
                        placeholder = "量を入力"
                        textAlign={"center"}//入力表示位置
                        maxLength={4}
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