import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Button } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 

import firebase from 'firebase';
import { firebaseConfig } from './env';

import MainScreen from './src/screens/MainScreen';
import DetailScreen from './src/screens/DetailScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import TestScreen from './src/screens/TestScreen';
import AcountScreen from './src/screens/AcountScreen';
import BabySettingScreen from './src/screens/BabySettingScreen';
import RecordScreen from './src/screens/RecordScreen';

import { UserProvider } from './src/context/UserContext';
import { BabyProvider } from './src/context/BabyContext';
import { CurrentBabyProvider } from './src/context/CurrentBabyContext';
import { BabyRecordProvider } from './src/context/BabyRecordContext';
import { DateTimeProvider } from './src/context/DateTimeContext';

require('firebase/firestore');

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

function HomeDrawer() {
  return (
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
  );
}

function AcountDrawer() {
  return (
    <UserProvider>
    <DateTimeProvider>
      <View style={{ flex: 1 }}>
        <Stack.Navigator
          initialRouteName="Acount"
          screenOptions={{
            headerStyle: { backgroundColor: "#FFDB59" },
            headerTitleStyle: { color: "#111111"},
            headerTitle: 'Baby App',
            headerTintColor: '#111111',
            headerBackTitle: 'back',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        >
          <Stack.Screen
            name="Acount"
            component={AcountScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
              gestureEnabled: true,
              gestureDirection: 'horizontal',
            }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
            }}
          />
        </Stack.Navigator>
      </View>
    </DateTimeProvider>
    </UserProvider>
  );
}

function BabySettingDrawer() {
  return (
    <UserProvider>
    <BabyProvider>
    <CurrentBabyProvider>
    <DateTimeProvider>
      <View style={{ flex: 1 }}>
        <Stack.Navigator
          initialRouteName="BabySetting"
          screenOptions={{
            headerStyle: { backgroundColor: "#FFDB59" },
            headerTitleStyle: { color: "#111111"},
            headerTitle: 'Baby App',
            headerTintColor: '#111111',
            headerBackTitle: 'back',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        >
          <Stack.Screen
            name="BabySetting"
            component={BabySettingScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
              gestureEnabled: true,
              gestureDirection: 'horizontal',
            }}
          />
        </Stack.Navigator>
      </View>
    </DateTimeProvider>
    </CurrentBabyProvider>
    </BabyProvider>
    </UserProvider>
  );
}

function TestDrawer({ navigation }) {
  console.log()
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Homeへ戻る" />
    </View>
  );
}

function RightTab() {
    return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerStyle: { backgroundColor: "#FFDB59" },
          headerTitleStyle: { color: "#111111"},
          headerTitle: 'Baby App',
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

function CenterTab() {
  return (
  <View style={{ flex: 1 }}>
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerStyle: { backgroundColor: "#FFDB59" },
        headerTitleStyle: { color: "#111111"},
        headerTitle: 'Baby App',
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
          headerTitle: 'Baby App',
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
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
      initialRouteName="Home"
      drawerType="slide"
      edgeWidth="500"
      useLegacyImplementation
      drawerStyle={{
        //backgroundColor: '#c6cbef',
        width: 250,
        marginTop: "30%"
      }}
      drawerContentOptions={{
        //activeTintColor: "#e91e63",
        itemStyle: { marginVertical: 10 },
      }}
    >
        <Drawer.Screen
          name="Home"
          component={HomeDrawer}
          options={{
            //gestureEnabled: false
            drawerIcon: ({focused, size}) => (
              <MaterialCommunityIcons name="home-outline" size={24} color={focused ? '#7cc' : '#ccc'} />
            ),
          }}
        />
        <Drawer.Screen
          name="Acount"
          component={AcountDrawer}
          options={{
            //gestureEnabled: false
            drawerIcon: ({focused, size}) => (
              <MaterialCommunityIcons name="account-outline" size={24} color={focused ? '#7cc' : '#ccc'} />
            ),
          }}
        />
        <Drawer.Screen
          name="BabySetting"
          component={BabySettingDrawer}
          options={{
            //gestureEnabled: false
            drawerIcon: ({focused, size}) => (
              <MaterialCommunityIcons name="baby-face-outline" size={24} color={focused ? '#7cc' : '#ccc'} />
            ),
          }}
        />
        <Drawer.Screen
          name="Setting"
          component={TestDrawer}
          options={{
            //gestureEnabled: false
            drawerIcon: ({focused, size}) => (
              <Ionicons name="settings-outline" size={24} color={focused ? '#7cc' : '#ccc'} />
            ),
          }}
        />
        <Drawer.Screen
          name="Contact"
          component={TestDrawer}
          options={{
            //gestureEnabled: false
            drawerIcon: ({focused, size}) => (
              <Ionicons name="mail-outline" size={24} color={focused ? '#7cc' : '#ccc'} />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}