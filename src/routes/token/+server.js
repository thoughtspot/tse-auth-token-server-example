import { error } from '@sveltejs/kit';
import { TS_URL, TSE_ORG_ID, E_LEARNING_ORG_ID, SECRET_KEY, PASSCODE } from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	// The following is the minimum for the format.  It doesn't include the ability to do filters.
	const urlFormat = '/token/?username={username}&passcode={passcode}';

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

	let org_id = get_org_id(username);

	// Look for filters for the embed.
	const { filters, parameters } = getFiltersAndParams(url);

	// Base data needed to get a token.
	const data = {
		username: username,
		validity_time_in_sec: 300,
		org_id: org_id,
		auto_create: false,
		secret_key: SECRET_KEY, // to work this has to be the instance level, so it works across orgs.
		persist_option: 'NONE'
	};

	// Check for and add filters.
	if (filters) {
		data['filter_rules'] = filters.map((filter) => ({
			column_name: filter.name,
			operator: filter.operator,
			values: filter.value.split(',').map((v) => v.trim())
		}));
	}

	// Check for and add parameters.
	if (parameters) {
		data['parameter_values'] = parameters.map((parameter) => ({
			name: parameter.name,
			values: parameter.value.split(',').map((v) => v.trim())
		}));
	}

	console.log(JSON.stringify(data));
	const resp = await fetch(`${TS_URL}/api/rest/2.0/auth/token/custom`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	const tokenbody = await resp.json();
	console.log(JSON.stringify(tokenbody));
	let token;
	if (tokenbody['error']) {
		// means there was an error
		token = JSON.stringify(tokenbody);
	} else {
		token = tokenbody.token;
	}

	return new Response(`${JSON.stringify(token)}`);
}

const is_valid_user = (username) => {
	// Returns true if this is a valid username.

	const userregx = /user[0-9][0-9][0-9]/;
	return (
		username.match(userregx) || // Users for TSE training
		username.startsWith('training') || // Users for TSU
		username === 'tsedev'
	); // Shared user for TSE training
};

const get_org_id = (username) => {
	// Gets the org ID for the given user.  Right now only TSE and eLearning are supported.

	if (username.startsWith('user')) {
		return TSE_ORG_ID;
	} else if (username.startsWith('training')) {
		return E_LEARNING_ORG_ID;
	}
	return -1; // will cause an error.
};

const getFiltersAndParams = (url) => {
	const urlObj = new URL(url);
	const params = urlObj.searchParams;

	// Temporary maps to collect filter and parameter entries.
	const filterMap = {};
	const parameterMap = {};

	// Iterate through all query parameters.
	for (const [key, value] of params.entries()) {
		let match = key.match(/^(fname|fvalue|foperator)_(\d+)$/);
		if (match) {
			const [, type, index] = match;
			if (!filterMap[index]) filterMap[index] = {};
			filterMap[index][type] = value;
			continue;
		}
		match = key.match(/^(pname|pvalue)_(\d+)$/);
		if (match) {
			const [, type, index] = match;
			if (!parameterMap[index]) parameterMap[index] = {};
			parameterMap[index][type] = value;
		}
	}

	// Convert filterMap into an array of objects.
	const filters = [];
	for (const key in filterMap) {
		const item = filterMap[key];
		// Only add the filter if all three parts are present.
		if (item.fname !== undefined && item.fvalue !== undefined && item.foperator !== undefined) {
			item.foperator = item.foperator.toUpperCase();
			filters.push({ name: item.fname, value: item.fvalue, operator: item.foperator });
		}
	}

	// Convert parameterMap into an array of objects.
	const parameters = [];
	for (const key in parameterMap) {
		const item = parameterMap[key];
		if (item.pname !== undefined && item.pvalue !== undefined) {
			parameters.push({ name: item.pname, value: item.pvalue });
		}
	}

	return { filters, parameters };
};
