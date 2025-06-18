import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GroceryProvider } from './context/GroceryContext';
import BottomTabs from './navigation/BottomTabs';

export default function App() {
  return (
    <GroceryProvider>
      <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
    </GroceryProvider>
  );
}
