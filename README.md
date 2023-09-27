# ThoughtSpot Everywhere Token Server Example

This server provides and example of using ThoughtSpot Trusted Authentication.  The following endpoints are currently provided:

* /token - gets an auth token for the specified user.  Note that only users in the form of `usernnn` will be allowed to authenticate.
* /env - shows the environment variables that have been set

This server is deployed to Vercel at https://tse-auth-token-server-example.vercel.app/

