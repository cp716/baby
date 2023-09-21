import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/auth';
import DrawerButton from '../components/DrawerButton';
import Button from '../components/Button';
import { translateErrors } from '../utils';

export default function SignUpScreen(props) {
  const { navigation } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
    });
  }, []);

  async function sendEmailVerification() {
    try {
      // メールアドレス宛に確認メールを送信
      await firebase.auth().currentUser.sendEmailVerification({
        email: email, // 入力されたメールアドレスを使用
        url: 'https://example.com/confirm', // リンクのリダイレクト先URLを指定
      });

      Alert.alert('確認メールを送信しました', 'メール内のリンクをクリックして登録を完了してください。', [
        {
          text: 'OK',
          onPress: () => {
            // メール送信後の処理
            // 例えば、アラートを表示するか、ホーム画面に遷移するかを実装
          },
        },
      ]);
    } catch (error) {
      console.error(error);
      const errorMsg = translateErrors(error.code);
      Alert.alert(errorMsg.title, errorMsg.description);
    }
  }

  async function handleEmailVerification() {
    try {
      // メール内の確認リンクをクリックした際に、新しいメールアドレスとパスワードを使用してアカウントを作成
      await firebase.auth().createUserWithEmailAndPassword(email, password);

      // メール送信後の処理
      // 例えば、アラートを表示するか、ホーム画面に遷移するかを実装

    } catch (error) {
      console.error(error);
      const errorMsg = translateErrors(error.code);
      Alert.alert(errorMsg.title, errorMsg.description);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>会員登録</Text>
        <Text style={styles.inputText}>メールアドレス</Text>
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
        <Text style={styles.inputText}>パスワード</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          autoCapitalize="none"
          secureTextEntry
          placeholder="入力してください"
          placeholderTextColor="#BFBFBF"
          textContentType="password"
        />
        <Button label="確認メールを送信" onPress={sendEmailVerification} />
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
  inputText: {
    color: '#BFBFBF',
    fontSize: 16,
    lineHeight: 24,
  },
});
