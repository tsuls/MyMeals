import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGrocery } from '../../../context/GroceryContext';
import { generateRecipes } from '../../../services/generateRecipes';

export default function MealsScreen() {
  const { groceryList } = useGrocery();

  const [meals, setMeals] = useState([]);
  const [generatedMeals, setGeneratedMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [notes, setNotes] = useState('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);

  useEffect(() => {
    const loadMeals = async () => {
      const saved = await AsyncStorage.getItem('meals');
      if (saved) setMeals(JSON.parse(saved));
    };
    loadMeals();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('meals', JSON.stringify(meals));
  }, [meals]);

  const handleGenerateRecipes = async () => {
    setLoadingRecipes(true);
    setRecipeModalVisible(true);
    const result = await generateRecipes(groceryList);
    setGeneratedMeals(result);
    setLoadingRecipes(false);
  };

  const saveGeneratedMeal = (meal) => {
    // Don't add duplicate
    if (meals.some((m) => m.name === meal.name)) return;
    const newMeal = {
      id: Date.now().toString(),
      name: meal.name,
      ingredients: meal.ingredients.map((name, index) => ({
        id: `${meal.name}-${index}`,
        name,
        quantity: '',
        unit: ''
      })),
      nutrition: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      },
      notes: ''
    };
    setMeals([...meals, newMeal]);
  };

  const handleSaveNotes = () => {
    // Only update notes for this meal, don't duplicate it
    setMeals(meals =>
      meals.map(m =>
        m.id === selectedMeal.id ? { ...m, notes } : m
      )
    );
    setDetailModalVisible(false);
    setSelectedMeal(null);
  };

  const handleCloseDetail = () => {
    setDetailModalVisible(false);
    setSelectedMeal(null);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No meals added yet.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.mealBox}
            onPress={() => {
              setSelectedMeal(item);
              setNotes(item.notes || '');
              setDetailModalVisible(true);
            }}
          >
            <Text style={styles.mealName}>{item.name}</Text>
            <Text style={styles.macros}>
              {item.nutrition.calories} kcal / P: {item.nutrition.protein}g / C: {item.nutrition.carbs}g / F: {item.nutrition.fat}g
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.footer}>
        <Button
          title={loadingRecipes ? 'Generating recipes...' : 'Find Recipes from My Groceries'}
          onPress={handleGenerateRecipes}
          disabled={loadingRecipes}
        />
      </View>

      {/* Generated recipes modal */}
      <Modal visible={recipeModalVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <Button title="Close" onPress={() => setRecipeModalVisible(false)} />
          </View>
          {loadingRecipes ? (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          ) : (
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              {generatedMeals.map((meal, idx) => (
                <View key={idx} style={styles.card}>
                  <Text style={styles.cardTitle}>{meal.name}</Text>
                  <Text style={styles.cardSubtitle}>Ingredients:</Text>
                  {meal.ingredients.map((ing, i) => (
                    <Text key={i} style={styles.cardText}>• {ing}</Text>
                  ))}
                  <Text style={styles.cardSubtitle}>Instructions:</Text>
                  {meal.instructions.map((step, i) => (
                    <Text key={i} style={styles.cardText}>{i + 1}. {step}</Text>
                  ))}
                  <Button title="Save to My Meals" onPress={() => saveGeneratedMeal(meal)} />
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Meal detail modal */}
      <Modal visible={detailModalVisible} animationType="slide" onRequestClose={handleCloseDetail}>
        <View style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <Button title="Close" onPress={handleCloseDetail} />
          </View>
          {selectedMeal && (
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>{selectedMeal.name}</Text>
              <Text style={{ fontWeight: '600', marginBottom: 5 }}>Ingredients:</Text>
              {selectedMeal.ingredients.map((i, idx) => (
                <Text key={idx}>• {i.name}</Text>
              ))}
              <Text style={{ fontWeight: '600', marginTop: 10 }}>Nutrition:</Text>
              <Text>Calories: {selectedMeal.nutrition.calories}</Text>
              <Text>Protein: {selectedMeal.nutrition.protein}g</Text>
              <Text>Carbs: {selectedMeal.nutrition.carbs}g</Text>
              <Text>Fat: {selectedMeal.nutrition.fat}g</Text>
              <Text style={{ fontWeight: '600', marginTop: 10 }}>Notes:</Text>
              <TextInput
                placeholder="Add notes..."
                multiline
                value={notes}
                onChangeText={setNotes}
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 10,
                  marginVertical: 10,
                  borderRadius: 6,
                }}
              />
              <View style={styles.detailActions}>
                <Button title="Save Notes" onPress={handleSaveNotes} />
                <View style={{ height: 10 }} />
                <Button
                  title="Delete Meal"
                  onPress={() => {
                    setMeals(meals.filter((m) => m.id !== selectedMeal.id));
                    setDetailModalVisible(false);
                    setSelectedMeal(null);
                  }}
                  color="red"
                />
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  emptyText: { marginTop: 30, fontSize: 18, textAlign: 'center', color: '#777' },
  mealBox: { padding: 12, backgroundColor: '#eee', borderRadius: 6, marginVertical: 6 },
  mealName: { fontSize: 18, fontWeight: 'bold' },
  macros: { fontSize: 14, color: '#555' },
  footer: { marginTop: 20, paddingBottom: 30, alignItems: 'center' },
  modalHeader: {
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  cardSubtitle: { fontSize: 16, fontWeight: '600', marginTop: 10 },
  cardText: { fontSize: 14, marginLeft: 10, marginVertical: 2 },
  detailActions: { marginTop: 20 }
});
