import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native'
import { StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import storage from '../context/Storage';

import { useBabyContext } from '../context/BabyContext';
import { useCurrentBabyContext } from '../context/CurrentBabyContext';

export default function CurrentBabyPicker() {
    const isFocused = useIsFocused()

    const { baby } = useBabyContext();
    const { currentBabyState, currentBabyDispatch } = useCurrentBabyContext();
    const [listStatus, setListStatus] = useState(false);

    const [babyNameData, setBabyNameData] = useState();
    const [babyIdData, setBabyIdData] = useState();
    const [babyBirthdayData, setBabyBirthdayData] = useState();

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
    //console.log(currentBabyState)
    //console.log({
        //babyBirthday: babyBirthdayData,
        //babyId: babyIdData,
        //babyName: babyNameData
    //})
    useEffect(() => {
        storage.load({
            key : 'selectbaby',
        }).then(data => {
            // 読み込み成功時処理
            setBabyNameData(data.babyName)
            setBabyIdData(data.babyId)
            setBabyBirthdayData(data.babyBirthday)
            //console.log(data.babyBirthday)
        }).catch(err => {
            // 読み込み失敗時処理
            console.log(err)
        });
    }, [currentBabyState, isFocused]);

    let pickerName = [];
    for( let item of babyData ) {
        pickerName.push({label: item.babyName, value: item});
    }

    return (
        <DropDownPicker
            open={listStatus}
            onOpen={() => setListStatus(true)}
            onClose={() => setListStatus(false)}
            items={(() => {
                return(pickerName)
            })()}
            closeAfterSelecting={true}
            value={{
                babyBirthday: new Date(babyBirthdayData),
                babyId: babyIdData,
                babyName: babyNameData
            }}//なにこれ
            autoScroll={true}
            placeholder={babyNameData}//設定中ラベル名
            containerStyle={{height: 50}}
            style={styles.pikerStyle}
            //selectedItemLabelStyle
            //textStyle={styles.pikerTextStyle}
            //placeholderStyle={styles.pikerPlaceholderStyle}
            //listItemLabelStyle={styles.pikerTextStyle}
            dropDownContainerStyle={styles.pikerListStyle}
            onSelectValue={item => {
                
                console.log(item)
            }}
            onSelectItem={item => {
                //選択時の処理（必須）
                currentBabyDispatch({ 
                    type: "addBaby",
                    babyName: item.value.babyName,
                    babyBirthday: item.value.birthday.toDate(),
                    babyId: item.value.id,
                    //OK
                })
                setBabyNameData(item.value.babyName)
                //setBabyIdData(item.value.id)
                //setBabyBirthdayData(item.value.birthday.toDate())
            }}
            onChangeValue={item => {
                //現在の値を返す（必須）
                //console.log(item)
                
            }}
        />
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: '#FFDB59',
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom:24,
    },
    buttonLabel: {
        fontSize: 16,
        lineHeight: 32,
        paddingVertical: 8,
        paddingHorizontal: 32,
        color: '#ffffff',
    },
    pikerStyle: {
        width: "90%",
    },
    pikerListStyle: {
        width: "90%",
    },
});