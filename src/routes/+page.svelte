<script>
  import './styles.css'
</script>
<h1>Trusted authentication</h1>

<p>
    You've reached the root of the ThoughtSpot trusted authentication example.
</p>
<p>
    To authentication with a user, call
    <span class="mono">https://&lt;auth-host&gt;/token/&lt;username&gt;</span> where:
</p>
<ul>
    <li>The <span class="mono">username</span> is the name of the user to get a token for. Only users in the form <span
            class="mono">usernnn</span> are allowed.
    </li>
</ul>
<p>
    Current this service will always return a token for the given user assuming they exist and the secret key is
    properly set in the server environment.
</p>
