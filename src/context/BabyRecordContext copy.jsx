import React, { createContext, useContext, useState, useEffect }  from 'react';
import firebase from 'firebase';
import storage from './Storage';
import { useCurrentBabyContext } from './CurrentBabyContext';
import { useDateTimeContext } from './DateTimeContext';
//＝＝＝＝＝＝＝＝
// Context
//＝＝＝＝＝＝＝＝
const BabyRecordContext = createContext();

export function useBabyRecordContext() {
    return useContext(BabyRecordContext);
}

export function BabyRecordProvider({ children }) {

    const { currentBabyState } = useCurrentBabyContext();
    const { dateTimeState } = useDateTimeContext();

    const [babyIdData, setBabyIdData] = useState('');
    const [babyRecord, setBabyRecord] = useState('');
    const initialState = {
        babyRecord : babyRecord,
    };

    useEffect(() => {
        storage.load({
            key : 'selectbaby',
        }).then(data => {
            // 読み込み成功時処理
            setBabyIdData(data.babyId)
        }).catch(err => {
            // 読み込み失敗時処理
            console.log(err)
        });
    }, [currentBabyState]);

    useEffect(() => {
        const cleanupFuncs = {
            auth: () => {},
            memos: () => {},
        };
        cleanupFuncs.auth = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                if(babyIdData !== '') {
                    const db = firebase.firestore();
                    const ref = db.collection(`users/${user.uid}/babyData`).doc(babyIdData)
                    .collection(`${dateTimeState.year}_${dateTimeState.month}`).orderBy('updatedAt', 'asc'); // サブコレクションであるprefecturesがない場合、自動でリストが生成される。
                    cleanupFuncs.memos = ref.onSnapshot((snapshot) => {
                        setBabyRecord(snapshot);
                    }, 
                    (error) => {
                        console.log(error);
                        Alert.alert('データの読み込みに失敗しました。');
                    });
                }
            }
        });
        return () => {
            cleanupFuncs.auth();
            cleanupFuncs.memos();
        };
    }, [babyIdData, dateTimeState]);
    

    return (
        <BabyRecordContext.Provider value={initialState}>
            {children}
        </BabyRecordContext.Provider>
    );
}
