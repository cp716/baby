import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Button } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 

import firebase from 'firebase';
import { firebaseConfig } from './env';

import MainScreen from './src/screens/MainScreen';
import DetailScreen from './src/screens/DetailScreen';
import RecordScreen from './src/screens/RecordScreen';

import SettingScreen from './src/screens/SettingScreen';
import MailChangeScreen from './src/screens/MailChangeScreen';
import PasswordChangeScreen from './src/screens/PasswordChangeScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import LogInScreen from './src/screens/LogInScreen';
import TestScreen from './src/screens/TestScreen';
import AcountScreen from './src/screens/AcountScreen';
import BabyAddScreen from './src/screens/BabyAddScreen';
import BabyEditScreen from './src/screens/BabyEditScreen';
import BabySettingScreen from './src/screens/BabySettingScreen';
import ContactFormScreen from './src/screens/ContactFormScreen';

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
          headerStyle: { backgroundColor: "#FFDB59" },
          headerTitleStyle: { color: "#111111"},
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
        <Stack.Screen name="BabySetting" component={BabySettingScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="LogIn" component={LogInScreen} />
        <Stack.Screen name="ContactForm" component={ContactFormScreen} />
        <Stack.Screen name="BabyAdd" component={BabyAddScreen} />
        <Stack.Screen name="BabyEdit" component={BabyEditScreen} />
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
        headerStyle: { backgroundColor: "#FFDB59" },
        headerTitleStyle: { color: "#111111"},
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
          headerStyle: { backgroundColor: "#FFDB59" },
          headerTitleStyle: { color: "#111111"},
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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <UserProvider>
      <BabyProvider>
      <CurrentBabyProvider>
      <DateTimeProvider>
      <BabyRecordProvider>
        <Tab.Navigator initialRouteName="メイン">
          <Tab.Screen
            name="記録"
            component={LeftTab}
            options={{
              tabBarIcon: ({ focused, size }) => (
                <MaterialCommunityIcons name="note-text-outline" size={24} color={focused ? '#7cc' : '#ccc'}/>
              ),
            }}
          />
          <Tab.Screen
            name="メイン"
            component={CenterTab}
            options={{
              tabBarIcon: ({ focused, size }) => (
                <MaterialCommunityIcons name="home-outline" size={24} color={focused ? '#7cc' : '#ccc'}/>
              ),
            }}
          />
          <Tab.Screen
            name="設定"
            component={RightTab}
            options={{
              tabBarIcon: ({ focused, size }) => (
                <Ionicons name="settings-outline" size={24} color={focused ? '#7cc' : '#ccc'}/>
              ),
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