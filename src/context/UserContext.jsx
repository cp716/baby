import React, { createContext, useContext, useState, useEffect }  from 'react';
import firebase from 'firebase';

//＝＝＝＝＝＝＝＝
// Context
//＝＝＝＝＝＝＝＝
const UserContext = createContext();

export function useUserContext() {
    return useContext(UserContext);
}

export function UserProvider({ children }) {

    const [user, setUser] = useState('');
    const value = {
        user,
    };

    useEffect(() => {
        const unsubscribed = firebase.auth().onAuthStateChanged((user) => {
            setUser(user);
        });

        return () => {
            unsubscribed();
        };
    },[]);

    return (
        <UserContext.Provider value = {value}>
            {children}
        </UserContext.Provider>
    );

}
