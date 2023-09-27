import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite'; // SQLiteをインポート

import { RadioButton } from 'react-native-paper';

import Button from '../components/Button';

export default function BabyListScreen(props) {
    const { navigation } = props;
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            setChecked(null);
            setId(null);
            setName(null);
            setBirthday(null);
        }
    }, [isFocused]);

    // データ取得関数を初回実行
    useEffect(() => {
        loadBabyData();
    }, [isFocused]);

    const [babyData, setBabyData] = useState([]); // SQLiteから取得したデータを格納するステート

    // SQLiteデータベースを開くか作成する
    const database = SQLite.openDatabase('DB.db');

    // SQLiteからデータを取得する関数
    const loadBabyData = () => {
        database.transaction((tx) => {
            // babyDataテーブルからデータを取得
            tx.executeSql(
                'SELECT * FROM babyData',
                [],
                (_, { rows }) => {
                    const data = rows._array; // クエリ結果を配列に変換
                    setBabyData(data); // データをステートにセット
                },
                (_, error) => {
                    console.error('データの取得中にエラーが発生しました:', error);
                }
            );
        });
    };

    const [id, setId] = useState(null);
    const [name, setName] = useState(null);
    const [birthday, setBirthday] = useState(null);
    const [checked, setChecked] = React.useState();

    function renderItem({ item }) {  
        
        const date = new Date(item.birthday);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        return(
            <View>
                {(() => {
                    return(
                        <RadioButton.Item
                            value={item.id}
                            label={item.name + '\n誕生日:' + year + '年' + (month + 1) + '月' + day + '日'}
                            status={checked === item.id ? 'checked' : null}
                            onPress={() => {
                                console.log(item.id)
                                setChecked(item.id)
                                setId(item.id)
                                setName(item.name)
                                setBirthday(item.birthday)
                            }}
                        />
                    )
                })()}
            </View>
        )       
    } 

    const ItemSeparator = () => (
        <View style={styles.separator} />
    );

    const enabledButtonStyle = {};
    const disabledButtonStyle = {
    backgroundColor: '#F0F0F0', // 無効な状態のボタンの背景色
    };
    
    return (
        <View style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.title}>赤ちゃん一覧</Text>
                <View style={styles.inputTypeContainer}>
                    <FlatList
                        inverted // 反転
                        data={babyData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()} // idを文字列に変換
                        ItemSeparatorComponent={ItemSeparator}
                    />
                </View>
                <Button
                    label="編集"
                    disabled={!id || !name || !birthday}
                    style={id && name && birthday ? enabledButtonStyle : disabledButtonStyle}
                    onPress={() => { 
                        if (id && name && birthday) {
                            navigation.navigate('BabyEdit', { 
                                id: id, 
                                name: name,
                                birthday: birthday,
                            });
                        } else {
                            // ここでボタンが無効な状態であることをユーザーに伝えるための処理を追加するか、ボタンを非表示にするなどの適切な処理を行います。
                            // 例えば、アラートを表示するか、ボタンを灰色にしてクリックできなくするなどの方法が考えられます。
                            // 以下はアラートを表示する例です。
                            Alert.alert("編集をしたい赤ちゃんを選択してください");
                        }
                    }}
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
    title: {
        //marginTop: '5%',
        //marginLeft: '5%',
        fontSize: 24,
        lineHeight: 32,
        fontWeight: 'bold',
    },
    inputTypeContainer: {
        marginTop: '10%',
        paddingHorizontal: 27,
        paddingVertical: 10,
        //height: 50,
        maxHeight: '70%',
        backgroundColor: '#FFF',
        //flex: 1,
        //flexDirection: 'row',
        //width: 350 ,
        //flex:1
        //height: 300,
        padding : '5%',
        borderColor : '#737373',
        borderWidth : 1,
        borderRadius : 20,
    },
    radioButton: {
        //flexDirection: 'row',
        //paddingLeft: 'auto',
        //paddingRight: 'auto',
        //marginLeft: 'auto',
        //marginRight: 'auto',
        //justifyContent: 'space-around',//横並び均等配置
        //flexgrow: 1,
    },
    advertisement: {
        //marginTop: 'auto',
        //marginBottom: 'auto',
        paddingTop: 10,
        paddingBottom: 10,
        //height: '15%',
        //width: '50%',
        alignItems:'center',
        //backgroundColor: '#464876',
    },
    separator: {
        height: 1,
        backgroundColor: '#737373',
    },
    item: {
    padding: 20,
    },
    // 無効なボタンのスタイル
    disabledButtonStyle: {
    backgroundColor: 'gray', // 無効な状態のボタンの背景色
    padding: 10,
    borderRadius: 5,
    },
});
