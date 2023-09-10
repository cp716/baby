import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import storage from '../context/Storage';
import Modal from "react-native-modal";

import { RadioButton, List } from 'react-native-paper';

import { useBabyContext } from '../context/BabyContext';
import { useCurrentBabyContext } from '../context/CurrentBabyContext';

export default function ModalSelectBaby2(props) {
    
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const { baby } = useBabyContext();
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();

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

    //const { toggleBabyModal } = props;
    
    const [babyIdData, setBabyIdData] = useState('');
    const [checked, setChecked] = React.useState();

    useEffect(() => {
        storage.load({
            key : 'selectbaby',
        }).then(data => {
            // 読み込み成功時処理
            setChecked(data.babyId)
        }).catch(err => {
            // 読み込み失敗時処理
            console.log(err)
        });
    }, []);

    function renderItem({ item }) {   
        return(
            <View>
                {(() => {
                    //console.log(item.selectBaby)
                    return(
                        <RadioButton.Item
                            value={item.id}
                            label={item.babyName}
                            status={checked === item.id ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setChecked(item.id)
                                currentBabyDispatch({ 
                                    type: "addBaby",
                                    babyName: item.babyName,
                                    babyBirthday: item.birthday.toDate(),
                                    babyId: item.id,
                                    //OK
                                })
                            }}
                        />
                    )
                })()}
            </View>
        )       
    } 

    return (
        <View>
            <List.Item
                title="赤ちゃん切替"
                //description="Item description"
                left={props => <List.Icon {...props} icon="baby-face-outline" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                //style={styles.listItem}
                onPress={() => { 
                    toggleModal(); 
                }}
            />
            <Modal isVisible={isModalVisible}
                onBackdropPress={toggleModal}
                backdropTransitionOutTiming={0}
                //modalレパートリー
                //"bounce" | "flash" | "jello" | "pulse" | "rotate" | "rubberBand" | "shake" | "swing" | "tada" | "wobble" | "bounceIn" | "bounceInDown" | "bounceInUp" | "bounceInLeft" | "bounceInRight" | "bounceOut" | "bounceOutDown" | "bounceOutUp" | "bounceOutLeft" | "bounceOutRight" | "fadeIn" | "fadeInDown" | "fadeInDownBig" | "fadeInUp" | "fadeInUpBig" | "fadeInLeft" | "fadeInLeftBig" | "fadeInRight" | "fadeInRightBig" | "fadeOut" | "fadeOutDown" | "fadeOutDownBig" | "fadeOutUp" | "fadeOutUpBig" | "fadeOutLeft" | "fadeOutLeftBig" | "fadeOutRight" | "fadeOutRightBig" | "flipInX" | "flipInY" | "flipOutX" | "flipOutY" | "lightSpeedIn" | "lightSpeedOut" | "slideInDown" | "slideInUp" | "slideInLeft" | "slideInRight" | "slideOutDown" | "slideOutUp" | "slideOutLeft" | "slideOutRight" | "zoomIn" | "zoomInDown" | "zoomInUp" | "zoomInLeft" | "zoomInRight" | "zoomOut" | "zoomOutDown" | "zoomOutUp" | "zoomOutLeft" | "zoomOutRight" |
                animationIn="fadeInRightBig"
                animationOut="fadeOutRightBig"
                avoidKeyboard={true}
                //swipeDirection="right"
                onSwipeComplete={toggleModal}
            >
                <View style={modalStyles.container}>
                    <View style={styles.inputTypeContainer}>
                        <FlatList
                            //inverted//反転
                            data={babyData}
                            renderItem={renderItem}
                            keyExtractor={(item) => { return item.id; }}
                        />
                    </View>
                    <TouchableOpacity style={modalStyles.confirmButton} onPress={toggleModal} >
                        <Text style={modalStyles.confirmButtonText}>close</Text>
                    </TouchableOpacity>
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
    inputTypeContainer: {
        paddingHorizontal: 27,
        paddingVertical: 10,
        //height: 50,
        //backgroundColor: '#987652',
        //flex: 1,
        //flexDirection: 'row',
        //width: 350 ,
        //flex:1
        height: 300,
    },
    radioButton: {
        //flexDirection: 'row',
        //paddingLeft: 'auto',
        //paddingRight: 'auto',
        //marginLeft: 'auto',
        //marginRight: 'auto',
        //justifyContent: 'space-around',//横並び均等配置
        //flexgrow: 1,
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

const modalStylessssss = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    inputTypeContainer: {
        paddingHorizontal: 27,
        paddingVertical: 10,
        //height: 50,
        //backgroundColor: '#987652',
        //flex: 1,
        //flexDirection: 'row',
        //width: 350 ,
        //flex:1
        height: 300,
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
    container : {
        backgroundColor : '#FFF',
        padding : '5%',
        borderColor : '#36C1A7',
        borderWidth : 3,
        borderRadius : 20,
    },
    title : {
        color : '#36C1A7',
        fontWeight : 'bold',
        textAlign: 'center'
    },
    //arrow : {
        //color : '#36C1A7',
    //},
});