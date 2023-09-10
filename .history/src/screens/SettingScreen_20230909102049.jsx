import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useBabyRecordContext } from '../context/BabyRecordContext';
import { List } from 'react-native-paper';
import firebase from 'firebase';

import BabyEditButton from '../components/EditForm/BabyEditButton';
import BabyAddButton from '../components/AddButton/BabyAddButton';
import ModalSelectBaby2 from '../components/ModalSelectBaby2';
import LogOutButton from '../components/LogOutButton';

export default function SettingScreen(props) {
    const { navigation } = props;
    const [user, setUser] = useState();



    useEffect(() => {
        setUser();
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                if(user.email) {
                    setUser(true);
                } else {
                    setUser(false);
                }
            }
        });
        return unsubscribe;
    }, []);

    if (user) {
        return (
            <View style={styles.container}>
                <List.Section>
                    <List.Subheader style={styles.listSubheader}>アカウント</List.Subheader>
                    <List.Item
                        title="メールアドレス変更"
                        //description="Item description"
                        left={props => <List.Icon {...props} icon="email-outline" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        style={styles.listItem}
                        onPress={() => { navigation.navigate('MailChange'); }}
                    />
                    <List.Item
                        title="パスワード変更"
                        //description="Item description"
                        left={props => <List.Icon {...props} icon="baby-face-outline" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        //style={styles.listItem}
                        onPress={() => { navigation.navigate('PasswordChange'); }}
                    />
                </List.Section>
                <List.Section>
                    <List.Subheader style={styles.listSubheader}>赤ちゃん</List.Subheader>
                    <ModalSelectBaby2 />
                    <BabyEditButton />
                    <BabyAddButton />
                </List.Section>
                <List.Section>
                    <List.Subheader style={styles.listSubheader}>その他</List.Subheader>
                    <List.Item
                        title="お問い合わせ"
                        //description="Item description"
                        left={props => <List.Icon {...props} icon="email-outline" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        style={styles.listItem}
                        onPress={() => { navigation.navigate('ContactForm'); }}
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
                    title="お問い合わせ"
                    //description="Item description"
                    left={props => <List.Icon {...props} icon="email-outline" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    style={styles.listItem}
                    onPress={() => { navigation.navigate('ContactForm'); }}
                />
                <List.Item
                    title="会員登録"
                    //description="Item description"
                    left={props => <List.Icon {...props} icon="email-outline" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    style={styles.listItem}
                    onPress={() => { navigation.navigate('SignUp'); }}
                />
                <List.Item
                    title="ログイン"
                    //description="Item description"
                    left={props => <List.Icon {...props} icon="email-outline" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    style={styles.listItem}
                    onPress={() => { navigation.navigate('LogIn'); }}
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
        //backgroundColor: '#F0F4F8',
        //marginBottom:1,
        //borderTopWidth: 1,
        //borderBottomWidth: 1,
    }
});