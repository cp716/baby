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

    function renderItem({ item }) {   
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
                                                <MaterialCommunityIcons name='baby-bottle-outline' size={15} color="black" />
                                                //'授乳'
                                            );
                                        } else if(item.category == 'MILK' || item.category == 'BONYU') {
                                            return (
                                                <MaterialCommunityIcons name='baby-bottle-outline' size={15} color="black" />
                                                //'哺乳瓶'
                                            );
                                        }  else if(item.category == 'TOILET') {
                                            return (
                                                <MaterialCommunityIcons name='toilet' size={15} color="black" />
                                                //'トイレ'
                                            );
                                        }  else if(item.category == 'DISEASE') {
                                            return (
                                                <MaterialCommunityIcons name='hospital-box-outline' size={15} color="black" />
                                                //'体調'
                                            );
                                        }  else if(item.category == 'FOOD') {
                                            return (
                                                <MaterialCommunityIcons name='food-fork-drink' size={15} color="black" />
                                                //'自由項目'
                                            );
                                        }  else if(item.category == 'FREE') {
                                            return (
                                                <MaterialCommunityIcons name='pen' size={15} color="black" />
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
                                        }else if (item.category == 'DISEASE') {
                                            var disease = "";
                                            if(item.hanamizu) {
                                                disease += "「鼻水」"
                                            }
                                            if(item.seki) {
                                                disease += "「咳」"
                                            }
                                            if(item.oto) {
                                                disease += "「嘔吐」"
                                            }
                                            if(item.hosshin) {
                                                disease += "「発疹」"
                                            }
                                            if(item.kega) {
                                                disease += "「怪我」"
                                            }
                                            if(item.kusuri) {
                                                disease += "「薬」"
                                            }
                                            if(item.body_temperature) {
                                                disease += item.body_temperature
                                            }
                                            return (
                                                disease
                                            )
                                        }else if (item.category == 'FOOD') {
                                            var food = "";
                                            if(item.food) {
                                                food += "「食事」"
                                            }
                                            if(item.foodAmount) {
                                                food += item.foodAmount + 'g'
                                            }
                                            if(item.drink) {
                                                food += "「飲物」"
                                            }
                                            if(item.drinkAmount) {
                                                food += item.drinkAmount + 'ml'
                                            }
                                            return (
                                                food
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
                                <DetailScreen babyData={modalEntry}
                                toggleModal={toggleModal}
                                />
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
        fontSize: 13,
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