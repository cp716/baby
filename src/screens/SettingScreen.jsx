import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { List, IconButton } from 'react-native-paper';
import firebase from 'firebase';

import { useBabyContext } from '../context/BabyContext';
import LogOutButton from '../components/LogOutButton';

export default function SettingScreen(props) {
    const { navigation } = props;
    const [user, setUser] = useState();
    const [emailVerification, setEmailVerification] = useState();
    const { babyState, babyDispatch } = useBabyContext();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: '設定',
            headerTitleStyle: {
                //fontFamily: 'San Francisco',
                fontSize: 20, // フォントサイズを調整できます
                color: 'black', // テキストの色をカスタマイズ
            },
        });
    }, []);

    useEffect(() => {
        setUser();
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                if(user.email) {
                    setUser(true);
                } else {
                    setUser(false);
                }
                if (user.emailVerified) {
                    setEmailVerification(true)
                    console.log('メールアドレスは認証済みです。');
                } else {
                    setEmailVerification(false)
                    console.log('メールアドレスは未認証です。');
                }
            }
            
        });
        return unsubscribe;
    }, []);


    if (user) {
        return (
            <View style={styles.container}>
                <List.Section>
                    <List.Subheader style={styles.listSubheader}>
                        <Text>アカウント</Text>
                        {emailVerification !== null ? (emailVerification ? <Text>(認証済)</Text> : <Text>(未認証)</Text>) : null}
                    </List.Subheader>
                    <List.Item
                        title={emailVerification !== null ? (emailVerification ? <Text>メールアドレス変更</Text> : <Text>メールアドレス認証</Text>) : null}
                        //description="Item description"
                        left={props => <List.Icon {...props} icon="account-outline" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        style={styles.listItem}
                        onPress={() => { navigation.navigate('MailChange'); }}
                    />
                    <List.Item
                        title="パスワード変更"
                        //description="Item description"
                        left={props => <List.Icon {...props} icon="account-outline" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        style={styles.listItem}
                        onPress={() => { navigation.navigate('PasswordChange'); }}
                    />
                </List.Section>
                <List.Section>
                    <List.Subheader style={styles.listSubheader}>赤ちゃん</List.Subheader>
                    <List.Item
                        title="赤ちゃん一覧"
                        //description="Item description"
                        left={props => <List.Icon {...props} icon="baby-face-outline" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        style={styles.listItem}
                        onPress={() => { navigation.navigate('BabyList'); }}
                    />
                    <List.Item
                        title="赤ちゃん登録"
                        //description="Item description"
                        left={props => <List.Icon {...props} icon="baby-face-outline" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        style={styles.listItem}
                        onPress={() => { navigation.navigate('BabyAdd'); }}
                    />
                </List.Section>
                <List.Section>
                    <List.Subheader style={styles.listSubheader}>その他</List.Subheader>
                    <List.Item
                        title="バックアップ"
                        //description="Item description"
                        left={props => <List.Icon {...props} icon="penguin" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        style={styles.listItem}
                        onPress={() => { navigation.navigate('Backup'); }}
                    />
                    <List.Item
                        title="お問い合わせ"
                        //description="Item description"
                        left={props => <List.Icon {...props} icon="penguin" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        style={styles.listItem}
                        onPress={() => { navigation.navigate('ContactForm'); }}
                    />
                    <List.Item
                        title="テスト"
                        //description="Item description"
                        left={props => <List.Icon {...props} icon="penguin" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        style={styles.listItem}
                        onPress={() => { navigation.navigate('Test'); }}
                    />
                    <LogOutButton />
                </List.Section>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <List.Section>
                <List.Subheader style={styles.listSubheader}>アカウント</List.Subheader>
                
            </List.Section>
            <List.Section>
                <List.Subheader style={styles.listSubheader}>その他</List.Subheader>
                <List.Item
                    title="赤ちゃん一覧"
                    //description="Item description"
                    left={props => <List.Icon {...props} icon="baby-face-outline" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    style={styles.listItem}
                    onPress={() => { navigation.navigate('BabyList'); }}
                />
                <List.Item
                    title="赤ちゃん登録"
                    //description="Item description"
                    left={props => <List.Icon {...props} icon="baby-face-outline" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    style={styles.listItem}
                    onPress={() => { navigation.navigate('BabyAdd'); }}
                />
                <List.Item
                    title="お問い合わせ"
                    //description="Item description"
                    left={props => <List.Icon {...props} icon="penguin" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    style={styles.listItem}
                    onPress={() => { navigation.navigate('ContactForm'); }}
                />
                <List.Item
                    title="会員登録"
                    //description="Item description"
                    left={props => <List.Icon {...props} icon="penguin" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    style={styles.listItem}
                    onPress={() => { navigation.navigate('SignUp'); }}
                />
                <List.Item
                    title="ログイン"
                    //description="Item description"
                    left={props => <List.Icon {...props} icon="penguin" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    style={styles.listItem}
                    onPress={() => { navigation.navigate('LogIn'); }}
                />
                <List.Item
                    title="テスト"
                    //description="Item description"
                    left={props => <List.Icon {...props} icon="penguin" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    style={styles.listItem}
                    onPress={() => { navigation.navigate('Test'); }}
                />
            </List.Section>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#F0F4F8'
    },
    listSubheader: {
        //backgroundColor: '#F0F4F8',
        //marginBottom:1,
        //borderTopWidth: 1,
        //borderBottomWidth: 1,
    },
    listItem: {
        backgroundColor: '#FFFFFF',
        marginBottom:5,
        //borderTopWidth: 1,
        //borderBottomWidth: 1,
    }
});