import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = 'myDatabase.db';
const database_version = '1.0';
const database_displayname = 'SQLite React Native Database';
const database_size = 200000;



let db;

export const initializeDatabase = async () => {
  try {
    
    db = await SQLite.openDatabase({
        name: "MainDB",
        location: "default"
    }, () => {}, (err) => console.log(err)
    );

    

    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL
      );`
    );

    console.log('Database and table created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export const addUser = async (name, email) => {
  try {
    await db.executeSql(`INSERT INTO users (name, email) VALUES (?, ?);`, [
      name,
      email,
    ]);
    console.log('User added successfully');
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

export const getUsers = async () => {
  try {
    const results = await db.executeSql(`SELECT * FROM users;`);
    const users = [];

    results.forEach((result) => {
      for (let i = 0; i < result.rows.length; i++) {
        users.push(result.rows.item(i));
      }
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};
