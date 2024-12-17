import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView } from 'react-native';
import * as SQLite from 'expo-sqlite';

const App = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState([]);
  const [db, setDb] = useState(null);

  // Open the database asynchronously
  const openDatabase = async () => {
    try {
      const database = await SQLite.openDatabaseAsync('myDatabase.db');
      setDb(database);
      console.log('Database opened successfully');
      await createTable(database); // Create table after opening the DB
    } catch (error) {
      console.error('Error opening database', error);
    }
  };

  // Create table using execAsync for bulk queries
  const createTable = async (db) => {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT);
    `);
  };

  // Insert user data into the database using runAsync
  const handleSubmit = async () => {
    if (name && email && db) {
      const result = await db.runAsync('INSERT INTO users (name, email) VALUES (?, ?)', name, email);
      console.log('Data inserted successfully', result);
      alert('User added!');
      await fetchUsers(); // Refresh the user list
    } else {
      alert('Please fill out both fields');
    }
  };

  // Fetch users from the database using getAllAsync
  const fetchUsers = async () => {
    if (db) {
      const allRows = await db.getAllAsync('SELECT * FROM users');
      console.log('Fetched users:', allRows);
      setUsers(allRows);
    }
  };

  // Initialize database when the component mounts
  useEffect(() => {
    openDatabase();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Submit" onPress={handleSubmit} color="#6200ea" />
      </View>

      <View style={styles.usersList}>
        {users.map((user, index) => (
          <View key={index} style={styles.userItem}>
            <Text style={styles.userText}>{user.name} - {user.email}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  form: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingLeft: 10,
    fontSize: 16,
  },
  usersList: {
    marginTop: 20,
  },
  userItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userText: {
    fontSize: 16,
    color: '#333',
  },
});

export default App;
