import React, { useState } from "react";
import { Button, View, StyleSheet, Text, TextInput } from "react-native";
import Modal from "react-native-modal";
import { List } from 'react-native-paper';

export default function EmailChange(props) {

    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const [email1, setEmail1] = useState('');
    const [email2, setEmail2] = useState('');

    function handlePress() {
        
    }

    return (
        <View>
            <List.Item
                title="メールアドレス変更"
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
                    <Text style={modalStyles.title}>メールアドレス変更</Text>
                    <TextInput
                        style={styles.input}
                        value={email1}
                        onChangeText={(text) => { setEmail1(text); }}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholder="新規メールアドレス"
                        textContentType="emailAddress"
                    />
                    <TextInput
                        style={styles.input}
                        value={email2}
                        onChangeText={(text) => { setEmail2(text); }}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholder="確認メールアドレス"
                        textContentType="emailAddress"
                    />
                    <Button
                        title="確認"
                        onPress={handlePress}
                    />
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
    input: {
        fontSize: 16,
        height: 48,
        borderColor: '#DDDDDD',
        borderWidth: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 8,
        marginBottom: 16,
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