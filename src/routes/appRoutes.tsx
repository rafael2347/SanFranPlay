import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../page/Home/HomeScreen';
import UploadScreen from '../page/Upload/UploadScreen';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Añadir') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }
          const iconSize = size + 5;
          return <Icon name={iconName} size={iconSize} color={color} />;
        },
        tabBarLabelStyle: {
            fontSize: 18, // Este es el tamaño reducido para el texto
            fontWeight: 'normal', // Puedes ajustar el peso de la fuente si lo deseas
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: styles.tabBar,
        headerStyle: styles.header,
        headerTintColor: 'white',
        headerTitleStyle: styles.headerTitle,
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="Añadir" component={UploadScreen} options={{ title: 'Añadir' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#aec4db',
    fontSize: 20,
    
  },
  header: {
    backgroundColor: '#aec4db',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default function AppRoutes() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
