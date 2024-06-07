<script>
    import {onMount} from "svelte";

    /**
     * Function to handle trusted authentication direct login
     * It retrieves the passed values from the URL and uses them to login
     */
    const trustedAuthDirectLogin = () => {
        // Creating a URLSearchParams object with the query string of the URL
        const urlParams = new URLSearchParams(window.location.search);
        // Parsing the jsonData parameter value from the URL
        const passedValues = JSON.parse(urlParams.get('jsonData'));
        console.log(`passed in values: ${passedValues}`);

        // If no values are passed, log an error message and return false
        if (!passedValues) {
            const message = "Unable to get the passed values from the URL.  Make sure to pass 'jsonData' in the URL";
            console.error(message);
            addMessage(message);
            return false;
        }

        // Retrieve the TSHost and TSToken from the passed values
        let tsHost = passedValues['TSHost'];
        let token = passedValues['TSToken'];

        // If TSHost and TSToken are not provided, log an error message and return false
        if (!tsHost && !token) {
            addMessage(`Unable to get the TSHost and TSToken from the URL parameters ${JSON.stringify(passedValues)}`);
            return false;
        }

        // Call the login function with the TSHost and TSToken
        login(tsHost, token);
    }

    /**
     * Function to handle login
     * It makes a POST request to the login endpoint with the provided TSHost and TSToken
     * @param {string} tsHost - The TSHost value
     * @param {string} token - The TSToken value
     */
    const login = (tsHost, token) => {
        // Define the endpoint and the bearerHeader
        const endpoint = "auth/session/login";
        const bearerHeader = "Bearer " + token;
        const apiFullEndpoint = tsHost + "/api/rest/2.0/" + endpoint;

        // Define the fetch arguments
        const fetchArguments = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": bearerHeader
            },
            credentials: "include"
        }

        // Log the attempt to login
        addMessage(`Attempting to log in using '${apiFullEndpoint}'`);
        // Make the fetch request
        fetch(apiFullEndpoint, fetchArguments)
            .then(response => {
                // Log the successful fetch
                addMessage("Fetch has completed successfully.  Status code: " + response.status);
                console.log(response);
                return true;
            })
            .catch(error => {
                // Log the error
                const errorMsg = `Unable to get the ${apiFullEndpoint} response: ${error}`;
                console.error(errorMsg);
            });

    }

    // Initialize an empty array for messages
    let messages = [];

    /**
     * Function to add a message to the messages array
     * @param {string} message - The message to add
     */
    const addMessage = (message) => {
        const tmpMessages = messages;
        tmpMessages.push(message);
        messages = tmpMessages;
    }

    // On mount, log the attempt to login and call the trustedAuthDirectLogin function
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
    /* Styling for the messages div */
    #messages {
        font-family: sans-serif;
    }

    /* Styling for the h1 tag */
    h1 {
        color: black;
        font-size: 24px;
    }

    /* Styling for the ul tag */
    ul {
        list-style-type: none;
    }

    /* Styling for the li tag */
    li {
        color: black;
        font-size: 16px;
        margin-bottom: 3px;
        margin-top: 3px;
    }

</style>