const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDB() {
  try {
    // 1. Connect without specifying the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL Server');

    // 2. Create Database
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`✅ Database '${process.env.DB_NAME}' created or already exists`);

    // 3. Switch to the new database
    await connection.changeUser({ database: process.env.DB_NAME });

    // 4. Read SQL files
    const basePath = path.join(__dirname, '..');
    
    console.log('📖 Reading SQL files...');
    const createTablesSQL = fs.readFileSync(path.join(basePath, 'SQL_CREATE_TABLE_QUERIES.sql'), 'utf8');
    const schemaExtensionsSQL = fs.readFileSync(path.join(basePath, 'SQL_SCHEMA_EXTENSIONS.sql'), 'utf8');
    const dataInsertSQL = fs.readFileSync(path.join(basePath, 'SQL_DATA_INSERT_QUERIES.sql'), 'utf8');

    // 5. Execute SQL
    console.log('⚙️ Executing Create Tables...');
    await connection.query(createTablesSQL);
    
    console.log('⚙️ Executing Data Inserts...');
    // Some data might already exist, so we will wrap it in a try-catch to not fail if duplicate keys occur
    try {
      await connection.query(dataInsertSQL);
      console.log('✅ Data Inserts executed successfully');
    } catch (insertErr) {
      if (insertErr.code === 'ER_DUP_ENTRY') {
        console.log('⚠️ Data already exists. Skipping inserts.');
      } else {
        throw insertErr;
      }
    }

    console.log('⚙️ Executing Schema Extensions...');
    await connection.query(schemaExtensionsSQL);

    console.log('\n📊 Database Verification Summary:');
    const tables = [
      'Customer', 'Menu', 'MenuItem', 'Reservation_Table', 'TimeSlot', 
      'Reservation', 'Orders', 'Order_Details', 'Feedback', 
      'Kitchen_Schedule', 'Arrival_Log', 'Preference', 'Bill', 'Payment',
      'Cart', 'Collection', 'email'
    ];

    const summary = [];
    for (const table of tables) {
      try {
        const [[{ count }]] = await connection.query(`SELECT COUNT(*) as count FROM \`${table}\``);
        summary.push({ Table: table, Records: count });
      } catch (err) {
        summary.push({ Table: table, Records: 'Error/Not Created' });
      }
    }
    console.table(summary);

    console.log('🎉 Database initialization and verification complete!');
    await connection.end();

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initDB();
