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
    const [currentBaby, setCurrentBaby] = useState('');
    const [currentBaby2, setCurrentBaby2] = useState('');

    // unsubscribedCurrentBaby を定義
    let unsubscribedCurrentBaby;

    // initialStateをuseMemoでキャッシュ
    const initialState = useMemo(() => {
        return {
            baby: baby,
            currentBaby: currentBaby,
            currentBaby2: currentBaby2,
        };
    }, [baby, currentBaby, currentBaby2]);

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

    // コンポーネントがマウントされたときにSQLiteからデータを取得し、Contextを更新
    useEffect(() => {
        db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM currentBaby LIMIT 1',
            [],
            (_, result) => {
            const data = result.rows.item(0);
            if (data) {
                //currentBabyDispatch({
                //  type: 'addBaby',
                //  name: data.name,
                //  birthday: data.birthday,
                //  id: data.Id,
                //});
                setCurrentBaby2(data)
                console.log(currentBabySnapshot)
            }
            },
            (_, error) => {
            console.error('データの取得中にエラーが発生しました:', error);
            }
        );
        });
    }, []); // 初回のみ実行

    return (
        <BabyContext.Provider value={initialState}>
            {children}
        </BabyContext.Provider>
    );
}
