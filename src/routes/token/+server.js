import {error} from '@sveltejs/kit';
import {TS_URL, TSE_ORG_ID, E_LEARNING_ORG_ID, SECRET_KEY, PASSCODE} from '$env/static/private';


/** @type {import('./$types').RequestHandler} */
export async function GET({url}) {
  const urlFormat = "/token/?username={username}&passcode={passcode}";

  const username = url.searchParams.get('username');
  if (!username) {
    throw error(400, `username parameter is required, e.g. ${urlFormat}`);
  }

  const passcode = url.searchParams.get('passcode');
  if (!passcode) {
    throw error(400, `a valid passcode is required, e.g. ${urlFormat}`);
  }
  if (passcode !== PASSCODE) {
    throw error(400, `passcode is incorrect, e.g. ${urlFormat}'`);
  }

  if (!is_valid_user(username)) {
    throw error(403, `User ${username} is not valid.`);
  }

  let org_id = get_org_id(username)

  const data = {
    "username": username,
    "validity_time_in_sec": 300,
    "org_id": org_id,
    "auto_create": false,
    "secret_key": SECRET_KEY  // to work this has to be the instance level so it works across orgs.
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
  } else {
    token = tokenbody.token;
  }

  return new Response(`${JSON.stringify(token)}`);
}

const is_valid_user = (username) => {
  // Returns true if this is a valid username.

  // userNNN is for the advanced training.  tspractice1,2,3 etc. are for TSU.
  const userregx = /user[0-9][0-9][0-9]/;
  return username.match(userregx) || username.startsWith('tspractice');
}

const get_org_id = (username) => {
  // Gets the org ID for the given user.  Right now only TSE and eLearning are supported.

  if (username.startsWith('user')) {
    return TSE_ORG_ID;
  } else if (username.startsWith('tspractice')) {
    return E_LEARNING_ORG_ID;
  }
  return -1  // will cause an error.
}