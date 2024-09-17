import { createClient } from "@libsql/client";

const TURSO_DATABASE_URL = import.meta.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = import.meta.env.TURSO_AUTH_TOKEN;

console.error('Turso module loaded');
console.error('TURSO_DATABASE_URL:', TURSO_DATABASE_URL || 'Not set');
console.error('TURSO_AUTH_TOKEN:', TURSO_AUTH_TOKEN ? 'Set' : 'Not set');

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  throw new Error('Turso environment variables are not set correctly');
}

export const turso = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN
});

console.log('Turso client created:', JSON.stringify(turso, null, 2));

export async function testConnection() {
  try {
    const result = await turso.execute('SELECT 1');
    console.error('Database connection successful:', result);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return false;
  }
}