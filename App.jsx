import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import firebase from 'firebase';
import { firebaseConfig } from './env';
import { openDatabase } from 'expo-sqlite';

import MainScreen from './src/screens/MainScreen';
import DetailScreen from './src/screens/DetailScreen';
import RecordScreen from './src/screens/RecordScreen';

import SettingScreen from './src/screens/SettingScreen';
import MailChangeScreen from './src/screens/MailChangeScreen';
import PasswordChangeScreen from './src/screens/PasswordChangeScreen';
import PasswordResetRequestScreen from './src/screens/PasswordChangeRequestScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import LogInScreen from './src/screens/LogInScreen';
import AcountScreen from './src/screens/AcountScreen';
import BabyAddScreen from './src/screens/BabyAddScreen';
import BabyListScreen from './src/screens/BabyListScreen';
import BabyEditScreen from './src/screens/BabyEditScreen';
import BabySettingScreen from './src/screens/BabySettingScreen';
import ContactFormScreen from './src/screens/ContactFormScreen';
import BackupScreen from './src/screens/BackupScreen';

import TestScreen from './src/screens/TestScreen';

import { UserProvider } from './src/context/UserContext';
import { BabyProvider } from './src/context/BabyContext';
import { CurrentBabyProvider } from './src/context/CurrentBabyContext';
import { BabyRecordProvider } from './src/context/BabyRecordContext';
import { DateTimeProvider } from './src/context/DateTimeContext';

require('firebase/firestore');

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

function RightTab() {
    return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName="Setting"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f4cdcd",
            //backgroundColor: "#F97773",
            //backgroundColor: '#F0F4F8',
            shadowOpacity: 0, // 影を削除
            borderBottomWidth: 0, // ボーダーを削除
          },
          //headerTitleStyle: { color: "#FFFFFF"},
          headerTitle: 'koala',
          headerTintColor: '#111111',
          headerBackTitle: 'back',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Stack.Screen name="Setting"
          component={SettingScreen}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
          />
        <Stack.Screen name="Acount" component={AcountScreen} />
        <Stack.Screen name="MailChange" component={MailChangeScreen} />
        <Stack.Screen name="PasswordChange" component={PasswordChangeScreen} />
        <Stack.Screen name="PasswordResetRequest" component={PasswordResetRequestScreen} />
        <Stack.Screen name="BabySetting" component={BabySettingScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="LogIn" component={LogInScreen} />
        <Stack.Screen name="ContactForm" component={ContactFormScreen} />
        <Stack.Screen name="BabyAdd" component={BabyAddScreen} />
        <Stack.Screen name="BabyList" component={BabyListScreen} />
        <Stack.Screen name="BabyEdit" component={BabyEditScreen} />
        <Stack.Screen name="Backup" component={BackupScreen} />
        <Stack.Screen name="Test" component={TestScreen} />

      </Stack.Navigator>
    </View>
  );
}

function CenterTab() {
  return (
  <View style={{ flex: 1 }}>
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4cdcd",
          //backgroundColor: "#FFDB59",
          //backgroundColor: "#F97773",
          //backgroundColor: '#F0F4F8',
          shadowOpacity: 0, // 影を削除
          borderBottomWidth: 0, // ボーダーを削除
        },
        headerTitleStyle: { fontSize: 20 },
        headerTitle: 'koala',
        headerTintColor: '#111111',
        headerBackTitle: 'back',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="Main"
        component={MainScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
        />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="BabyAdd" component={BabyAddScreen} />
      <Stack.Screen name="Test" component={TestScreen} />
    </Stack.Navigator>
  </View>
);
}

function LeftTab() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName="Record"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f4cdcd",
            //backgroundColor: "#F97773",
            //backgroundColor: '#F0F4F8',
            shadowOpacity: 0, // 影を削除
            borderBottomWidth: 0, // ボーダーを削除
          },
          //headerTitleStyle: { color: "#FFFFFF"},
          headerTitle: 'koala',
          headerTintColor: '#111111',
          headerBackTitle: 'back',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Stack.Screen name="Record"
          component={RecordScreen}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
          />
      </Stack.Navigator>
    </View>
  );
}

const HomeIcon = ({ focused, size }) => (
  <MaterialCommunityIcons name="home-outline" size={30} color={focused ? '#737373' : '#ccc'}/>
);

const DataIcon = ({ focused, size }) => (
  <MaterialCommunityIcons name="note-text-outline" size={30} color={focused ? '#737373' : '#ccc'}/>
);

const SettingIcon = ({ focused, size }) => (
  <Ionicons name="settings-outline" size={30} color={focused ? '#737373' : '#ccc'}/>
);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  const [currentBaby, setCurrentBaby] = useState('');

  useEffect(() => {
    const db = openDatabase('BABY.db');
    db.transaction((tx) => {
      tx.executeSql(
        'PRAGMA table_info(current_baby);',
        [],
        (_, { rows }) => {
        if (rows.length > 0) {
            // テーブルが存在する場合のみSELECT文を実行
            tx.executeSql(
              'SELECT * FROM current_baby LIMIT 1',
              [],
              (_, result) => {
              const data = result.rows.item(0);
              setCurrentBaby(data)
              },
              (_, error) => {
              console.error('データの取得中にエラーが発生しました:', error);
              }
          );
        } else {
          //console.log('ToiletRecordテーブルが存在しません');
        }
        },
        (_, error) => {
        console.error('テーブルの存在確認中にエラーが発生しました:', error);
        }
      );
      
    });
  }, []); // 初回のみ実行

  const hideTabs = currentBaby === null || currentBaby === undefined;

  //const hideTabs = ""
  return (
    <NavigationContainer>
      <UserProvider>
      <BabyProvider>
      <CurrentBabyProvider>
      <DateTimeProvider>
      <BabyRecordProvider>
        <Tab.Navigator
          initialRouteName="ホーム"
          //screenOptions={{ tabBarVisible: !hideTabs }}
        >
          <Tab.Screen
            name="記録"
            component={LeftTab}
            options={{
              tabBarIcon: DataIcon,
              title: '',
            }}
          />
          <Tab.Screen
            name="ホーム"
            component={CenterTab}
            options={{
              tabBarIcon: HomeIcon,
              title: '',
            }}
          />
          <Tab.Screen
            name="設定"
            component={RightTab}
            options={{
              tabBarIcon: SettingIcon,
              title: '',
            }}
          />
        </Tab.Navigator>
      </BabyRecordProvider>
      </DateTimeProvider>
      </CurrentBabyProvider>
      </BabyProvider>
      </UserProvider>
    </NavigationContainer>
  );
}