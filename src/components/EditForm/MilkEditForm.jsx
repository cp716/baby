import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import storage from '../../context/Storage';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';

export default function MilkEditForm(props) {
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

    const [detailLeft, setTimeLeft] = useState(("00" + babyData.timeLeft ).slice(2));
    const [detailRight, setTimeRight] = useState(("00" + babyData.timeRight ).slice(2));
    const [detailMilk, setMilk] = useState(("000" + babyData.milk).slice(3));
    const [detailBonyu, setBonyu] = useState(("000" + babyData.bonyu).slice(3));
    const [detailBody, setBodyText] = useState(babyData.bodyText);

    function handlePress() {
        const { currentUser } = firebase.auth();
        if (currentUser ) {
            const db = firebase.firestore();
            const ref = db.collection(`users/${currentUser.uid}/babyData/`).doc(babyIdData)
            .collection(`${year}_${month}`).doc(babyData.id)

            if (babyData.category == 'JUNYU') {
                let left = 0;
                let right = 0;
                if (babyData.timeLeft !== "") {
                    left = Number(detailLeft)
                }
                if(babyData.timeRight !== "") {
                    right = Number(detailRight)
                }
                return (
                    ref.set({
                        'category':'JUNYU',
                        timeLeft: left,
                        timeRight: right,
                        bodyText: detailBody,
                        updatedAt: selectTime
                    }, { merge: true })
                    .then(() => {
                        toggleModal()
                    })
                    .catch((error) => {
                        Alert.alert(error.code);
                    })
                );
            } else if (babyData.category == 'MILK') {
                return (
                    ref.set({
                        'category':'MILK',
                        milk: Number(detailMilk),
                        bodyText: detailBody,
                        updatedAt: selectTime
                    }, { merge: true })
                    .then(() => {
                        toggleModal()
                    })
                    .catch((error) => {
                        Alert.alert(error.code);
                    })
                );
            } else if (babyData.category == 'BONYU') {
                return (
                    ref.set({
                        'category':'BONYU',
                        bonyu: Number(detailBonyu),
                        bodyText: detailBody,
                        updatedAt: selectTime
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
                        //navigation.goBack();
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
            {(() => {
                if (babyData.category == 'JUNYU') {
                    return (
                        <View style={styles.inputTypeContainer}>
                            <Text>左</Text>
                                <TextInput
                                    keyboardType="number-pad"
                                    returnKeyType = {"next"}
                                    value={detailLeft}
                                    textAlign={"center"}//入力表示位置
                                    multiline
                                    style={styles.input}
                                    onChangeText={(text) => { setTimeLeft(Number(text));}}
                                    //autoFocus
                                    maxLength={2}
                                />
                            <Text>分</Text>
                            <Text>右</Text>
                                <TextInput
                                    keyboardType="number-pad"
                                    value={detailRight}
                                    textAlign={"center"}//入力表示位置
                                    multiline
                                    style={styles.input}
                                    onChangeText={(text) => { setTimeRight(Number(text)); }}
                                    //autoFocus
                                    maxLength={2}
                                />
                            <Text>分</Text>
                        </View>
                    );
                } else if (babyData.category == 'MILK') {
                    return (
                        <View style={styles.inputTypeContainer}>
                            <Text>ミルク</Text>
                                <TextInput
                                    //name={'milk'}
                                    keyboardType="number-pad"
                                    type={"number"}
                                    returnKeyType = {"next"}
                                    value={detailMilk}
                                    textAlign={"center"}//入力表示位置
                                    multiline
                                    style={styles.input}
                                    onChangeText={(text) => { setMilk(Number(text)); }}
                                    //autoFocus
                                    maxLength={3}
                                />
                            <Text>ml</Text>
                        </View>
                    );
                } else if (babyData.category == 'BONYU') {
                    return (
                        <View style={styles.inputTypeContainer}>
                            <Text>母乳</Text>
                            <TextInput
                                keyboardType="number-pad"
                                value={detailBonyu}
                                textAlign={"center"}//入力表示位置
                                multiline
                                style={styles.input}
                                onChangeText={(text) => { setBonyu(Number(text)); }}
                                //autoFocus
                                maxLength={3}
                            />
                            <Text>ml</Text>
                        </View>
                    );
                }
            })()}
            <View style={styles.inputContainer}>
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
        height: 50,
        backgroundColor: '#987652',
        flexDirection: 'row',
    },
    inputContainer: {
        paddingHorizontal: 27,
        paddingVertical: 10,
        height: 125,
        backgroundColor: '#859602',
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
