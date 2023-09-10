import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import storage from '../context/Storage';

import CurrentBabyPicker from '../components/CurrentBabyPicker';
import BabyAddButton from '../components/AddButton/BabyAddButton';
import BabyEditButton from '../components/EditForm/BabyEditButton';

import { useBabyContext } from '../context/BabyContext';

export default function BabySettingScreen(props) {
    const { navigation } = props;
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
    
    if (babyData == "") {
        return (
            <View style={styles.container}>
                <View style={styles.inner}>
                    <View style={styles.titleAndButton}>
                        <Text style={styles.title}>赤ちゃん設定</Text>
                        <BabyAddButton />
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.cacheResetButton}
                    onPress={() => {
                        storage.remove({
                            key : 'selectbaby'
                        });
                    }}
                >
                    <Text style={styles.cacheResetButtonText}>
                        (テスト用)キャッシュリセット
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.inner}>
                <View style={styles.titleAndButton}>
                    <Text style={styles.title}>赤ちゃん設定</Text>
                    <BabyAddButton />
                </View>
                <Text>現在設定中の赤ちゃん</Text>
                <View style={styles.dropDownPickerAndeditButton}>
                    <CurrentBabyPicker />
                    <BabyEditButton />
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
    titleAndButton: {
        flexDirection: 'row',
        alignItems:'center',
        marginBottom: 24,
        justifyContent: 'space-around',//横並び均等配置
        //justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        //lineHeight: 32,
        fontWeight: 'bold',
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
    footerText: {
        fontSize: 14,
        lineHeight: 24,
        marginRight: 8,
    },
    footerLink: {
        fontSize: 14,
        lineHeight: 24,
        color: '#467FD3',
    },
    footer: {
        flexDirection: 'row'
    },
    pikerStyle: {
        width: "90%",
    },
    pikerListStyle: {
        width: "90%",
    },
    dropDownPickerAndeditButton: {
        justifyContent: 'space-around',//横並び均等配置
        flexDirection: 'row',
        alignItems:'center',
    },
    cacheResetButtonText: {
        //width: '40%',
        //marginTop: '5%',
        //marginLeft: '5%',
        //padding: 5,
        fontSize: 10,
        //textAlign: 'center',
    },
    cacheResetButton: {
        backgroundColor: '#FFDB59',
        width: 150,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        //position: 'absolute',
        //left: 20,
        //top: 100,
        shadowColor: '#000000',//ios
        shadowOffset: { width: 0, height: 8 },//ios
        shadowOpacity: 0.25,//ios
        shadowRadius: 8,//ios
        elevation: 8,//Android
    },

});