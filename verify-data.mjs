import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function verifyData() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    
    console.log('Verifying stock data...\n');
    
    // Get all stock data
    const [rows] = await connection.execute('SELECT id, name, menge FROM stock ORDER BY id');
    
    console.log(`Total items: ${rows.length}\n`);
    
    // Show first 10 items
    console.log('First 10 items:');
    rows.slice(0, 10).forEach((row, i) => {
      console.log(`${i+1}. ${row.id} - ${row.name}: ${row.menge}g`);
    });
    
    // Check for empty menge values
    const emptyMenge = rows.filter(r => !r.menge || r.menge === null || r.menge === '0.00');
    console.log(`\nItems with 0 or empty menge: ${emptyMenge.length}`);
    
    // Check for non-zero menge values
    const nonZeroMenge = rows.filter(r => r.menge && r.menge !== '0.00');
    console.log(`Items with non-zero menge: ${nonZeroMenge.length}`);
    
    if (nonZeroMenge.length > 0) {
      console.log('\nSample of non-zero items:');
      nonZeroMenge.slice(0, 5).forEach(row => {
        console.log(`  ${row.id}: ${row.menge}g`);
      });
    }
    
    await connection.end();
    console.log('\n✅ Verification completed!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyData();
