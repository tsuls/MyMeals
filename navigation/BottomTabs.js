import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GroceryListScreen from '../modules/groceries/screens/GroceryListScreen';
import MealsScreen from '../modules/meals/screens/MealsScreen';
import DailyLogScreen from '../modules/daily-log/screens/DailyLogScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let icon;
          if (route.name === 'Daily Log') icon = 'calendar-check';
          if (route.name === 'My Groceries') icon = 'cart-outline';
          if (route.name === 'My Meals') icon = 'silverware-fork-knife';
          return <MaterialCommunityIcons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Daily Log" component={DailyLogScreen} />
      <Tab.Screen name="My Groceries" component={GroceryListScreen} />
      <Tab.Screen name="My Meals" component={MealsScreen} />
    </Tab.Navigator>
  );
}
