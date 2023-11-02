import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import ModalCalendar from './ModalCalendar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useDateTimeContext } from '../context/DateTimeContext';

export default function Datetime() {

    const { dateTimeState, dateTimeDispatch } = useDateTimeContext();
    const dayOfWeek = [ "日", "月", "火", "水", "木", "金", "土" ] ;

    return (
        <View style={styles.date}>
            <TouchableOpacity onPress={() => dateTimeDispatch({ type: "decrement", year: dateTimeState.year, month: dateTimeState.month, day: dateTimeState.day, youbiCount: dateTimeState.youbiCount })} style={styles.dateText}>
                <MaterialCommunityIcons name={'chevron-left'} size={35} color="#737373" />
            </TouchableOpacity>
            <View style={styles.dateText}>
                <ModalCalendar />
            </View>
            <TouchableOpacity onPress={() => dateTimeDispatch({ type: "increment", year: dateTimeState.year, month: dateTimeState.month, day: dateTimeState.day, youbiCount: dateTimeState.youbiCount})} style={styles.dateText}>
                <MaterialCommunityIcons name={'chevron-right'} size={35} color="#737373" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    date: {
        flexDirection: 'row',
        height: 60,
        width: '90%',
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor : '#FFF',
        borderColor : '#737373',
        borderWidth : 1,
        borderRadius : 10,
    },
    dateText: {
        paddingHorizontal: 5,
    },
    cursorText: {
        fontSize: 40,
    },
});