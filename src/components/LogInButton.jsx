import React, { useState }  from 'react';
import { Button, View, StyleSheet, Text, TextInput } from "react-native";
import firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';
//import Loading from './Loading';
import Modal from "react-native-modal";
import { List } from 'react-native-paper';
import { useUserContext } from '../context/UserContext';

export default function LogInButton(props) {
    const navigation = useNavigation();
    //const [isLoading, setLoading] = useState(false);

    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user } = useUserContext();

    function handlePress() {
        //setLoading(true);
        const deleteUser = user;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredentail) => {
            
            const { user } = userCredentail;
            console.log(user.uid);
            navigation.navigate('メイン')
            navigation.reset({
                index: 0,
                routes: [{ name: 'Setting'}],
            });
            //navigation.jumpTo('CenterTab');
            //navigation.jumpTo('CenterTab', { owner: 'Michaś' });
            deleteUser.delete();
        })
        .catch((error) => {
            const errorMsg = translateErrors(error.code);
            Alert.alert(errorMsg.title, errorMsg.description);
        })
        .then(() => {
            //setLoading(false);
        });
    }

    return (
        <View style={styles.container}>
            <List.Item
                title="ログイン"
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
                <Text style={styles.title}>ログイン</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={(text) => { setEmail(text); }}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholder="メールアドレス"
                        textContentType="emailAddress"
                    />
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={(text) => { setPassword(text); }}
                        autoCapitalize="none"
                        placeholder="パスワード"
                        secureTextEntry
                        textContentType="password"
                    />
                    <Button
                        title="ログイン"
                        onPress={handlePress}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        backgroundColor: '#F0F4F8',
    },
    inner: {
        paddingHorizontal: 27,
        paddingVertical: 24,
    },
    LogOutButton: {
        //flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    label: {
        fontSize: 14,
        color: 'rgba(103, 103, 103, 0.7)',
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