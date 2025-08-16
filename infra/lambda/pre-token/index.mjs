async function handler(event) {
	event.response = {
		claimsOverrideDetails: {
			claimsToAddOrOverride: {
				role: "authenticated",
			},
		},
	};

	return event;
}

export { handler };
