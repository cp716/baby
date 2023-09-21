import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firebase from 'firebase';

import Button from '../components/Button';
import Loading from '../components/Loading';
import { translateErrors } from '../utils';

export default function PasswordChangeScreen(props) {
    const { navigation } = props;
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setLoading] = useState(false);

    async function handlePress() {
        setLoading(true);

        const user = firebase.auth().currentUser;
        
        // 現在のパスワードでユーザーを再認証
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
        
        try {
            await user.reauthenticateWithCredential(credential);
            
            // 新しいパスワードと確認用のパスワードが一致しない場合、エラーを表示
            if (newPassword !== confirmPassword) {
                Alert.alert('エラー', '新しいパスワードと確認用のパスワードが一致しません。');
                setLoading(false);
                return;
            }

            // パスワードの変更を試行
            await user.updatePassword(newPassword);

            Alert.alert('成功', 'パスワードが変更されました。', [
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
        } catch (error) {
            // パスワードが間違っている場合のエラーメッセージを設定
            const errorMsg = error.code === 'auth/wrong-password' ? '現在のパスワードが間違っています。' : translateErrors(error.code);
            Alert.alert('エラー', errorMsg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Loading isLoading={isLoading} />
            <View style={styles.inner}>
                <Text style={styles.title}>パスワード変更</Text>
                <Text style={styles.inputText}>現在のパスワード</Text>
                <TextInput
                    style={styles.input}
                    value={currentPassword}
                    onChangeText={(text) => { setCurrentPassword(text); }}
                    autoCapitalize="none"
                    placeholder="現在のパスワードを入力"
                    placeholderTextColor="#BFBFBF"
                    secureTextEntry
                    textContentType="password"
                />
                <Text style={styles.inputText}>新しいパスワード</Text>
                <TextInput
                    style={styles.input}
                    value={newPassword}
                    onChangeText={(text) => { setNewPassword(text); }}
                    autoCapitalize="none"
                    placeholder="新しいパスワードを入力"
                    placeholderTextColor="#BFBFBF"
                    secureTextEntry
                    textContentType="password"
                />
                <Text style={styles.inputText}>新しいパスワード（確認）</Text>
                <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={(text) => { setConfirmPassword(text); }}
                    autoCapitalize="none"
                    placeholder="新しいパスワードを再入力"
                    placeholderTextColor="#BFBFBF"
                    secureTextEntry
                    textContentType="password"
                />
                <Button
                    label="確認"
                    onPress={handlePress}
                />
                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => { navigation.goBack(); }}>
                        <Text style={styles.footerLink}>キャンセル</Text>
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
