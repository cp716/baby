import React, { useState } from "react";
import { Button, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { List } from 'react-native-paper';
import BabyEditForm from "./BabyEditForm";

export default function BabyEditButton(props) {
    const { navigation } = props;

    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <View>
            <List.Item
                title="赤ちゃん編集"
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
                swipeDirection="right"
                onSwipeComplete={toggleModal}
                >
                <View style={modalStyles.container}>
                    <Text style={modalStyles.title}>赤ちゃん情報更新</Text>
                    <View>
                        <BabyEditForm toggleModal={toggleModal} navigation={navigation}/>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    babyAddButtonText: {
        //width: '40%',
        //marginTop: '5%',
        //marginLeft: '5%',
        //padding: 5,
        fontSize: 15,
        //textAlign: 'center',
    },
    babyAddButton: {
        backgroundColor: '#FFDB59',
        width: 150,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        //position: 'absolute',
        //left: 20,
        //top: 100,
        shadowColor: '#000000',//ios
        shadowOffset: { width: 0, height: 8 },//ios
        shadowOpacity: 0.25,//ios
        shadowRadius: 8,//ios
        elevation: 8,//Android
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