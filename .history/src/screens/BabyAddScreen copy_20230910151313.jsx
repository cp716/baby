import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, } from 'react-native';
import firebase from 'firebase';

import Button from '../components/Button';
import Loading from '../components/Loading';
import { translateErrors } from '../utils';

export default function BabyAddScreen(props) {
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
            <View style={styles.inner}>
                <Text style={styles.title}>赤ちゃん登録</Text>
                <Text style={styles.inputText}>名前</Text>
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
                <Text style={styles.inputText}>誕生日</Text>
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
    inputText: {
        fontSize: 15,
        lineHeight: 32,
        //fontWeight: 'bold',
        marginBottom: 1,
        color: '#737373',
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
        marginBottom: 20,
    },
});