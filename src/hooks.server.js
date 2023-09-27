import Blob from 'cross-blob';

export const handle = async ({event, resolve}) => {

    if (event.request.method !== "OPTIONS") {
        const response = await resolve(event)

        // Set CORS headers
        response.headers.set("Access-Control-Allow-Credentials", "true");
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "FETCH, GET,OPTIONS,PATCH,DELETE,POST,PUT");
        response.headers.set("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");

        return response;
    }

    // for the OPTIONS event.
    return new Response(new Blob(), {status: 200})
}