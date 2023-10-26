import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase';

import Button from '../components/Button';
import { translateErrors } from '../utils';

export default function SignUpScreen(props) {
    const { navigation } = props;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    function handlePress() {
        const user = firebase.auth().currentUser; // Get the current user (anonymous user)

        if (!user) {
            return;
        }

        if (email !== confirmEmail) {
            Alert.alert('エラー', 'メールアドレスと確認用のメールアドレスが一致しません。');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('エラー', 'パスワードと確認用のパスワードが一致しません。');
            return;
        }

        // Firebaseにメールアドレスとパスワードでユーザー登録
        firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
        // 新規ユーザー作成成功時の処理
        // ユーザー登録が成功したら認証メールを送信
        const newUser = firebase.auth().currentUser; // 新しいユーザーを取得
        newUser
            .sendEmailVerification()
            .then(() => {
                // 認証メールを送信した後にログイン
                firebase
                    .auth()
                    .signInWithEmailAndPassword(email, password)
                    .then(() => {
                        // ログインに成功したら古い匿名ユーザーを削除
                        user.delete()
                            .then(() => {
                                Alert.alert('登録完了', 'メールアドレス確認メールを送信しました。メールをご確認ください。', [
                                    {
                                        text: 'OK',
                                        onPress: () => {
                                            navigation.reset({
                                                index: 0,
                                                routes: [{ name: 'Setting' }],
                                            });
                                        },
                                    },
                                ]);
                            })
                            .catch((deleteError) => {
                                console.log(deleteError);
                            });
                    })
                    .catch((loginError) => {
                        console.log(loginError);
                        const errorMsg = translateErrors(loginError.code);
                        Alert.alert(errorMsg.title, errorMsg.description);
                    });
            })
            .catch((error) => {
                console.log(error);
                const errorMsg = translateErrors(error.code);
                Alert.alert(errorMsg.title, errorMsg.description);
            });
    })
    .catch((error) => {
        console.log(error);
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
                    onChangeText={(text) => {
                        setEmail(text);
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="入力してください"
                    placeholderTextColor="#BFBFBF"
                    textContentType="emailAddress"
                />
                <Text style={styles.inputText}>メールアドレス（確認）</Text>
                <TextInput
                    style={styles.input}
                    value={confirmEmail}
                    onChangeText={(text) => {
                        setConfirmEmail(text);
                    }}
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
                    onChangeText={(text) => {
                        setPassword(text);
                    }}
                    autoCapitalize="none"
                    placeholder="入力してください"
                    placeholderTextColor="#BFBFBF"
                    secureTextEntry
                    textContentType="password"
                />
                <Text style={styles.inputText}>パスワード（確認）</Text>
                <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={(text) => {
                        setConfirmPassword(text);
                    }}
                    autoCapitalize="none"
                    placeholder="入力してください"
                    placeholderTextColor="#BFBFBF"
                    secureTextEntry
                    textContentType="password"
                />
                <Button label="登録" onPress={handlePress} />
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
});
