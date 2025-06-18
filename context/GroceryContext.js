import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GroceryContext = createContext();

export const GroceryProvider = ({ children }) => {
  const [groceryList, setGroceryList] = useState([]);

  // Load on mount
  useEffect(() => {
    const loadGroceries = async () => {
      try {
        const saved = await AsyncStorage.getItem('groceryList');
        if (saved) {
          setGroceryList(JSON.parse(saved));
          console.log('Loaded grocery list:', JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load groceries:', e);
      }
    };
    loadGroceries();
  }, []);

  // Save on change
  useEffect(() => {
    const saveGroceries = async () => {
      try {
        await AsyncStorage.setItem('groceryList', JSON.stringify(groceryList));
        console.log('Saved grocery list:', groceryList);
      } catch (e) {
        console.error('Failed to save groceries:', e);
      }
    };
    saveGroceries();
  }, [groceryList]);

  const addGroceryItem = (item) => {
    setGroceryList(prev => [...prev, item]);
  };

  const removeGroceryItem = (id) => {
    setGroceryList(prev => prev.filter(item => item.id !== id));
  };

  const updateGroceryItem = (id, updatedItem) => {
    setGroceryList(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updatedItem } : item))
    );
  };

  return (
    <GroceryContext.Provider value={{
      groceryList,
      addGroceryItem,
      removeGroceryItem,
      updateGroceryItem
    }}>
      {children}
    </GroceryContext.Provider>
  );
};

export const useGrocery = () => useContext(GroceryContext);
