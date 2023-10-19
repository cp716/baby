import React, { useState }  from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';
import Loading from './Loading';
import { List } from 'react-native-paper';

export default function LogOutButton(props) {
    const navigation = useNavigation();
    //const [isLoading, setLoading] = useState(false);

    function handlePress() {
        Alert.alert('ログアウトします', 'よろしいですか？', [
            {
                text: 'キャンセル',
                onPress: () => {},
            },
            {
                text: 'OK',
                onPress: () => {
                    //setLoading(true);
                    firebase.auth().signOut()
                    .then(() => {
                        //navigation.navigate('Setting')
                        navigation.reset({
                        index: 0,
                        routes: [{ name: 'Setting'}],
                        });
                        //navigation.jumpTo('Home');
                    })
                    .catch(() => {
                        Alert.alert('ログアウトに失敗しました');
                    })
                    .then(() => {
                        //setLoading(false);
                    });;
                },
            },
        ]);
    }

    return (
        <View style={styles.container}>
            <List.Item
                title="ログアウト"
                //description="Item description"
                left={props => <List.Icon {...props} icon="penguin" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                //style={styles.listItem}
                onPress={() => { 
                    handlePress(); 
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        backgroundColor: '#F0F4F8',
    },
    inner: {
        paddingHorizontal: 27,
        paddingVertical: 24,
    },
    LogOutButton: {
        //flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    label: {
        fontSize: 14,
        color: 'rgba(103, 103, 103, 0.7)',
    },
});
