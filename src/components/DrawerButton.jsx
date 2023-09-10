import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DrawerButton() {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={()=>{navigation.openDrawer()}} style={styles.container}>
            <Text style={styles.label}>≡</Text>    
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 4,
    },
    label: {
        fontSize: 30,
        color: 'rgba(103, 103, 103, 0.7)',
    },
});
