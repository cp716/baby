import React, { createContext, useContext, useState, useEffect, useReducer }  from 'react';
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
    const initialState = {
        baby : baby,
    };

    useEffect(() => {
        const db =firebase.firestore();
        let unsubscribed = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                //const ref = db.collection(`users/${user.uid}/baby`).orderBy('updatedAt', 'asc');
                //const refs = db.collection(`users/${currentUser.uid}/babyData`)
                const ref = db.collection(`users/${user.uid}/babyData`)//.orderBy('updatedAt', 'asc');
                unsubscribed = ref.onSnapshot((snapshot) => {
                    setBaby(snapshot);
                }, (error) => {
                console.log(error);
                Alert.alert('データの読み込みに失敗しました。');
                });
            }
        });
        return () => {
            unsubscribed();
        };
    },[]);

    return (
        <BabyContext.Provider value={initialState}>
            {children}
        </BabyContext.Provider>
    );
}
