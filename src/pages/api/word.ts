import type { APIRoute } from 'astro';
import { getWord } from '../../lib/db';

export const GET: APIRoute = async ({ request }) => {
  console.log('API: Word request received');
  const url = new URL(request.url);
  const word = url.searchParams.get('word');

  console.log('API: Requested word:', word);

  if (!word) {
    console.log('API: Word parameter is missing');
    return new Response(JSON.stringify({ error: 'Word parameter is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    console.log('API: Fetching word data for:', word);
    const wordData = await getWord(word);

    console.log('API: Word data received:', JSON.stringify(wordData));

    if (wordData) {
      console.log('API: Word data found, sending response');
      return new Response(JSON.stringify(wordData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      console.log('API: Word not found, sending 404 response');
      return new Response(JSON.stringify({ error: 'Word not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('API: Error fetching word data:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};