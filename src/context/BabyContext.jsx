import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import firebase from 'firebase';

//＝＝＝＝＝＝＝＝
// Context
//＝＝＝＝＝＝＝＝
const BabyContext = createContext();

export function useBabyContext() {
    return useContext(BabyContext);
}

export function BabyProvider({ children }) {
    const [baby, setBaby] = useState('');
    const [currentBaby, setCurrentBaby] = useState('');

    // unsubscribedCurrentBaby を定義
    let unsubscribedCurrentBaby;

    // initialStateをuseMemoでキャッシュ
    const initialState = useMemo(() => {
        return {
            baby: baby,
            currentBaby: currentBaby,
        };
    }, [baby, currentBaby]);

    useEffect(() => {
        const db = firebase.firestore();
        let unsubscribedBaby = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const babyRef = db.collection(`users/${user.uid}/babyData`);
                const currentBabyRef = db.collection(`users/${user.uid}/currentBaby`);

                unsubscribedBaby = babyRef.onSnapshot((babySnapshot) => {
                    setBaby(babySnapshot);

                    // currentBabyコレクションも監視
                    // unsubscribedCurrentBaby の初期化
                    unsubscribedCurrentBaby = currentBabyRef.onSnapshot((currentBabySnapshot) => {
                        setCurrentBaby(currentBabySnapshot);
                    }, (currentBabyError) => {
                        console.log(currentBabyError);
                        Alert.alert('currentBabyデータの読み込みに失敗しました。');
                    });
                }, (babyError) => {
                    console.log(babyError);
                    Alert.alert('babyデータの読み込みに失敗しました。');
                });
            }
        });
        return () => {
            unsubscribedBaby();
            
            // クリーンアップ時にunsubscribedCurrentBabyも呼び出す
            if (unsubscribedCurrentBaby) {
                unsubscribedCurrentBaby();
            }
        };
    }, []);

    return (
        <BabyContext.Provider value={initialState}>
            {children}
        </BabyContext.Provider>
    );
}
