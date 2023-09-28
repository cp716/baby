import React, { useState } from 'react';
import firebase from 'firebase';
import { useCurrentBabyContext } from '../../context/CurrentBabyContext';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';
import { CheckBox } from 'react-native-elements'

export default function DiseaseEditForm(props) {
    const { selectTime } = props;
    const { babyData } = props;
    const { toggleModal } = props;

    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();

    const year = selectTime.getFullYear();
    const month = selectTime.getMonth() + 1;
    const day = selectTime.getDate();

    const [hanamizu, setHanamizu] = useState(babyData.disease.hanamizu);
    const [seki, setSeki] = useState(babyData.disease.seki);
    const [oto, setOto] = useState(babyData.disease.oto);
    const [hosshin, setHosshin] = useState(babyData.disease.hosshin);
    const [kega, setKega] = useState(babyData.disease.kega);
    const [kusuri, setKusuri] = useState(babyData.disease.kusuri);
    const [bodyTemperature, setBodyTemperature] = useState(babyData.disease.bodyTemperature);
    const [detailBody, setBodyText] = useState(babyData.bodyText);

    if(isNaN(bodyTemperature)) {
        setBodyTemperature('')
    }

    function handlePress() {
        const { currentUser } = firebase.auth();
        if (currentUser ) {
            const db = firebase.firestore();
            const ref = db.collection(`users/${currentUser.uid}/babyData/`).doc(currentBabyState.id.toString())
            .collection(`${year}_${month}`).doc(babyData.id)
            
            if( hanamizu || seki || oto || hosshin || kega || kusuri || bodyTemperature) {
                if( bodyTemperature >= 32 && bodyTemperature <= 43 || bodyTemperature == '' ) {
                    return (
                        ref.set({
                            'category':'DISEASE',
                            bodyText: detailBody,
                            updatedAt: selectTime,
                            disease: {
                                hanamizu: hanamizu,
                                seki: seki,
                                oto: oto,
                                hosshin: hosshin,
                                kega: kega,
                                kusuri: kusuri,
                                bodyTemperature: parseFloat(bodyTemperature)
                            },
                        }, { merge: true })
                        .then(() => {
                            toggleModal()
                        })
                        .catch((error) => {
                            Alert.alert(error.code);
                        })
                    );
                } else {
                    Alert.alert("32から43までで入力してください");
                }
            } else {
                Alert.alert("未入力です");
            }
        }
    }

    function deleteItem() {
        const { currentUser } = firebase.auth();
        if(currentUser) {
            const db = firebase.firestore();
            const ref = db.collection(`users/${currentUser.uid}/babyData/`).doc(currentBabyState.id.toString())
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
            <View style={styles.radioButtonContainer}>
                <View style={styles.radioButton}>
                    <CheckBox
                        title='鼻水'
                        checked={hanamizu}
                        onPress={() => setHanamizu(!hanamizu)}
                    />
                    <CheckBox
                        title='咳'
                        checked={seki}
                        onPress={() => setSeki(!seki)}
                    />
                    <CheckBox
                        title='嘔吐'
                        checked={oto}
                        onPress={() => setOto(!oto)}
                    />
                </View>
                <View style={styles.radioButton}>
                    <CheckBox
                        title='発疹'
                        checked={hosshin}
                        onPress={() => setHosshin(!hosshin)}
                    />
                    <CheckBox
                        title='怪我'
                        checked={kega}
                        onPress={() => setKega(!kega)}
                    />
                    <CheckBox
                        title='薬'
                        checked={kusuri}
                        onPress={() => setKusuri(!kusuri)}
                    />
                </View>
            </View>
            <View style={styles.inputContainer}>
            <Text>体温</Text>
                <TextInput
                        keyboardType="decimal-pad"
                        value={String(bodyTemperature)}
                        style={styles.input}
                        onChangeText={(text) => { setBodyTemperature(text); }}
                        //autoFocus
                        placeholder = "体温を入力"
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
    radioButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',//横並び均等配置
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
