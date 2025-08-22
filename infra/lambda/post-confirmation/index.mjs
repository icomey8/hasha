async function handler(event, context) {
	console.log("=== POST-CONFIRMATION LAMBDA TRIGGERED ===");
	console.log("Event:", JSON.stringify(event, null, 2));
	console.log("Context:", JSON.stringify(context, null, 2));

	try {
		const userId = event.userName;
		const email = event.request.userAttributes.email;

		console.log(`Processing user`);
		console.log("Environment variables check:");

		if (!process.env.BACKEND_URL || !process.env.BACKEND_SECRET) {
			throw new Error("Missing required environment variables");
		}

		const requestBody = {
			id: userId,
			email: email,
		};

		console.log("Sending request to backend...");

		const response = await fetch(`${process.env.BACKEND_URL}`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.BACKEND_SECRET}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		});

		console.log(`Backend response status: ${response.status}`);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(
				`Backend request failed: ${response.status} ${response.statusText}`
			);
			console.error(`Error response body: ${errorText}`);
			throw new Error(
				`Backend request failed: ${response.status} ${response.statusText}`
			);
		} else {
			const result = await response.json();
			console.log("✅ User created successfully:");
		}

		return event;
	} catch (error) {
		console.error("❌ Error in post-confirmation handler:", error);
		console.error("Error stack:", error.stack);
		return event;
	}
}

export { handler };
