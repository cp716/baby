import React, { createContext, useReducer, useContext }  from 'react';
import storage from './Storage';

//＝＝＝＝＝＝＝＝
// Context
//＝＝＝＝＝＝＝＝
const BabyRecordContext = createContext();

export function useBabyRecordContext() {
    return useContext(BabyRecordContext);
}

export function BabyRecordProvider({ children }) {
    
    //＝＝＝＝＝＝＝＝
    // 初期値設定
    //＝＝＝＝＝＝＝＝
        const initialState = {
        babyData: '',
    };

    const reducer = (state, action) => {

        //＝＝＝＝＝＝＝＝
        // 赤ちゃんの記録を返す
        //＝＝＝＝＝＝＝＝
        if (action.type == "return") {
        
            state.babyData = action.data
        
        return { babyData: state.babyData };
        };
    };
    
    const [babyRecordState, babyRecordDispatch] = useReducer(reducer, initialState);

    return (
        <BabyRecordContext.Provider value={{babyRecordState, babyRecordDispatch}}>
        {children}
        </BabyRecordContext.Provider>
    );
    
}
