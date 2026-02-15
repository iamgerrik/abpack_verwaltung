import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testSeed() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    
    console.log('Testing database connection...');
    
    // Test data
    const testData = [
      { id: 'TEST1', category: 'blueten', name: 'Test Product', hersteller: 'Test', menge: '1670' },
      { id: 'TEST2', category: 'blueten', name: 'Test Product 2', hersteller: 'Test', menge: '500' }
    ];
    
    // Clear test data
    await connection.execute('DELETE FROM stock WHERE id LIKE "TEST%"');
    console.log('✓ Cleared test data');
    
    // Insert test data
    for (const item of testData) {
      console.log(`Inserting: ${item.id} with menge: ${item.menge}`);
      const result = await connection.execute(
        'INSERT INTO stock (id, category, name, hersteller, menge) VALUES (?, ?, ?, ?, ?)',
        [item.id, item.category, item.name, item.hersteller, item.menge]
      );
      console.log(`Result:`, result[0]);
    }
    
    // Verify
    const [rows] = await connection.execute('SELECT id, name, menge FROM stock WHERE id LIKE "TEST%"');
    console.log('Inserted data:');
    console.log(rows);
    
    await connection.end();
    console.log('✅ Test completed!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testSeed();
