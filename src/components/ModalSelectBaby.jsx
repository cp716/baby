import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import firebase from 'firebase';
import { useIsFocused } from '@react-navigation/native';
import Modal from "react-native-modal";
import * as SQLite from 'expo-sqlite'; // SQLiteをインポート
import CircleButton from './CircleButton';
import { RadioButton } from 'react-native-paper';

import { useBabyContext } from '../context/BabyContext';

export default function ModalSelectBaby(props) {
    const isFocused = useIsFocused();
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // データ取得関数を初回実行
    useEffect(() => {
        loadBabyData();
    }, [isFocused]);

    const { baby } = useBabyContext();

    const [babyData, setBabyData] = useState([]); // SQLiteから取得したデータを格納するステート
    const [currentBaby, setCurrentBaby] = useState([]); // SQLiteから取得したデータを格納するステート

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
            tx.executeSql(
                'SELECT * FROM currentBaby',
                [],
                (_, rows) => {
                    setCurrentBaby(rows.rows.item(0)); // データをステートにセット)
                }
            );
        });
    };
    console.log(currentBaby.id)

    const [babyIdData, setBabyIdData] = useState(null);
    const { toggleBabyModal } = props;
    const [checked, setChecked] = React.useState(currentBaby.id);
    
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
                            label={item.babyName + '\n誕生日:' + year + '年' + (month + 1) + '月' + day + '日'}
                            status={checked === item.id ? 'checked' : null}
                            onPress={() => {
                                console.log(item.id)
                                setChecked(item.id)
                                setBabyId(item.id)
                                setBabyName(item.babyName)
                                setBabyBirthday(item.birthday)
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
        <View>
            <CircleButton
                name="baby-face-outline"
                onPress={() => {
                    toggleModal();
                }}
            />
            <Modal isVisible={isModalVisible}
                onBackdropPress={toggleModal}
                backdropTransitionOutTiming={0}
                //modalレパートリー
                //"bounce" | "flash" | "jello" | "pulse" | "rotate" | "rubberBand" | "shake" | "swing" | "tada" | "wobble" | "bounceIn" | "bounceInDown" | "bounceInUp" | "bounceInLeft" | "bounceInRight" | "bounceOut" | "bounceOutDown" | "bounceOutUp" | "bounceOutLeft" | "bounceOutRight" | "fadeIn" | "fadeInDown" | "fadeInDownBig" | "fadeInUp" | "fadeInUpBig" | "fadeInLeft" | "fadeInLeftBig" | "fadeInRight" | "fadeInRightBig" | "fadeOut" | "fadeOutDown" | "fadeOutDownBig" | "fadeOutUp" | "fadeOutUpBig" | "fadeOutLeft" | "fadeOutLeftBig" | "fadeOutRight" | "fadeOutRightBig" | "flipInX" | "flipInY" | "flipOutX" | "flipOutY" | "lightSpeedIn" | "lightSpeedOut" | "slideInDown" | "slideInUp" | "slideInLeft" | "slideInRight" | "slideOutDown" | "slideOutUp" | "slideOutLeft" | "slideOutRight" | "zoomIn" | "zoomInDown" | "zoomInUp" | "zoomInLeft" | "zoomInRight" | "zoomOut" | "zoomOutDown" | "zoomOutUp" | "zoomOutLeft" | "zoomOutRight" |
                animationIn="fadeInUpBig"
                animationOut="fadeOutDownBig"
                avoidKeyboard={true}
                //swipeDirection="down"
                //onSwipeComplete={toggleModal}
            >
                <View style={modalStyles.container}>
                        <Text style={modalStyles.title}>表示中の赤ちゃんを変更</Text>
                        <View style={styles.inputTypeContainer}>
                                <FlatList
                                inverted // 反転
                                data={babyData}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id.toString()} // idを文字列に変換
                                ItemSeparatorComponent={ItemSeparator}
                            />
                        </View>
                        <View>
                            <TouchableOpacity style={modalStyles.confirmButton} onPress={toggleModal} >
                                <Text style={modalStyles.confirmButtonText}>閉じる</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.advertisement}>
                            <Image style={{width: '100%'}}
                                resizeMode='contain'
                                source={require('../img/IMG_3641.jpg')}
                            />
                        </View>
                    </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor : '#FFF',
        padding : '5%',
        borderColor : '#36C1A7',
        borderWidth : 3,
        borderRadius : 20,
    },
    inputTypeContainer: {
        paddingHorizontal: 27,
        paddingVertical: 10,
        //height: 50,
        //maxHeight: '50%',
        //flex: 1,
        backgroundColor: '#FFF',
        //flexDirection: 'row',
        //width: 350 ,
        //flex:1
        //height: 300,
        padding : '5%',
        borderColor : '#737373',
        borderWidth : 1,
        borderRadius : 10,
    },
    separator: {
        height: 1,
        backgroundColor: '#737373',
    },
    advertisement: {
        //marginTop: 'auto',
        //marginBottom: 'auto',
        //paddingTop: 10,
        //paddingBottom: 10,
        //height: '15%',
        //width: '50%',
        //alignItems:'center',
        //backgroundColor: '#464876',
        //marginBottom: 10,
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
        padding : '5%',
        borderColor : '#36C1A7',
        borderWidth : 3,
        borderRadius : 10,
    },
    title : {
        color : '#737373',
        fontWeight : 'bold',
        textAlign: 'center',
        fontSize: 20,
        marginBottom: '5%',
    },
    //arrow : {
        //color : '#36C1A7',
    //},
    confirmButton : {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop : '5%',
        marginBottom: '5%',
        backgroundColor : '#FFDB59',
        borderColor : '#737373',
        borderWidth : 1,
        borderRadius : 10,
        width: "40%",
    },
    confirmButtonText : {
        color : '#737373',
        fontWeight : 'bold',
        textAlign : 'center',
        padding: 10,
        fontSize: 16,
    },
});
