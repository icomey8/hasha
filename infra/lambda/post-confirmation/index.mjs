async function handler(event, context) {
	console.log("=== POST-CONFIRMATION LAMBDA TRIGGERED ===");
	console.log("Event:", JSON.stringify(event, null, 2));
	console.log("Context:", JSON.stringify(context, null, 2));

	try {
		const userId = event.request.userAttributes.sub;
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

		if (!response.ok) {
			console.error(
				`Backend request failed: ${response.status} ${response.statusText}`
			);
			throw new Error(
				`Backend request failed: ${response.status} ${response.statusText}`
			);
		} else {
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
