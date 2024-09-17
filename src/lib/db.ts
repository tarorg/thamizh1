import { turso } from '../turso';

interface WordData {
  word: string;
  phonetic: string;
  meaning: string;
  synonyms: string;
  source: string;
  image_url?: string;
  audio_url?: string;
}

console.log('DB module loaded');

export async function getWord(word: string): Promise<WordData | null> {
  console.log('getWord function called with:', word);
  try {
    const result = await turso.execute({
      sql: 'SELECT * FROM words WHERE word = ?',
      args: [word]
    });
    console.log('getWord query result:', result);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in getWord:', error);
    throw error;
  }
}

export async function searchWords(query: string): Promise<{ word: string }[]> {
  console.log('searchWords function called with:', query);
  try {
    const result = await turso.execute({
      sql: 'SELECT word FROM words WHERE word LIKE ? LIMIT 10',
      args: [`${query}%`]
    });
    console.log('searchWords query result:', result);
    return result.rows.map(row => ({ word: row.word }));
  } catch (error) {
    console.error('Error in searchWords:', error);
    throw error;
  }
}

export async function getAllWords(): Promise<{ word: string }[]> {
  console.log('Executing getAllWords query');
  try {
    console.log('Turso object before execute:', JSON.stringify(turso, null, 2));
    const result = await turso.execute('SELECT word FROM words');
    console.log('Raw result from turso.execute:', JSON.stringify(result, null, 2));
    
    if (result && result.rows) {
      console.log('Number of rows:', result.rows.length);
      console.log('All rows:', JSON.stringify(result.rows, null, 2));
      return result.rows.map(row => ({ word: row.word }));
    } else {
      console.log('No rows returned or result is undefined');
      console.log('Result structure:', JSON.stringify(result, null, 2));
      return [];
    }
  } catch (error) {
    console.error('Error in getAllWords:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    console.log('Turso object after error:', JSON.stringify(turso, null, 2));
    return [];
  }
}

export async function checkDatabase(): Promise<void> {
  try {
    console.log('Checking database structure...');
    const tables = await turso.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Tables in the database:', tables.rows);

    // Check specifically for the 'words' table
    if (tables.rows.some((row: any) => row.name === 'words')) {
      try {
        const wordCount = await turso.execute('SELECT COUNT(*) as count FROM words');
        console.log('Number of words in the "words" table:', wordCount.rows[0].count);
      } catch (error) {
        console.error('Error getting word count:', error);
      }

      try {
        const tableInfo = await turso.execute("PRAGMA table_info('words')");
        console.log('Structure of "words" table:', tableInfo.rows);
      } catch (error) {
        console.error('Error getting table info:', error);
      }

      try {
        const allWords = await turso.execute('SELECT word FROM words');
        console.log('All words from "words" table:', allWords.rows);
      } catch (error) {
        console.error('Error getting all words:', error);
      }
    } else {
      console.log('The "words" table does not exist in the database.');
    }
  } catch (error) {
    console.error('Error checking database:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
  }
}