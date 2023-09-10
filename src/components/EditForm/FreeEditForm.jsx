import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import storage from '../../context/Storage';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';

export default function FreeEditForm(props) {
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

    const [freeText, setFreeText] = useState(babyData.freeText);
    const [detailBody, setBodyText] = useState(babyData.bodyText);

    function handlePress() {
        const { currentUser } = firebase.auth();
        if (currentUser ) {
            const db = firebase.firestore();
            const ref = db.collection(`users/${currentUser.uid}/babyData/`).doc(babyIdData)
            .collection(`${year}_${month}`).doc(babyData.id)
            
            return (
                ref.set({
                    'category':'FREE',
                    freeText: freeText,
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
            <View style={styles.inputContainer}>
                <Text>自由入力</Text>
                <TextInput
                        keyboardType="web-search"
                        value={freeText}
                        //multiline
                        style={styles.input}
                        onChangeText={(text) => { setFreeText(text); }}
                        //autoFocus
                        placeholder = "自由項目を入力"
                />
            </View>
            <View style={styles.inputTextContainer}>
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
    inputContainer: {
        paddingHorizontal: 27,
        paddingVertical: 10,
        height: 75,
        backgroundColor: '#859602'
        //flex: 1,
    },
    inputTextContainer: {
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
