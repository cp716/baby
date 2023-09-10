import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, } from 'react-native';
import firebase from 'firebase';

import Button from '../components/Button';
import Loading from '../components/Loading';
import LogOutButton from '../components/LogOutButton';
import { translateErrors } from '../utils';

import { useUserContext } from '../context/UserContext';

export default function AcountScreen(props) {
    const { user } = useUserContext();
    
    const { navigation } = props;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const [isLoading, setLoading] = useState(true);
    const [isLoading, setLoading] = useState(false);

    function handlePress() {
        setLoading(true);
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
            setLoading(false);
        });
    }

    if(user) {
        if(user.isAnonymous) {
            return (
                <View style={styles.container}>
                    <Loading isLoading={isLoading} />
                    <View style={styles.inner}>
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
                            label="ログイン"
                            onPress={handlePress}
                        />
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>会員登録は</Text>
                            <TouchableOpacity onPress={() => { navigation.reset({
                                index: 0,
                                routes: [{ name: 'SignUp'}],
                            }); }}>
                                <Text style={styles.footerLink}>こちら</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.inner}>
                        <Text style={styles.title}>アカウント</Text>
                        <Text>ログインアカウント</Text>
                        <Text>{user.email}</Text>
                        <LogOutButton />
                    </View>
                </View>
            );
        }
    }
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