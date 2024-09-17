import { createClient } from '@libsql/client';
import fs from 'fs/promises';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

console.log('TURSO_DATABASE_URL:', TURSO_DATABASE_URL);
console.log('TURSO_AUTH_TOKEN:', TURSO_AUTH_TOKEN);

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  console.error('Error: TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is not set in the environment variables.');
  process.exit(1);
}

const client = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

async function insertWords() {
  try {
    // Read the JSON file
    const data = await fs.readFile('output.json', 'utf8');
    const words = JSON.parse(data);

    // Insert each word
    for (const word of words) {
      await client.execute({
        sql: 'INSERT INTO words (word, meaning) VALUES (?, ?)',
        args: [word.title, word.meaning]
      });
    }

    console.log('Insertion complete.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

insertWords();