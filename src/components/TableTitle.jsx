import React, { useEffect, useState, useContext }  from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TableTitle(props) {
    const { title } = props;
    return (
            <View>
                <View style={styles.testTable}>
                    <Text style={styles.testTableTitle} >{title}</Text>
                </View>
            </View>
    );
}

const styles = StyleSheet.create({
    testTable: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        //paddingVertical: 16,
        //justifyContent: 'center',
        //borderWidth: 1,
        //borderTopColor : 'rgba(0, 0, 0, 100)',
        //borderLeftColor : 0,
        //borderRightColor : 0,
        //borderBottomColor : 0, 
        height: '100%',
        alignItems: 'center',
    },
    testTabledesign: {
        //flexDirection: 'row',
        //alignItems:'center',
        
    },
    testTableTitle: {
        fontSize: 13,
        lineHeight: 16,
        //padding: 3 ,
        //margin: '1%',
        //paddingLeft: '10%',
        //paddingRight: '10%',
        fontWeight: 'bold',
        //backgroundColor: '#676556',
        //borderWidth: 1,
        width: '25%',
        flexGrow: 1,
        textAlign: 'center',
    },
});