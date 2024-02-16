import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { func, shape, string } from 'prop-types';

export default function Button(props) {
    const { label, onPress, style } = props;
    return (
        <TouchableOpacity style={[styles.buttonContainer, style]} onPress={onPress}>
            <Text style={styles.buttonLabel}>{label}</Text>
        </TouchableOpacity>
    );
}

Button.propTypes = {
    label: string.isRequired,
    onPress: func,
    style: shape(),
};

Button.defaultProps = {
    onPress: null,
};

const styles = StyleSheet.create({
    buttonContainer: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop : '10%',
        //marginBottom : '5%',
        backgroundColor : '#f4cdcd',
        borderColor : '#737373',
        //borderWidth : 1,
        borderRadius : 10,
        width: "60%",
    },
    buttonLabel: {
        color : '#312929',
        fontWeight : 'bold',
        textAlign : 'center',
        padding: 10,
        fontSize: 16,
    },
});