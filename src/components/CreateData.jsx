import React, { useState, useEffect } from 'react';

import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import CreateDataDesign from './CreateDataDesign';
import CreateMemoDataDesign from './CreateMemoDataDesign';
import DetailScreen from '../screens/DetailScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";

export default function CreateData(props) {
    const { milkData } = props;
    const { toiletData } = props;
    const { foodData } = props;
    const { diseaseData } = props;
    const { bodyData } = props;
    const { freeData } = props;
    const { currentBaby } = props;

    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const [modalEntry, setModalEntry] = useState();

    // idをキーとしてデータを統合するオブジェクトを作成
    const combinedData = {};

    // MILKデータを統合
    milkData.forEach(item => {
        const id = item.record_id;
        if (!combinedData[id]) {
            combinedData[id] = {};
        }
        Object.assign(combinedData[id], item);
    });
    
    // FOODデータを統合
    foodData.forEach(item => {
        const id = item.record_id;
        if (!combinedData[id]) {
            combinedData[id] = {};
        }
        Object.assign(combinedData[id], item);
    });

    // TOILETデータを統合
    toiletData.forEach(item => {
        const id = item.record_id;
        if (!combinedData[id]) {
            combinedData[id] = {};
        }
        Object.assign(combinedData[id], item);
    });
    
    // DISEASEデータを統合
    diseaseData.forEach(item => {
        const id = item.record_id;
        if (!combinedData[id]) {
            combinedData[id] = {};
        }
        Object.assign(combinedData[id], item);
    });

    // BODYデータを統合
        bodyData.forEach(item => {
        const id = item.record_id;
        if (!combinedData[id]) {
            combinedData[id] = {};
        }
        Object.assign(combinedData[id], item);
    });

    // FREEデータを統合
    freeData.forEach(item => {
        const id = item.record_id;
        if (!combinedData[id]) {
            combinedData[id] = {};
        }
        Object.assign(combinedData[id], item);
    });
    
    // 統合されたデータを配列に変換
    const combinedArray = Object.values(combinedData);

    // updatedAtで降順にソート
    combinedArray.sort((a, b) => {
        return new Date(a.record_time) - new Date(b.record_time);
    });

    const renderItem = ({ item }) => {
        const { category, record_time, junyu_left, junyu_right, milk, bonyu, oshikko, unchi, amount, body_temperature, value, free_text, memo } = item;
    
        let categoryIcon;
        let categoryText;

        let stringJnyuLeft = String(junyu_left).padStart(2, '0');
        let stringJnyuRight = String(junyu_right).padStart(2, '0');

        if(stringJnyuLeft == 0){
            stringJnyuLeft = '00'
        }
        if(stringJnyuRight == 0){
            stringJnyuRight = '00'
        }
    
        switch (category) {
            case 'MILK':
                categoryIcon = <MaterialCommunityIcons name='baby-bottle-outline' size={18} color="black" />;
                categoryText = 'ミルク\n' + milk + 'ml';
                break;
            case 'BONYU':
                categoryIcon = <MaterialCommunityIcons name='baby-bottle-outline' size={18} color="black" />;
                categoryText = '母乳\n' + bonyu + 'ml';
                break;
            case 'JUNYU':
                categoryIcon = <MaterialCommunityIcons name='baby-bottle-outline' size={18} color="black" />;
                categoryText = '授乳(左)' + stringJnyuLeft + '分\n' + '授乳(右)' + stringJnyuRight + '分';
                break;
            case 'OSHIKKO':
                categoryIcon = <MaterialCommunityIcons name='toilet' size={18} color="black" />;
                categoryText = 'おしっこ';
                break;
            case 'UNCHI':
                categoryIcon = <MaterialCommunityIcons name='toilet' size={18} color="black" />;
                categoryText = 'うんち';
                break;
            case 'FOOD':
                categoryIcon = <MaterialCommunityIcons name='food-fork-drink' size={20} color="black" />;
                categoryText = '食べ物';
                if (amount) categoryText = '食べ物\n' + amount + 'g';
                break;
            case 'DRINK':
                categoryIcon = <MaterialCommunityIcons name='food-fork-drink' size={20} color="black" />;
                categoryText = '飲み物';
                if (amount) categoryText = '飲み物\n' + amount + 'ml';
                break;
            case 'HANAMIZU':
                categoryIcon = <MaterialCommunityIcons name='hospital-box-outline' size={18} color="black" />;
                categoryText = '鼻水';
                break;
            case 'SEKI':
                categoryIcon = <MaterialCommunityIcons name='hospital-box-outline' size={18} color="black" />;
                categoryText = '咳';
                break;
            case 'OTO':
                categoryIcon = <MaterialCommunityIcons name='hospital-box-outline' size={18} color="black" />;
                categoryText = '嘔吐';
                break;
            case 'HOSSHIN':
                categoryIcon = <MaterialCommunityIcons name='hospital-box-outline' size={18} color="black" />;
                categoryText = '発疹';
                break;
            case 'KEGA':
                categoryIcon = <MaterialCommunityIcons name='hospital-box-outline' size={18} color="black" />;
                categoryText = '怪我';
                break;
            case 'KUSURI':
                categoryIcon = <MaterialCommunityIcons name='hospital-box-outline' size={18} color="black" />;
                categoryText = '薬';
                break;
            case 'TAION':
                categoryIcon = <MaterialCommunityIcons name='hospital-box-outline' size={18} color="black" />;
                categoryText = '体温\n' + body_temperature + '℃';
                break;
            case 'HEIGHT':
                categoryIcon = <MaterialCommunityIcons name='human-male-height' size={20} color="black" />;
                categoryText = '身長\n' + value + 'cm';
                break;
            case 'WEIGHT':
                categoryIcon = <MaterialCommunityIcons name='human-male-height' size={20} color="black" />;
                categoryText = '体重\n' + value + 'kg';
                break;
            case 'FREE':
                categoryIcon = <MaterialCommunityIcons name='pen' size={20} color="black" />;
                categoryText = free_text;
                break;
            default:
                categoryIcon = null;
                categoryText = '';
            }
        
            return (
            <TouchableOpacity
                style={styles.tabledesign}
                onPress={() => {
                    setModalVisible(!isModalVisible);
                    setModalEntry(item);
                }}
            >
                <CreateDataDesign date={
                    <Text style={styles.tableTitle}>
                        {String(new Date(item.record_time).getHours()).padStart(2, '0')}:
                        {String(new Date(item.record_time).getMinutes()).padStart(2, '0')}
                    </Text>
                }/>
                <CreateDataDesign date={<Text style={styles.tableTitle}>{categoryIcon}</Text>} />
                <CreateDataDesign date={<Text style={styles.tableTitle}>{categoryText}</Text>} />
                <CreateMemoDataDesign date={<Text style={styles.tableTitle}>{memo}</Text>} />
            </TouchableOpacity>
        );
    } 

    return (
    <View style={styles.container}>
        <FlatList
            data={combinedArray}
            renderItem={renderItem}
            keyExtractor={(item) => item.record_id.toString()}
        />
        <Modal
            isVisible={isModalVisible}
            onBackdropPress={toggleModal}
            animationIn="fadeInRightBig"
            animationOut="fadeOutRightBig"
            avoidKeyboard={true}
            useNativeDriver
            hideModalContentWhileAnimating={true}
        >
            <DetailScreen babyData={modalEntry} toggleModal={toggleModal} />
        </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    table: {
        
    },
    tableTitle: {
        fontSize: 15,
        //lineHeight: 16,
        //paddingHorizontal: 19,
        //width: '21%',
        //textAlign: 'center',
        //justifyContent: 'center',
        //alignItems: 'center',
        //position: 'absolute',
    },
    tabledesign: {
        flexDirection: 'row',
        alignItems:'center',
        backgroundColor: '#ffffff',
        //flexDirection: 'row',
        //paddingVertical: 16,
        justifyContent: 'center',
        //borderTopWidth: 0.5,
        //borderBottomWidth: 0.5,
        //borderTopColor : 'rgba(0, 0, 0, 100)',
        //borderBottomColor: 'rgba(0, 0, 0, 100)',
        height: 50,
        //width: '100%',
        marginBottom:1,
        //marginBottom:1,
    },
    iconStyle: {
        //backgroundColor: '#ffffff',
        //flexDirection: 'row',
        //paddingVertical: 16,
        //justifyContent: 'center',
        //borderTopWidth: 0.5,
        //borderBottomWidth: 0.5,
        //borderTopColor : 'rgba(0, 0, 0, 100)',
        //borderBottomColor: 'rgba(0, 0, 0, 100)',
        //height: 50,
        //marginBottom:1,
        //marginBottom:1,
        //textAlign: 'center',
        //justifyContent: 'center',
        //alignItems: 'center',
        //position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        //fontSize: 5,
    },
});

const modalStyles = StyleSheet.create({
    modalButton : {
        backgroundColor : '#FFF',
        borderColor : '#36C1A7',
        borderWidth : 1,
        borderRadius : 10,
    },
    modalButtonText : {
        color : '#36C1A7',
        fontWeight : 'bold',
        textAlign : 'center',
        padding: 10,
        fontSize: 20,
    },
    container : {
        backgroundColor : '#FFF',
        padding : '5%'
    },
    title : {
        color : '#36C1A7',
        fontWeight : 'bold',
        textAlign: 'center'
    },
    //arrow : {
        //color : '#36C1A7',
    //},
});