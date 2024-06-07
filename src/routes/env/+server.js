import {TS_URL, ORG_ID, SECRET_KEY, PASSCODE} from '$env/static/private';


/** @type {import('./$types').RequestHandler} */
export async function GET({url}) {

  let secretKey = SECRET_KEY;
  if (secretKey) {
    secretKey = secretKey.slice(0, 4) + '...' + secretKey.slice(-4);
  }

  const data = {
    'TS_URL': TS_URL,
    'ORG_ID': ORG_ID,
    'SECRET_KEY': secretKey
  }

  return (new Response(JSON.stringify(data)));
}