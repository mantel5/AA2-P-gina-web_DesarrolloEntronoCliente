const Database = require('better-sqlite3');
try {
    const db = new Database('test.db', { verbose: console.log });
    console.log('Database connected successfully');
    db.exec('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY)');
    console.log('Table created');
} catch (error) {
    console.error('Database Error:', error);
}
