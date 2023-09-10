import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, } from 'react-native';
import firebase from 'firebase'
import storage from '../context/Storage';

import DrawerButton from '../components/DrawerButton';
import Button from '../components/Button';
import { translateErrors } from '../utils';

export default function SignUpScreen(props) {

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <DrawerButton />,
        });
    }, []);

    const { navigation } = props;
    const [email, setEmail] = useState('');
    

    const actionCodeSettings = {
        url: "https://babyapp9999.page.link/test",
        handleCodeInApp: true,
        iOS: {
            //bundleId: DeviceInfo.getBundleId()
            installApp: true,
        },
        android: {
            //packageName: DeviceInfo.getBundleId(),
        },
        dynamicLinkDomain: "babyApp9999.page.link"
        }
        
        //会員登録ボタンがタップされたあとの処理
        const _onPressSignUpButton = () => {
        firebase.auth()
            .sendSignInLinkToEmail(email, actionCodeSettings)
            .then(() => {
            //AsyncStorage.setItem('key_mail_address', email)
            storage.save({
                key: 'keyMailAddress',
                data: {
                    email : email,
                },
            })
            Alert.alert('登録メールを送信しました', 'メール内のリンクを開き、登録を完了させてください。', [{ text: 'OK' }], { cancelable: false })
        })
        .catch(error => {
            let dialogText = '入力をやりなおしてください'
            if (error.code === 'auth/invalid-email') {
            dialogText = '許可されていないアドレスです'
        }
        console.log(error.code)
        Alert.alert('処理に失敗しました', dialogText + error.code, [{ text: 'OK' }], { cancelable: false })
        });
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.title}>会員登録</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={(text) => { setEmail(text); }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="メールアドレス"
                    textContentType="emailAddress"
                />
                <Button
                    label="送信"
                    onPress={() => _onPressSignUpButton()}
                />
                <View style={styles.footer}>
                    <Text style={styles.footerText}>ログインは</Text>
                    <TouchableOpacity onPress={() => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Acount' }],
                        }); 
                    }}>
                        <Text style={styles.footerLink}>こちら</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8',
    },
    inner: {
        paddingHorizontal: 27,
        paddingVertical: 24,
    },
    title: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: 'bold',
        marginBottom: 24,
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
    footerText: {
        fontSize: 14,
        lineHeight: 24,
        marginRight: 8,
    },
    footerLink: {
        fontSize: 14,
        lineHeight: 24,
        color: '#467FD3',
    },
    footer: {
        flexDirection: 'row'
    },
});