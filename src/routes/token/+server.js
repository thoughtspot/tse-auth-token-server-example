import {error} from '@sveltejs/kit';
import {TS_URL, ORG_ID, SECRET_KEY} from '$env/static/private';


/** @type {import('./$types').RequestHandler} */
export async function GET({url}) {
  const username = url.searchParams.get('username');
  if (!username) {
    throw error(400, 'username parameter is required, e.g. /token/?username=foo');
  }

  const data = {
    "username": username,
    "validity_time_in_sec": 300,
    "org_id": ORG_ID,
    "auto_create": false,
    "secret_key": SECRET_KEY
  }

  const resp = await fetch(`${TS_URL}/api/rest/2.0/auth/token/full`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  );

  const tokenbody = await resp.json();
  const token = tokenbody.token;

  return new Response(`${JSON.stringify(token)}`);
}