import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../page/Home/HomeScreen';
import UploadScreen from '../page/Upload/UploadScreen';

// Definir el tipo de las rutas
type TabParamList = {
  Inicio: undefined;
  Añadir: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// Función para definir screenOptions
const getScreenOptions = ({ route }: { route: { name: keyof TabParamList } }): BottomTabNavigationOptions => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconName: string;
    switch (route.name) {
      case 'Inicio':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'Añadir':
        iconName = focused ? 'add-circle' : 'add-circle-outline';
        break;
      default:
        iconName = 'help-circle-outline';
    }
    return <Icon name={iconName} size={size} color={color} />;
  },
  tabBarActiveTintColor: 'white',
  tabBarInactiveTintColor: 'black',
  tabBarStyle: { backgroundColor: '#82A6C3' }, // Navegación inferior
  headerStyle: { backgroundColor: '#82A6C3' }, // Barra superior
  headerTintColor: 'white', // Color del texto en la barra superior
});

const AppRoutes = () => (
  <NavigationContainer>
    <Tab.Navigator screenOptions={getScreenOptions} id={undefined}>
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Añadir" component={UploadScreen} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default AppRoutes;
