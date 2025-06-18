
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useGrocery } from '../../../context/GroceryContext';
import uuid from 'react-native-uuid';

export default function GroceryListScreen() {
  const {
    groceryList,
    addGroceryItem,
    updateGroceryItem,
    removeGroceryItem
  } = useGrocery();

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Item name is required');
      return;
    }

    const newItem = {
      id: editingId || uuid.v4(),
      name: name.trim(),
      quantity,
      unit,
    };

    if (editingId) {
      updateGroceryItem(editingId, newItem);
    } else {
      addGroceryItem(newItem);
    }

    resetForm();
  };

  const resetForm = () => {
    setName('');
    setQuantity('');
    setUnit('');
    setEditingId(null);
    setModalVisible(false);
  };

  const startEdit = (item) => {
    setName(item.name);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setEditingId(item.id);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Item', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: () => removeGroceryItem(id),
        style: 'destructive',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Groceries</Text>
       <Button
  title="Add"
  onPress={() => {
    setName('');
    setQuantity('');
    setUnit('');
    setEditingId(null);
    setModalVisible(true);
  }}
/>
      </View>

      <FlatList
        data={groceryList}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No groceries yet.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => startEdit(item)}
            onLongPress={() => handleDelete(item.id)}
          >
            <Text style={styles.itemText}>
              {item.name} — {item.quantity} {item.unit}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{editingId ? 'Edit' : 'Add'} Item</Text>
          <TextInput
            placeholder="Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Quantity"
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Unit (e.g., oz, g, tbsp)"
            style={styles.input}
            value={unit}
            onChangeText={setUnit}
          />
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={resetForm} color="gray" />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, color: '#888' },
  item: { padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
  itemText: { fontSize: 16 },
  modalContent: { flex: 1, padding: 20, justifyContent: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
});
