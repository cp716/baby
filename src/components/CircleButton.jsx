import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { string, shape, func } from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CircleButton(props) {
    const { style, name, onPress, onLongPress } = props; 
    return (
        <TouchableOpacity style={[styles.circleButton, style]} onPress={onPress} onLongPress={onLongPress}>
            <MaterialCommunityIcons name={name} size={32} color="#737373" />
        </TouchableOpacity>
    )
}

CircleButton.propTypes = {
    style: shape(),
    name: string.isRequired,
    onPress: func,
};

CircleButton.defaultProps = {
    style: null,
    onPress: func,
}

const styles = StyleSheet.create({
    circleButton: {
        backgroundColor: '#FFDB59',
        width: 80,
        height: 50,
        borderRadius: 15,
        borderColor: 'transparent', // borderColorを透明に設定
        borderWidth: 0, // borderWidthを0に設定
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000000', // ios
        shadowOffset: { width: 0, height: 4 }, // ios
        shadowOpacity: 0.25, // ios
        shadowRadius: 4, // ios
        //elevation: 8, // Android
    }
});