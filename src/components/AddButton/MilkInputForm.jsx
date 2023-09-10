import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';
import firebase from 'firebase';
import storage from '../../context/Storage';

export default function MilkInputForm(props) {
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
    const [timeLeft,  setTimeLeft] = useState('');
    const [timeRight,  setTimeRight] = useState('');
    const [milk,  setMilk] = useState('');
    const [bonyu,  setBonyu] = useState('');
    
    function handlePress() {
        
        const db = firebase.firestore();
        const { currentUser } = firebase.auth();
        const ref = db.collection(`users/${currentUser.uid}/babyData`).doc(babyIdData)
        .collection(`${year}_${month}`)
        
        if(timeLeft || timeRight || milk || bonyu !== "") {
            if (timeLeft || timeRight !== "") {
                let left = 0;
                let right = 0;
                if (timeLeft !== "") {
                    left = timeLeft
                }
                if(timeRight !== "") {
                    right = timeRight
                }
                ref.add({
                    'category':'JUNYU',
                    updatedAt: selectTime,
                    day: day,
                    bodyText,
                    timeLeft: left,
                    timeRight: right,
                })
                .then((docRef) => {
                    console.log('書き込みました', docRef.id);
                })
                .catch((error) => {
                    console.log('失敗しました', error);
                });
            }

            if (milk !== "") {
                ref.add({
                    'category':'MILK',
                    updatedAt: selectTime,
                    day: day,
                    bodyText,
                    milk,
                })
                .then((docRef) => {
                    console.log('書き込みました', docRef.id);
                })
                .catch((error) => {
                    console.log('失敗しました', error);
                });
            }

            if (bonyu !== "") {
                ref.add({
                    'category':'BONYU',
                    updatedAt: selectTime,
                    day: day,
                    bodyText,
                    bonyu,
                })
                .then((docRef) => {
                    console.log('書き込みました', docRef.id);
                })
                .catch((error) => {
                    console.log('失敗しました', error);
                });
            }
            toggleModal()
        } else {
            Alert.alert("未入力です");
        }
    }

    return (
        <ScrollView scrollEnabled={false}>
            <View style={styles.inputTypeContainer}>
                <Text>左</Text>
                    <TextInput
                        keyboardType="number-pad"
                        returnKeyType = {"next"}
                        value={timeLeft}
                        textAlign={"center"}//入力表示位置
                        style={styles.input}
                        onChangeText={(text) => { setTimeLeft(Number(text));}}
                        //autoFocus
                        maxLength={2}
                    />
                <Text>分</Text>
                <Text>右</Text>
                    <TextInput
                        keyboardType="number-pad"
                        value={timeRight}
                        textAlign={"center"}//入力表示位置
                        style={styles.input}
                        onChangeText={(text) => { setTimeRight(Number(text)); }}
                        //autoFocus
                        maxLength={2}
                    />
                <Text>分</Text>
            </View>
            <View style={styles.inputTypeContainer}>
                <Text>ミルク</Text>
                    <TextInput
                        //name={'milk'}
                        keyboardType="number-pad"
                        type={"number"}
                        returnKeyType = {"next"}
                        value={milk}
                        textAlign={"center"}//入力表示位置
                        style={styles.input}
                        onChangeText={(text) => { setMilk(Number(text)); }}
                        //autoFocus
                        maxLength={3}
                    />
                <Text>ml</Text>
                <Text>母乳</Text>
                    <TextInput
                        keyboardType="number-pad"
                        value={bonyu}
                        textAlign={"center"}//入力表示位置
                        style={styles.input}
                        onChangeText={(text) => { setBonyu(Number(text)); }}
                        //autoFocus
                        maxLength={3}
                    />
                <Text>ml</Text>
            </View>
            <View style={styles.inputContainer}>
                <Text>メモ</Text>
                <TextInput
                        keyboardType="web-search"
                        value={bodyText}
                        multiline//複数行入力
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
        height: 50,
        backgroundColor: '#987652',
        //flex: 1,
        flexDirection: 'row',
        //width: 350 ,
        
    },
    inputContainer: {
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