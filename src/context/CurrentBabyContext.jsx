import React, { createContext, useReducer, useContext }  from 'react';
import storage from './Storage';

//＝＝＝＝＝＝＝＝
// Context
//＝＝＝＝＝＝＝＝
const CurrentBabyContext = createContext();

export function useCurrentBabyContext() {
  return useContext(CurrentBabyContext);
}

export function CurrentBabyProvider({ children }) {
  
  //＝＝＝＝＝＝＝＝
  // 初期値設定
  //＝＝＝＝＝＝＝＝
    const initialState = {
      babyName: '',
      babyBirthday: '',
      babyId: '',
  };

  const reducer = (state, action) => {

    //＝＝＝＝＝＝＝＝
    // 設定中赤ちゃん変更処理
    //＝＝＝＝＝＝＝＝
    if (action.type == "addBaby") {
      storage.save({
        key: 'selectbaby',
        data: {
            babyName : action.babyName,
            babyId : action.babyId,
            babyBirthday: new Date(action.babyBirthday)
        },
      })
      if (action.babyName != null && action.babyBirthday != null && action.babyId != null ) {
        state.babyName = action.babyName;
        state.babyBirthday = action.babyBirthday;
        state.babyId = action.babyId;
      };
      return { babyName: state.babyName, babyBirthday: state.babyBirthday, babyId: state.babyId };
    };
  };
  
  const [currentBabyState, currentBabyDispatch] = useReducer(reducer, initialState);

  return (
    <CurrentBabyContext.Provider value={{currentBabyState, currentBabyDispatch}}>
      {children}
    </CurrentBabyContext.Provider>
  );
  
}
