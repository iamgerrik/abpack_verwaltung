import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Neue Bestandsdaten vom 16. Februar 2026
const stockUpdates = [
  // BLÜTEN
  { id: 'MJ1', menge: 140 },
  { id: 'MJ2', menge: 11301 },
  { id: 'AL', menge: 6265 },
  { id: 'AH', menge: 125 },
  { id: 'BK', menge: 0 },
  { id: 'GE', menge: 862 },
  { id: 'GG', menge: 0 },
  { id: 'GP', menge: 0 },
  { id: 'GSC', menge: 312 },
  { id: 'HQ', menge: 0 },
  { id: 'NL', menge: 20 },
  { id: 'PB', menge: 640 },
  
  // SMALL BUDS
  { id: 'SB_POPCORN', menge: 700 },
  { id: 'SB_STRAWBERRY', menge: 0 },
  
  // TRIM
  { id: 'TRIM', menge: 0 },
  { id: 'TRIM_NORMAL', menge: 0 },
  { id: 'GREENHOUSE', menge: 0 },
  
  // ANDERE
  { id: 'HERBAL', menge: 1095 },
  { id: 'FILTER', menge: 63880 },
  
  // CRUMBLE / EXTRACTS
  { id: 'EXT_CRUMBLE_NATURAL', menge: 0 },
  
  // MOONROCKS
  { id: 'MR_ICE', menge: 51 },      // Baico Gelato: 51
  { id: 'MR_NORMAL', menge: 0 },    // GG: 0
  { id: 'MR_BERRY', menge: 0 },     // Lemon: 0
  
  // HASH
  { id: 'H_SD', menge: 1460 },
  { id: 'H_SDAL', menge: 51 },
  { id: 'H_SDBK', menge: 249 },
  { id: 'H_SDGE', menge: 393 },
  { id: 'H_SDGG', menge: 210 },
  { id: 'H_AMN', menge: 234 },      // Amnesia (B21)
  { id: 'H_CHAR', menge: 193 },     // Charas (CBN)
  { id: 'H_POLL', menge: 374 },
  { id: 'H_BUBB', menge: 467 },
  { id: 'H_KIFF', menge: 1912 },
  { id: 'EXT_ROSIN', menge: 2 },
  
  // EXTRACTS
  { id: 'EXT_STARDUST', menge: 1 },
  { id: 'EXT_GOLDWAX_NORM', menge: 20 },
  { id: 'EXT_GOLDWAX_PB', menge: 166 },
  { id: 'EXT_GOLDWAX_AH', menge: 265 },
  { id: 'EXT_LIQUID_NORM', menge: 110 },
  { id: 'EXT_LIQUID_PB', menge: 100 },
  { id: 'EXT_LIQUID_AH', menge: 10 },
];

async function updateStock() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    
    console.log('📦 Updating stock data (16. Februar 2026)...');
    
    let updated = 0;
    let notFound = [];
    
    for (const item of stockUpdates) {
      const [result] = await connection.execute(
        'UPDATE stock SET menge = ? WHERE id = ?',
        [item.menge.toString(), item.id]
      );
      
      if (result.affectedRows > 0) {
        updated++;
        console.log(`  ✓ ${item.id}: ${item.menge}g`);
      } else {
        notFound.push(item.id);
      }
    }
    
    console.log(`\n✅ Successfully updated ${updated} stock items`);
    
    if (notFound.length > 0) {
      console.log(`⚠️  Not found: ${notFound.join(', ')}`);
    }
    
    // Show current stock
    console.log('\n📊 Current stock overview:');
    const [rows] = await connection.execute('SELECT id, name, menge FROM stock ORDER BY category, name');
    for (const row of rows) {
      console.log(`  ${row.id}: ${row.name} = ${row.menge}g`);
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error updating stock:', error);
    process.exit(1);
  }
}

updateStock();
