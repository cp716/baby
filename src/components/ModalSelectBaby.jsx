import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import firebase from 'firebase';
import Modal from "react-native-modal";

import CircleButton from './CircleButton';
import { RadioButton } from 'react-native-paper';

import { useBabyContext } from '../context/BabyContext';

export default function ModalSelectBaby(props) {

    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const { baby } = useBabyContext();
    const { currentBaby } = useBabyContext();

    const babyData = [];
    if(baby !== "") {
        baby.forEach((doc) => {
            const data = doc.data();
            babyData.push({
                id: doc.id,
                babyName: data.babyName,
                birthday: data.birthday,
            });
        });
    }

    const [babyIdData, setBabyIdData] = useState(null);
    const { toggleBabyModal } = props;
    const [checked, setChecked] = React.useState(babyIdData);

    useEffect(() => {
        const currentBabyData = [];
        if(currentBaby !== "") {
            currentBaby.forEach((doc) => {
                const data = doc.data();
                setBabyIdData(data.babyId)
                //setBabyNameData(data.babyName)
                //setBabyBirthdayData(data.birthday)
                setChecked(data.babyId);
            });
        }
    }, [currentBaby]);
    
    function renderItem({ item }) {

        const date = new Date(item.birthday.seconds * 1000 + item.birthday.nanoseconds / 1000000);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        
        return(
            <View>
                {(() => {
                    return(
                        <RadioButton.Item
                            value={item.id}
                            label={item.babyName + '\n誕生日:' + year + '年' + (month + 1) + '月' + day + '日'}
                            status={checked === item.id ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setChecked(item.id)
                                const db = firebase.firestore();
                                const { currentUser } = firebase.auth();
                                const ref1 = db.collection(`users/${currentUser.uid}/currentBaby`)
                                ref1.get()
                                .then((querySnapshot) => {
                                    querySnapshot.forEach((doc) => {
                                        if (doc.exists) {
                                            // currentBaby上書き
                                            const db = firebase.firestore();
                                            const { currentUser } = firebase.auth();
                                            const ref2 = db.collection(`users/${currentUser.uid}/currentBaby`).doc(doc.id)
                                            ref2.set({
                                                babyName: item.babyName,
                                                birthday: item.birthday.toDate(),
                                                babyId: item.id,
                                            })
                                        }
                                    });
                                })
                            }}
                        />
                    )
                })()}
            </View>
        )       
    } 

    const ItemSeparator = () => (
        <View style={styles.separator} />
    );

    return (
        <View>
            <CircleButton
                name="baby-face-outline"
                onPress={() => {
                    toggleModal();
                }}
            />
            <Modal isVisible={isModalVisible}
                onBackdropPress={toggleModal}
                backdropTransitionOutTiming={0}
                //modalレパートリー
                //"bounce" | "flash" | "jello" | "pulse" | "rotate" | "rubberBand" | "shake" | "swing" | "tada" | "wobble" | "bounceIn" | "bounceInDown" | "bounceInUp" | "bounceInLeft" | "bounceInRight" | "bounceOut" | "bounceOutDown" | "bounceOutUp" | "bounceOutLeft" | "bounceOutRight" | "fadeIn" | "fadeInDown" | "fadeInDownBig" | "fadeInUp" | "fadeInUpBig" | "fadeInLeft" | "fadeInLeftBig" | "fadeInRight" | "fadeInRightBig" | "fadeOut" | "fadeOutDown" | "fadeOutDownBig" | "fadeOutUp" | "fadeOutUpBig" | "fadeOutLeft" | "fadeOutLeftBig" | "fadeOutRight" | "fadeOutRightBig" | "flipInX" | "flipInY" | "flipOutX" | "flipOutY" | "lightSpeedIn" | "lightSpeedOut" | "slideInDown" | "slideInUp" | "slideInLeft" | "slideInRight" | "slideOutDown" | "slideOutUp" | "slideOutLeft" | "slideOutRight" | "zoomIn" | "zoomInDown" | "zoomInUp" | "zoomInLeft" | "zoomInRight" | "zoomOut" | "zoomOutDown" | "zoomOutUp" | "zoomOutLeft" | "zoomOutRight" |
                animationIn="fadeInUpBig"
                animationOut="fadeOutDownBig"
                avoidKeyboard={true}
                //swipeDirection="down"
                //onSwipeComplete={toggleModal}
            >
                <View style={modalStyles.container}>
                        <Text style={modalStyles.title}>表示中の赤ちゃんを変更</Text>
                        <View style={styles.inputTypeContainer}>
                        <FlatList
                            //inverted//反転
                            data={babyData}
                            renderItem={renderItem}
                            keyExtractor={(item) => { return item.id; }}
                            ItemSeparatorComponent={ItemSeparator}
                        />
                        </View>
                        <View>
                            <TouchableOpacity style={modalStyles.confirmButton} onPress={toggleModal} >
                                <Text style={modalStyles.confirmButtonText}>閉じる</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.advertisement}>
                            <Image style={{width: '100%'}}
                                resizeMode='contain'
                                source={require('../img/IMG_3641.jpg')}
                            />
                        </View>
                    </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor : '#FFF',
        padding : '5%',
        borderColor : '#36C1A7',
        borderWidth : 3,
        borderRadius : 20,
    },
    inputTypeContainer: {
        paddingHorizontal: 27,
        paddingVertical: 10,
        //height: 50,
        //maxHeight: '50%',
        //flex: 1,
        backgroundColor: '#FFF',
        //flexDirection: 'row',
        //width: 350 ,
        //flex:1
        //height: 300,
        padding : '5%',
        borderColor : '#737373',
        borderWidth : 1,
        borderRadius : 10,
    },
    separator: {
        height: 1,
        backgroundColor: '#737373',
    },
    advertisement: {
        //marginTop: 'auto',
        //marginBottom: 'auto',
        //paddingTop: 10,
        //paddingBottom: 10,
        //height: '15%',
        //width: '50%',
        //alignItems:'center',
        //backgroundColor: '#464876',
        //marginBottom: 10,
    },
});

const modalStyles = StyleSheet.create({
    modalButton : {
        backgroundColor : '#FFF',
        borderColor : '#36C1A7',
        borderWidth : 1,
        borderRadius : 10,
    },
    modalButtonText : {
        color : '#36C1A7',
        fontWeight : 'bold',
        textAlign : 'center',
        padding: 10,
        fontSize: 20,
    },
    container : {
        backgroundColor : '#FFF',
        padding : '5%',
        borderColor : '#36C1A7',
        borderWidth : 3,
        borderRadius : 10,
    },
    title : {
        color : '#737373',
        fontWeight : 'bold',
        textAlign: 'center',
        fontSize: 20,
        marginBottom: '5%',
    },
    //arrow : {
        //color : '#36C1A7',
    //},
    confirmButton : {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop : '5%',
        marginBottom: '5%',
        backgroundColor : '#FFDB59',
        borderColor : '#737373',
        borderWidth : 1,
        borderRadius : 10,
        width: "40%",
    },
    confirmButtonText : {
        color : '#737373',
        fontWeight : 'bold',
        textAlign : 'center',
        padding: 10,
        fontSize: 16,
    },
});
