import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import storage from '../context/Storage';
import Modal from "react-native-modal";

import { RadioButton, List } from 'react-native-paper';

import { useBabyContext } from '../context/BabyContext';
import { useCurrentBabyContext } from '../context/CurrentBabyContext';
import Button from '../components/Button';

export default function BabyListScreen(props) {
    const { navigation } = props;

    const { baby } = useBabyContext();
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();

    const babyData = [];
    if(baby !== "") {
        baby.forEach((doc) => {
            const data = doc.data();
            babyData.push({
                id: doc.id,
                babyName: data.babyName,
                birthday: data.birthday,
                //birthday: year + '年' + (month + 1) + '月' + day + '日',
            });
        });
    }

    const [babyIdData, setBabyIdData] = useState('');
    const [checked, setChecked] = React.useState();

    useEffect(() => {
        storage.load({
            key : 'selectbaby',
        }).then(data => {
            // 読み込み成功時処理
            setChecked(data.babyId)
        }).catch(err => {
            // 読み込み失敗時処理
            console.log(err)
        });
    }, []);

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
                            //status="unchecked"
                            onPress={() => {
                                setChecked(item.id)
                                currentBabyDispatch({ 
                                    type: "addBaby",
                                    babyName: item.babyName,
                                    babyBirthday: item.birthday.toDate(),
                                    babyId: item.id,
                                })
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
                    onPress={() => { 
                        navigation.navigate('BabyEdit', { babyData: babyData }); 
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
});
