import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import storage from '../../context/Storage';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';
import { CheckBox } from 'react-native-elements'

export default function FoodEditForm(props) {
    const { selectTime } = props;
    const { babyData } = props;
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

    const year = selectTime.getFullYear();
    const month = selectTime.getMonth() + 1;
    const day = selectTime.getDate();

    const [tansuikabutsu, setTansuikabutsu] = useState(babyData.food.tansuikabutsu);
    const [tampakushitsu, setTampakushitsu] = useState(babyData.food.tampakushitsu);
    const [bitamin, setBitamin] = useState(babyData.food.bitamin);
    const [chomiryo, setChomiryo] = useState(babyData.food.chomiryo);
    const [drink, setDrink] = useState(babyData.food.drink);
    const [detailBody, setBodyText] = useState(babyData.bodyText);

    if(isNaN(drink)) {
        setDrink('')
    }

    function handlePress() {
        const { currentUser } = firebase.auth();
        if (currentUser ) {
            const db = firebase.firestore();
            const ref = db.collection(`users/${currentUser.uid}/babyData/`).doc(babyIdData)
            .collection(`${year}_${month}`).doc(babyData.id)
            
            return (
                ref.set({
                    'category':'FOOD',
                    bodyText: detailBody,
                    updatedAt: selectTime,
                    food: {
                        tansuikabutsu: tansuikabutsu,
                        tampakushitsu: tampakushitsu,
                        bitamin: bitamin,
                        chomiryo: chomiryo,
                        drink: parseInt(drink),
                    }
                }, { merge: true })
                .then(() => {
                    toggleModal()
                })
                .catch((error) => {
                    Alert.alert(error.code);
                })
            );
        }
    }

    function deleteItem() {
        const { currentUser } = firebase.auth();
        if(currentUser) {
            const db = firebase.firestore();
            const ref = db.collection(`users/${currentUser.uid}/babyData/`).doc(babyIdData)
            .collection(`${year}_${month}`).doc(babyData.id)
            
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
                        value={String(drink)}
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
    },
    input: {
        flex: 1,
        textAlignVertical: 'top',
        fontSize: 16,
        lineHeight: 25,
        backgroundColor: '#ffffff'
    },
    radioButton: {
        justifyContent: 'space-around',//横並び均等配置
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
