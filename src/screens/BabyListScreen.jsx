import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { RadioButton } from 'react-native-paper';

import { useBabyContext } from '../context/BabyContext';
import Button from '../components/Button';

export default function BabyListScreen(props) {
    const { navigation } = props;
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            setChecked(null);
            setBabyId(null);
            setBabyName(null);
            setBabyBirthday(null);
        }
    }, [isFocused]);

    const { baby } = useBabyContext();

    const babyData = [];
    if(baby !== "") {
        baby.forEach((doc) => {
            const data = doc.data();
            babyData.push({
                id: doc.id,
                babyName: data.babyName,
                birthday: data.birthday,
            });
        });
    }

    const [babyId, setBabyId] = useState(null);
    const [babyName, setBabyName] = useState(null);
    const [babyBirthday, setBabyBirthday] = useState(null);
    const [checked, setChecked] = React.useState();

    function renderItem({ item }) {  
        
        const date = new Date(item.birthday.seconds * 1000 + item.birthday.nanoseconds / 1000000);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        return(
            <View>
                {(() => {
                    return(
                        <RadioButton.Item
                            value={item.id}
                            label={item.babyName + '\n誕生日:' + year + '年' + (month + 1) + '月' + day + '日'}
                            status={checked === item.id ? 'checked' : null}
                            onPress={() => {
                                setChecked(item.id)
                                setBabyId(item.id)
                                setBabyName(item.babyName)
                                setBabyBirthday(item.birthday.seconds * 1000 + item.birthday.nanoseconds / 1000000)
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
                        inverted//反転
                        data={babyData}
                        renderItem={renderItem}
                        keyExtractor={(item) => { return item.id; }}
                        ItemSeparatorComponent={ItemSeparator}
                    />
                </View>
                <Button
                    label="編集"
                    disabled={!babyId || !babyName || !babyBirthday}
                    style={babyId && babyName && babyBirthday ? enabledButtonStyle : disabledButtonStyle}
                    onPress={() => { 
                        if (babyId && babyName && babyBirthday) {
                            navigation.navigate('BabyEdit', { 
                                babyId: babyId, 
                                babyName: babyName,
                                babyBirthday: babyBirthday,
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
