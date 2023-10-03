import React, { useState } from 'react';

import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import CreateDataDesign from './CreateDataDesign';
import CreateMemoDataDesign from './CreateMemoDataDesign';
import { shape, string, number, arrayOf } from 'prop-types';
import DetailScreen from '../screens/DetailScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";

export default function CreateData(props) {
    const { todayData2 } = props;
    const { currentBaby } = props;

    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const [modalEntry, setModalEntry] = useState();
    
    // updatedAtで降順にソート
    todayData2.sort((a, b) => {
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
                                                '左' + item.timeLeft +'分\n' +
                                                '右' + item.timeRight +'分'
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
                                            if(item.disease.hanamizu) {
                                                disease += "「鼻水」"
                                            }
                                            if(item.disease.seki) {
                                                disease += "「咳」"
                                            }
                                            if(item.disease.oto) {
                                                disease += "「嘔吐」"
                                            }
                                            if(item.disease.hosshin) {
                                                disease += "「発疹」"
                                            }
                                            if(item.disease.kega) {
                                                disease += "「怪我」"
                                            }
                                            if(item.disease.kusuri) {
                                                disease += "「薬」"
                                            }
                                            if(item.disease.bodyTemperature) {
                                                disease += item.disease.bodyTemperature
                                            }
                                            return (
                                                disease
                                            )
                                        }else if (item.category == 'FOOD') {
                                            var food = "";
                                            if(item.food.foodCheck) {
                                                food += "「食事」"
                                            }
                                            if(item.food.foodAmount) {
                                                food += item.food.foodAmount + 'g'
                                            }
                                            if(item.food.drinkCheck) {
                                                food += "「飲物」"
                                            }
                                            if(item.food.drinkAmount) {
                                                food += item.food.drinkAmount + 'ml'
                                            }
                                            return (
                                                food
                                            )
                                        }else if (item.category == 'FREE') {
                                            return (
                                                item.freeText
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
                data={todayData2} // ソート済みデータを渡す
                renderItem={renderItem}
                keyExtractor={(item) => { return item.record_id; }}
            />
        </View>
    )
}

CreateData.propTypes = {
    todayData2: arrayOf(shape({
        record_id: number,
        //timeLeft: number,
        //timeRight: number,
        //milk: number,
        //bonyu: number,
        memo: string,
        category: string,
        record_time: Date,
    })).isRequired,
};

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