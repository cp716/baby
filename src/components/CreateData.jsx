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
        const { category, record_time, junyu_left, junyu_right, milk, bonyu, oshikko, unchi, amount, body_temperature, free_text, memo } = item;
    
        let categoryIcon;
        let categoryText;
    
        switch (category) {
            case 'MILK':
                categoryIcon = <MaterialCommunityIcons name='baby-bottle-outline' size={20} color="black" />;
                categoryText = 'ミルク\n' + milk + 'ml';
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
                    </Text>}
                />
                <CreateDataDesign date={<Text style={styles.tableTitle}>{categoryIcon}</Text>} />
                <CreateDataDesign date={<Text style={styles.tableTitle}>{categoryText}</Text>} />
                <CreateMemoDataDesign date={<Text style={styles.tableTitle}>{memo}</Text>} />
            </TouchableOpacity>
        );

        return(
            <View>
                {(() => {
                    return(
                        <TouchableOpacity
                            style={styles.tabledesign}
                            onPress={() => {
                                setModalVisible(!isModalVisible);
                                setModalEntry(item);
                            }}
                        >
                            <CreateDataDesign date = {
                                <Text style={styles.tableTitle}>
                                    {String(new Date(item.record_time).getHours()).padStart(2, '0')}:
                                    {String(new Date(item.record_time).getMinutes()).padStart(2, '0')}
                                </Text>
                            } />
                            <CreateDataDesign date = {
                                <Text style={styles.tableTitle}>
                                {(() => {
                                        if (item.category == 'JUNYU') {
                                            return (
                                                <MaterialCommunityIcons name='baby-bottle-outline' size={18} color="black" />
                                                //'授乳'
                                            );
                                        } else if(item.category == 'MILK' || item.category == 'BONYU') {
                                            return (
                                                <MaterialCommunityIcons name='baby-bottle-outline' size={20} color="black" />
                                                //'哺乳瓶'
                                            );
                                        }  else if(item.category == 'TOILET') {
                                            return (
                                                <MaterialCommunityIcons name='toilet' size={20} color="black" />
                                                //'トイレ'
                                            );
                                        }  else if(item.category == 'HANAMIZU' || item.category === 'SEKI' || item.category === 'OTO' || item.category === 'HOSSHIN' || item.category === 'KEGA' || item.category === 'KUSURI' || item.category === 'TAION') {
                                            return (
                                                <MaterialCommunityIcons name='hospital-box-outline' size={18} color="black" />
                                                //'体調'
                                            );
                                        }  else if(item.category == 'FOOD' || item.category === 'DRINK' ) {
                                            return (
                                                <MaterialCommunityIcons name='food-fork-drink' size={20} color="black" />
                                                //'自由項目'
                                            );
                                        }  else if(item.category == 'FREE') {
                                            return (
                                                <MaterialCommunityIcons name='pen' size={20} color="black" />
                                                //'自由項目'
                                            );
                                        }
                                    })()}
                                </Text>
                            } />
                            <CreateDataDesign date = {
                                <Text style={styles.tableTitle}>
                                {(() => {
                                        if (item.category == 'JUNYU') {
                                            return (
                                                '左' + item.junyu_left +'分\n' +
                                                '右' + item.junyu_right +'分'
                                            );
                                        } else if (item.category == 'MILK') {
                                            return (
                                                'ミルク\n' + item.milk +'ml'
                                            );
                                        } else if (item.category == 'BONYU') {
                                            return (
                                                '母乳\n' + item.bonyu +'ml'
                                            )
                                        } else if (item.category == 'TOILET') {
                                            var toilet = "";
                                            if(item.oshikko == 1) {
                                                toilet += "「おしっこ」"
                                            }
                                            if(item.unchi == 1) {
                                                toilet += "「うんち」"
                                            }
                                            return (
                                                toilet
                                            )
                                        }else if (item.category == 'HANAMIZU') {
                                            var disease = "鼻水"
                                            return (
                                                disease
                                            )
                                        }else if (item.category == 'SEKI') {
                                            var disease = "咳"
                                            return (
                                                disease
                                            )
                                        }else if (item.category == 'OTO') {
                                            var disease = "嘔吐"
                                            return (
                                                disease
                                            )
                                        }else if (item.category == 'HOSSHIN') {
                                            var disease = "発疹"
                                            return (
                                                disease
                                            )
                                        }else if (item.category == 'KEGA') {
                                            var disease = "怪我"
                                            return (
                                                disease
                                            )
                                        }else if (item.category == 'KUSURI') {
                                            var disease = "薬"
                                            return (
                                                disease
                                            )
                                        }else if (item.category == 'TAION') {
                                            var disease = "体温"
                                            disease += "\n" + item.body_temperature + '℃'
                                            return (
                                                disease
                                            )
                                        }else if (item.category == 'FOOD') {
                                            var food = "食事"
                                            if(item.amount) {
                                                food += "\n" + item.amount + 'g'
                                            }
                                            return (
                                                food
                                            )
                                        }else if (item.category == 'DRINK') {
                                            var drink = "飲物"
                                            if(item.amount) {
                                                drink += "\n" + item.amount + 'ml'
                                            }
                                            return (
                                                drink
                                            )
                                        }else if (item.category == 'FREE') {
                                            return (
                                                item.free_text
                                            )
                                        }
                                    })()}
                                </Text>
                            } />
                            <CreateMemoDataDesign date = {<Text style={styles.tableTitle} >{item.memo}</Text>} />
                            <Modal
                                isVisible={isModalVisible}
                                onBackdropPress={toggleModal}
                                //backdropTransitionOutTiming={0}
                                //modalレパートリー
                                //"bounce" | "flash" | "jello" | "pulse" | "rotate" | "rubberBand" | "shake" | "swing" | "tada" | "wobble" | "bounceIn" | "bounceInDown" | "bounceInUp" | "bounceInLeft" | "bounceInRight" | "bounceOut" | "bounceOutDown" | "bounceOutUp" | "bounceOutLeft" | "bounceOutRight" | "fadeIn" | "fadeInDown" | "fadeInDownBig" | "fadeInUp" | "fadeInUpBig" | "fadeInLeft" | "fadeInLeftBig" | "fadeInRight" | "fadeInRightBig" | "fadeOut" | "fadeOutDown" | "fadeOutDownBig" | "fadeOutUp" | "fadeOutUpBig" | "fadeOutLeft" | "fadeOutLeftBig" | "fadeOutRight" | "fadeOutRightBig" | "flipInX" | "flipInY" | "flipOutX" | "flipOutY" | "lightSpeedIn" | "lightSpeedOut" | "slideInDown" | "slideInUp" | "slideInLeft" | "slideInRight" | "slideOutDown" | "slideOutUp" | "slideOutLeft" | "slideOutRight" | "zoomIn" | "zoomInDown" | "zoomInUp" | "zoomInLeft" | "zoomInRight" | "zoomOut" | "zoomOutDown" | "zoomOutUp" | "zoomOutLeft" | "zoomOutRight" |
                                animationIn="fadeInRightBig"
                                animationOut="fadeOutRightBig"
                                avoidKeyboard={true}
                                //swipeDirection='right'
                                //onSwipeComplete={toggleModal}
                                useNativeDriver//チラつき防止
                                hideModalContentWhileAnimating={true}
                            >
                                <DetailScreen babyData={modalEntry} toggleModal={toggleModal} />
                            </Modal>
                        </TouchableOpacity>
                    )
                })()}
            </View>
        )       
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
    
    return (
        <View style={styles.container}>
            <FlatList
                //inverted//反転
                data={combinedArray} // ソート済みデータを渡す
                renderItem={renderItem}
                keyExtractor={(item) => { return item.record_id; }}
            />
        </View>
    )
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