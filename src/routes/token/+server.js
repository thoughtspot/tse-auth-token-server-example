import {error} from '@sveltejs/kit';
import {TS_URL, ORG_ID, SECRET_KEY, PASSCODE} from '$env/static/private';


/** @type {import('./$types').RequestHandler} */
export async function GET({url}) {
  const urlFormat = "/token/?username={username}&passcode={passcode}";

  const username = url.searchParams.get('username');
  if (!username) {
    throw error(400, 'username parameter is required, e.g. ${urlFormat}');
  }

  const passcode = url.searchParams.get('passcode');
  if (!passcode) {
    throw error(400, 'a valid passcode is required, e.g. ${urlFormat}');
  }
  if (passcode !== PASSCODE) {
    throw error(400, `passcode is incorrect, e.g. ${urlFormat}'`);
  }

  const userregx = /user[0-9][0-9][0-9]/;
  if (!username.match(userregx)) {
    throw error(403, 'only users in for the form of userNNN are allowed');
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
  console.log(JSON.stringify(tokenbody));
  let token;
  if (tokenbody['error']) { // means there was an error
    token = JSON.stringify(tokenbody);
  }
  else {
    token = tokenbody.token;
  }

  return new Response(`${JSON.stringify(token)}`);
}