import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import firebase from 'firebase';
import { openDatabase } from 'expo-sqlite';

// SQLiteデータベースに接続
const db = openDatabase('DB.db'); // データベース名を適切に設定

//＝＝＝＝＝＝＝＝
// Context
//＝＝＝＝＝＝＝＝
const BabyContext = createContext();

export function useBabyContext() {
    return useContext(BabyContext);
}

export function BabyProvider({ children }) {
    const [baby, setBaby] = useState('');

    // initialStateをuseMemoでキャッシュ
    const initialState = useMemo(() => {
        return {
            baby: baby,
        };
    }, [baby]);

    useEffect(() => {
        const db = firebase.firestore();
        let unsubscribedBaby = firebase.auth().onAuthStateChanged((user) => {
            
            if (user) {
                const babyRef = db.collection(`users/${user.uid}/babyData`);

                unsubscribedBaby = babyRef.onSnapshot((babySnapshot) => {
                    setBaby(babySnapshot);
                }, (babyError) => {
                    console.log(babyError);
                    Alert.alert('babyデータの読み込みに失敗しました。');
                });
            }
        });
        return () => {
            unsubscribedBaby();
        };
    }, []);

    return (
        <BabyContext.Provider value={initialState}>
            {children}
        </BabyContext.Provider>
    );
}
