import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase';
import Button from '../components/Button';
import { translateErrors } from '../utils';

export default function PasswordResetRequestScreen() {
  const [email, setEmail] = useState('');

  async function handlePress() {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      Alert.alert('メール送信完了', '入力されたメールアドレスにパスワードリセットメールを送信しました。', [
        {
          text: 'OK',
          onPress: () => {
            // メール送信後の処理を追加することができます。
          },
        },
      ]);
    } catch (error) {
      console.error(error);
      const errorMsg = translateErrors(error.code);
      Alert.alert(errorMsg.title, errorMsg.description);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>パスワードリセット</Text>
        <Text style={styles.inputText}>登録したメールアドレス</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="入力してください"
          placeholderTextColor="#BFBFBF"
          textContentType="emailAddress"
        />
        <Button label="リセットメールを送信" onPress={handlePress} />
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
