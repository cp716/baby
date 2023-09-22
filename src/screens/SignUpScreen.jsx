import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, } from 'react-native';
import firebase from 'firebase'

import Button from '../components/Button';
import { translateErrors } from '../utils';

export default function SignUpScreen(props) {
    const { navigation } = props;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handlePress() {
        const { currentUser } = firebase.auth();
        if (!currentUser) { return; }
        const credential = firebase.auth.EmailAuthProvider.credential(email, password);
        currentUser.linkWithCredential(credential)
            .then((userCredential) => {
                Alert.alert('登録完了', '登録したメールアドレスとパスワードは大切に保管してください。', [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Setting'}],
                        });
                        },
                        },
                ]);
            })
            .catch((error) => {
                console.log(error.code, error.massage);
                const errorMsg = translateErrors(error.code);
                Alert.alert(errorMsg.title, errorMsg.description);
            });
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.title}>会員登録</Text>
                <Text style={styles.inputText}>メールアドレス</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={(text) => { setEmail(text); }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="入力してください"
                    placeholderTextColor="#BFBFBF"
                    textContentType="emailAddress"
                />
                <Text style={styles.inputText}>メールアドレス（確認）</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={(text) => { setEmail(text); }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="入力してください"
                    placeholderTextColor="#BFBFBF"
                    textContentType="emailAddress"
                />
                <Text style={styles.inputText}>パスワード</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={(text) => { setPassword(text); }}
                    autoCapitalize="none"
                    placeholder="入力してください"
                    placeholderTextColor="#BFBFBF"
                    secureTextEntry
                    textContentType="password"
                />
                <Text style={styles.inputText}>パスワード（確認）</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={(text) => { setPassword(text); }}
                    autoCapitalize="none"
                    placeholder="入力してください"
                    placeholderTextColor="#BFBFBF"
                    secureTextEntry
                    textContentType="password"
                />
                <Button
                    label="登録"
                    onPress={handlePress}
                />
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
    inputText: {
        fontSize: 15,
        lineHeight: 32,
        //fontWeight: 'bold',
        marginBottom: 1,
        color: '#737373',
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