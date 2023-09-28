import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';
import firebase from 'firebase';
import { useCurrentBabyContext } from '../../context/CurrentBabyContext';

import { CheckBox } from 'react-native-elements'

export default function DiseaseInputForm(props) {
    const { selectTime } = props;
    const { toggleModal } = props;

    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();

    const date = new Date(selectTime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const [bodyTemperature, setBodyTemperature] = useState('');
    const [bodyText, setBodyText] = useState('');
    const [hanamizu, setHanamizu] = useState(false);
    const [seki, setSeki] = useState(false);
    const [oto, setOto] = useState(false);
    const [hosshin, setHosshin] = useState(false);
    const [kega, setKega] = useState(false);
    const [kusuri, setKusuri] = useState(false);

    function handlePress() {
        const db = firebase.firestore();
        const { currentUser } = firebase.auth();
        const ref = db.collection(`users/${currentUser.uid}/babyData`).doc(currentBabyState.id.toString())
        .collection(`${year}_${month}`)    
        if( hanamizu || seki || oto || hosshin || kega || kusuri || bodyTemperature) {
            if(bodyTemperature >= 32 && bodyTemperature <= 43 || bodyTemperature == '') {
                ref.add({
                    'category':'DISEASE',
                    updatedAt: selectTime,
                    day: day,
                    bodyText,
                    disease: {
                        hanamizu: hanamizu,
                        seki: seki,
                        oto: oto,
                        hosshin: hosshin,
                        kega: kega,
                        kusuri: kusuri,
                        bodyTemperature: parseFloat(bodyTemperature),
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
                Alert.alert("32から43までで入力してください");
            }
        } else {
            Alert.alert("未入力です");
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
                        value={bodyTemperature}
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