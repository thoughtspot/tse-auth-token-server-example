<script>
    import {onMount} from "svelte";

    const trustedAuthDirectLogin = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const passedValues = JSON.parse(urlParams.get('jsonData'));
        console.log(`passed in values: ${passedValues}`);

        if (!passedValues) {
            const message = "Unable to get the passed values from the URL.  Make sure to pass 'jsonData' in the URL";
            console.error(message);
            addMessage(message);
            return false;
        }

        let tsHost = passedValues['TSHost'];
        let token = passedValues['TSToken'];

        if (!tsHost && !token) {
            addMessage(`Unable to get the TSHost and TSToken from the URL parameters ${JSON.stringify(passedValues)}`);
            return false;
        }

        login(tsHost, token);
    }

    const login = (tsHost, token) => {
        const endpoint = "auth/session/login";
        const bearerHeader = "Bearer " + token;
        const apiFullEndpoint = tsHost + "/api/rest/2.0/" + endpoint;

        const fetchArguments = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": bearerHeader
            },
            credentials: "include"
        }

        addMessage(`Attempting to log in using '${apiFullEndpoint}'`);
        fetch(apiFullEndpoint, fetchArguments)
            .then(response => {
                addMessage("Fetch has completed successfully.  Status code: " + response.status);
                console.log(response);
                return true;
            })
            .catch(error => {
                const errorMsg = `Unable to get the ${apiFullEndpoint} response: ${error}`;
                console.error(errorMsg);
            });

    }

    let messages = [];

    // bit of a hack to get the app to respond when messages are added.
    const addMessage = (message) => {
        const tmpMessages = messages;
        tmpMessages.push(message);
        messages = tmpMessages;
    }

    onMount(() => {
        addMessage("Attempting to log in");
        console.log(messages);
        trustedAuthDirectLogin();
    });
</script>

<h1>Progress Messages</h1>
<div id='messages'>
    <ul>
    {#each messages as message}
    <li>{message}</li>
    {/each}
    </ul>
</div>

<style>
    #messages {
        font-family: sans-serif;
    }

    h1 {
        color: black;
        font-size: 24px;
    }

    ul {
        list-style-type: none;
    }

    li {
        color: black;
        font-size: 16px;
        margin-bottom: 3px;
        margin-top: 3px;
    }

</style>