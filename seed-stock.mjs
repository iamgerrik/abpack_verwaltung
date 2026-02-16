import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const initialStock = [
  // BLÜTEN
  { id: 'MJ1', category: 'blueten', name: 'Meer Jane 1', hersteller: 'Blue Dream, Tutti Frutti', menge: 1670 },
  { id: 'MJ2', category: 'blueten', name: 'Meer Jane 2', hersteller: 'Angel ..., Buddha', menge: 0 },
  { id: 'AL', category: 'blueten', name: 'AL', hersteller: 'Lemon Cookies', menge: 335 },
  { id: 'AH', category: 'blueten', name: 'AH', hersteller: 'Citrup', menge: 0 },
  { id: 'BK', category: 'blueten', name: 'BK', hersteller: 'Candy Kush', menge: 475 },
  { id: 'GE', category: 'blueten', name: 'GE', hersteller: 'Alien Fruit', menge: 7 },
  { id: 'GG', category: 'blueten', name: 'GG', hersteller: '', menge: 985 },
  { id: 'GP', category: 'blueten', name: 'GP', hersteller: 'Vanilla Kush', menge: 170 },
  { id: 'GSC', category: 'blueten', name: 'GSC', hersteller: 'Coockies', menge: 241 },
  { id: 'HQ', category: 'blueten', name: 'HQ', hersteller: 'Orange Martini', menge: 0 },
  { id: 'NL', category: 'blueten', name: 'NL', hersteller: 'Purple Money', menge: 169 },
  { id: 'PB', category: 'blueten', name: 'PB', hersteller: 'Frosted Sunset', menge: 910 },
  
  // SMALL BUDS
  { id: 'SB_POPCORN', category: 'smallbuds', name: 'SB Popcorn', hersteller: '', menge: 1780 },
  { id: 'SB_SKYWALKER', category: 'smallbuds', name: 'SB Skywalker', hersteller: '', menge: 0 },
  { id: 'SB_BANANA', category: 'smallbuds', name: 'SB Banana', hersteller: '', menge: 0 },
  { id: 'SB_GSC', category: 'smallbuds', name: 'SB GSC', hersteller: '', menge: 0 },
  { id: 'SB_STRAWBERRY', category: 'smallbuds', name: 'SB Strawberry', hersteller: '', menge: 800 },
  { id: 'SF', category: 'smallbuds', name: 'Small Friends', hersteller: '', menge: 0 },
  
  // HASH
  { id: 'H_SD', category: 'hash', name: 'Super Dry', hersteller: '', menge: 34 },
  { id: 'H_SDAL', category: 'hash', name: 'SD AL', hersteller: '', menge: 155 },
  { id: 'H_SDBK', category: 'hash', name: 'SD BK', hersteller: '', menge: 249 },
  { id: 'H_SDGE', category: 'hash', name: 'SD GE', hersteller: '', menge: 393 },
  { id: 'H_SDGG', category: 'hash', name: 'SD GG (ACDC)', hersteller: '', menge: 279 },
  { id: 'H_AMN', category: 'hash', name: 'Amnesia (BZN)', hersteller: '', menge: 400 },
  { id: 'H_CHAR', category: 'hash', name: 'Charas (CBN)', hersteller: '', menge: 19 },
  { id: 'H_POLL', category: 'hash', name: 'Pollen', hersteller: '', menge: 590 },
  { id: 'H_BUBB', category: 'hash', name: 'Bubble Ice', hersteller: '', menge: 937 },
  { id: 'H_KIFF', category: 'hash', name: 'Kiff', hersteller: '', menge: 2412 },
  { id: 'H_SHATTER', category: 'hash', name: 'Shatter', hersteller: '', menge: 0 },
  
  // EXTRACTS
  { id: 'EXT_STARDUST', category: 'extracts', name: 'Stardust', hersteller: '', menge: 1 },
  { id: 'EXT_GOLDWAX_NORM', category: 'extracts', name: 'Gold Wax Normal', hersteller: '', menge: 51 },
  { id: 'EXT_GOLDWAX_PB', category: 'extracts', name: 'Gold Wax PB', hersteller: '', menge: 166 },
  { id: 'EXT_GOLDWAX_AH', category: 'extracts', name: 'Gold Wax AH', hersteller: '', menge: 265 },
  { id: 'EXT_LIQUID_NORM', category: 'extracts', name: 'Liquid Normal', hersteller: '', menge: 180 },
  { id: 'EXT_LIQUID_PB', category: 'extracts', name: 'Liquid PB', hersteller: '', menge: 150 },
  { id: 'EXT_LIQUID_AH', category: 'extracts', name: 'Liquid AH', hersteller: '', menge: 0 },
  { id: 'EXT_CRUMBLE_BAICO', category: 'extracts', name: 'Crumble Baico Gelato', hersteller: '', menge: 108 },
  { id: 'EXT_CRUMBLE_GG', category: 'extracts', name: 'Crumble GG', hersteller: '', menge: 0 },
  { id: 'EXT_CRUMBLE_LEMON', category: 'extracts', name: 'Crumble Lemon', hersteller: '', menge: 0 },
  { id: 'EXT_ROSIN', category: 'extracts', name: 'Rosin', hersteller: '', menge: 5 },
  
  // MOONROCKS
  { id: 'MR_ICE', category: 'moonrocks', name: 'Moon Rock Ice', hersteller: '', menge: 0 },
  { id: 'MR_NORMAL', category: 'moonrocks', name: 'Moon Rock', hersteller: '', menge: 0 },
  { id: 'MR_BERRY', category: 'moonrocks', name: 'Moon Rock Berry', hersteller: '', menge: 0 },
  
  // TRIM
  { id: 'TRIM', category: 'trim', name: 'TRIM', hersteller: '', menge: 0 },
  { id: 'TRIM_NORMAL', category: 'trim', name: 'Trim', hersteller: '', menge: 2800 },
  { id: 'GREENHOUSE', category: 'trim', name: 'Greenhouse', hersteller: '', menge: 0 },
  { id: '420MIX', category: 'trim', name: '420Mix', hersteller: '', menge: 0 },
  
  // ANDERE
  { id: 'FILTER', category: 'andere', name: 'FILTER (Stk.)', hersteller: '', menge: 77600 },
  { id: 'HERBAL', category: 'andere', name: 'Herbal Blend', hersteller: '', menge: 1845 },
  
  // EXTRACTS (continued)
  { id: 'EXT_CRUMBLE_NATURAL', category: 'extracts', name: 'Crumble Natural', hersteller: '', menge: 0 }
];

async function seedDatabase() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    
    console.log('🌱 Starting to seed stock data...');
    
    // Clear existing data
    await connection.execute('DELETE FROM stock');
    console.log('✓ Cleared existing stock data');
    
    // Insert new data
    for (const item of initialStock) {
      await connection.execute(
        'INSERT INTO stock (id, category, name, hersteller, menge) VALUES (?, ?, ?, ?, ?)',
        [item.id, item.category, item.name, item.hersteller, item.menge.toString()]
      );
    }
    
    console.log(`✓ Successfully inserted ${initialStock.length} stock items`);
    
    // Verify
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM stock');
    console.log(`✓ Database now contains ${rows[0].count} stock items`);
    
    await connection.end();
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
