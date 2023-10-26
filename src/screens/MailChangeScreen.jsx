import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase';

import Button from '../components/Button';
import Loading from '../components/Loading';
import { translateErrors } from '../utils';

export default function MailChangeScreen(props) {
    const { navigation } = props;
    const [newEmail, setNewEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [isLoading, setLoading] = useState(false);
    const currentUser = firebase.auth().currentUser;

    function handlePress() {
        if (newEmail === confirmEmail) {
            if (newEmail === currentUser.email) {
                Alert.alert('現在登録されているメールアドレスと新しく入力されたメールアドレスが同じです。');
            } else {
                setLoading(true);

                // 新しいメールアドレスに変更する処理を実行
                currentUser
                    .updateEmail(currentUser, newEmail)
                    .then(() => {
                        // メールアドレスの変更が成功したら、確認メールを送信
                        currentUser
                            .sendEmailVerification()
                            .then(() => {
                                setLoading(false);
                                Alert.alert(
                                    'メールアドレスが変更されました',
                                    '確認メールをご確認ください。メール内のリンクをクリックして変更を完了してください。',
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () => {
                                                navigation.reset({
                                                    index: 0,
                                                    routes: [{ name: 'Setting' }],
                                                });
                                            },
                                        },
                                    ]
                                );
                            })
                            .catch((error) => {
                                setLoading(false);
                                console.log(error);
                                const errorMsg = translateErrors(error.code);
                                Alert.alert(errorMsg.title, errorMsg.description);
                            });
                    })
                    .catch((error) => {
                        setLoading(false);
                        console.log(error);
                        const errorMsg = translateErrors(error.code);
                        Alert.alert(errorMsg.title, errorMsg.description);
                    });
            }
        } else {
            Alert.alert('エラー', '新しいメールアドレスと確認用メールアドレスが一致しません。');
        }
    }

    return (
        <View style={styles.container}>
            <Loading isLoading={isLoading} />
            <View style={styles.inner}>
                <Text style={styles.title}>メールアドレス変更</Text>
                <Text style={styles.inputText}>新しいメールアドレス</Text>
                <TextInput
                    style={styles.input}
                    value={newEmail}
                    onChangeText={(text) => {
                        setNewEmail(text);
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="入力してください"
                    placeholderTextColor="#BFBFBF"
                    textContentType="emailAddress"
                />
                <Text style={styles.inputText}>新しいメールアドレス（確認）</Text>
                <TextInput
                    style={styles.input}
                    value={confirmEmail}
                    onChangeText={(text) => {
                        setConfirmEmail(text);
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="再度入力してください"
                    placeholderTextColor="#BFBFBF"
                    textContentType="emailAddress"
                />
                <Button label="確認" onPress={handlePress} />
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
