import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, } from 'react-native';
import firebase from 'firebase';

import Button from '../components/Button';
import Loading from '../components/Loading';
import { translateErrors } from '../utils';

export default function LogInScreen(props) {
    const { navigation } = props;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const [isLoading, setLoading] = useState(true);
    const [isLoading, setLoading] = useState(false);

    function handlePress() {
        setLoading(true);
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredentail) => {
            const { user } = userCredentail;
            console.log(user.uid);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Setting'}],
            });
        })
        .catch((error) => {
            const errorMsg = translateErrors(error.code);
            Alert.alert(errorMsg.title, errorMsg.description);
        })
        .then(() => {
            setLoading(false);
        });   
    }

    return (
        <View style={styles.container}>
            <Loading isLoading={isLoading} />
            <Text style={styles.title}>ログイン</Text>
            <View style={styles.inputArea}>
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
            </View>
            <Button
                label="ログイン"
                onPress={handlePress}
            />
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => { navigation.reset({
                    index: 0,
                    routes: [{ name: 'SignUp'}],
                }); }}>
                    <Text style={styles.footerLink}>会員登録はこちら</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
    },
    inputArea: {
        width: '100%',
        backgroundColor: '#456845',
        padding: 20,
    },
    inputText: {
        fontSize: 15,
        lineHeight: 32,
        //fontWeight: 'bold',
        marginBottom: 1,
        color: '#737373',
        textAlign: 'left',
    },
    input: {
        fontSize: 16,
        height: 48,
        width: '90%',
        borderColor: '#DDDDDD',
        borderWidth: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 8,
        marginBottom: 20,
    },
    footerLink: {
        fontSize: 16,
        lineHeight: 24,
        color: '#467FD3',
    },
    footer: {
        marginTop: 50,
        marginRight: 'auto',
        marginLeft: 'auto',
        flexDirection: 'row'
    },
});