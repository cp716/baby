import React, { createContext, useReducer, useContext }  from 'react';

//＝＝＝＝＝＝＝＝
// Context
//＝＝＝＝＝＝＝＝
const DateTimeContext = createContext();

export function useDateTimeContext() {
  return useContext(DateTimeContext);
}

export function DateTimeProvider({ children }) {
  
  //＝＝＝＝＝＝＝＝
  // 初期値設定
  //＝＝＝＝＝＝＝＝
  const date = new Date(Math.floor(new Date().getTime()/1000/60/5)*1000*60*5);
  const initialState = {
    year: Number(date.getFullYear()),
    month: Number(date.getMonth() + 1),
    day: Number(date.getDate()),
    hours: Number(date.getHours()),
    minutes: Number(date.getMinutes()),
    youbiCount: Number(date.getDay()),
  };

  const reducer = (state, action) => {

    const startDate = new Date(action.year, action.month-1, 1) // 月の最初の日を取得
    const startDayCount = startDate.getDate() // 月の末日
    var endDate = new Date(action.year, action.month, 0) // 月の最後の日を取得
    var endDayCount = endDate.getDate() // 月の末日

    //＝＝＝＝＝＝＝＝
    // 日付変更処理
    //＝＝＝＝＝＝＝＝
    if (action.type == "increment") {
      if (action.day != null) {
        state.day = action.day + 1;
        state.youbiCount = action.youbiCount + 1;
        //末日の場合は翌月の1日に設定する
        if (state.day > endDayCount) {
          state.day = 1;
          if (action.month < 12) {
            state.month = action.month + 1;
          } else if (action.month = 12){
            state.month =  1;
            state.year = action.year + 1;
          }
        };
        //土曜日の場合は日曜日に設定
        if (state.youbiCount >= 7) {
          state.youbiCount = 0;
        }
      };
      //state.date = year + "-" + month + "-" + day;
      return { year: state.year, month: state.month, day: state.day, hours: state.hours, minutes: state.minutes, youbiCount: state.youbiCount };
    } else if (action.type == "decrement") {
      if (action.day != null) {
        state.day = action.day - 1;
        state.youbiCount = action.youbiCount - 1;
        // 前の月の場合は前月の末尾を取得する
        if (state.day < 1) {
          endDate = new Date(action.year, action.month-1, 0) // 前月の最後の日を取得
          endDayCount = endDate.getDate() // 前月の末日
          state.day = endDayCount;
          if (action.month > 1) {
            state.month = action.month - 1;
          } else if (action.month = 1){
            state.month = 12;
            state.year = action.year - 1;
          }
        }
        //日曜日の場合は土曜日に戻る
        if (state.youbiCount <= -1) {
          state.youbiCount = 6;
        }
      };
      return { year: state.year, month: state.month, day: state.day, hours: state.hours, minutes: state.minutes, youbiCount: state.youbiCount };
    };

    //＝＝＝＝＝＝＝＝
    // 時間変更処理
    //＝＝＝＝＝＝＝＝
    if (action.type == "timeUpdate") {
      if (action.hours != null && action.minutes != null ) {
        state.hours = action.hours;
        state.minutes = action.minutes;
      };
      return { year: state.year, month: state.month, day: state.day, hours: state.hours, minutes: state.minutes, youbiCount: state.youbiCount };
    };

    //＝＝＝＝＝＝＝＝
    // カレンダー日付変更処理
    //＝＝＝＝＝＝＝＝
    if (action.type == "selectDate") {
      if (action.year != null && action.month != null && action.day != null ) {
        state.year = action.year;
        state.month = action.month;
        state.day = action.day;
        state.youbiCount = action.timestamp.getDay()
      };
      return { year: state.year, month: state.month, day: state.day, hours: state.hours, minutes: state.minutes, youbiCount: state.youbiCount };
    };

    //＝＝＝＝＝＝＝＝
    // スワイパー日付変更処理
    //＝＝＝＝＝＝＝＝
    if (action.type == "slideMonth") {
      state.day = state.day - 1;
      state.youbiCount = state.youbiCount - 1;
      // 前の月の場合は前月の末尾を取得する
      endDate = new Date(state.year, state.month-1, 0) // 前月の最後の日を取得
      endDayCount = endDate.getDate() // 前月の末日
      state.day = endDayCount;
      if (state.month > 1) {
        state.month = state.month - 1;
      } else if (state.month = 1){
        state.month = 12;
        state.year = state.year - 1;
      }
      //日曜日の場合は土曜日に戻る
      if (state.youbiCount <= -1) {
        state.youbiCount = 6;
      }
      return { year: state.year, month: state.month, day: state.day, hours: state.hours, minutes: state.minutes, youbiCount: state.youbiCount };
    }
    if (action.type == "slideDay") {
      state.day = state.day - 1;
      state.youbiCount = state.youbiCount - 1;
      //日曜日の場合は土曜日に戻る
      if (state.youbiCount <= -1) {
        state.youbiCount = 6;
      }
      return { year: state.year, month: state.month, day: state.day, hours: state.hours, minutes: state.minutes, youbiCount: state.youbiCount };
    }
  };
  
  const [dateTimeState, dateTimeDispatch] = useReducer(reducer, initialState);
  
  return (
    <DateTimeContext.Provider value={{dateTimeState, dateTimeDispatch}}>
      {children}
    </DateTimeContext.Provider>
  );
  
}
