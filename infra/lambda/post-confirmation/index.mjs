async function handler(event, context) {
	console.log("=== POST-CONFIRMATION LAMBDA TRIGGERED ===");
	console.log("Event:", JSON.stringify(event, null, 2));
	console.log("Context:", JSON.stringify(context, null, 2));

	try {
		const userId = event.userName;
		const email = event.request.userAttributes.email;

		console.log(`Processing user: ${userId} with email: ${email}`);
		console.log("Environment variables check:");
		console.log("- BACKEND_URL:", process.env.BACKEND_URL ? "SET" : "MISSING");
		console.log(
			"- BACKEND_SECRET:",
			process.env.BACKEND_SECRET ? "SET" : "MISSING"
		);

		if (!process.env.BACKEND_URL || !process.env.BACKEND_SECRET) {
			throw new Error("Missing required environment variables");
		}

		const requestBody = {
			id: userId,
			email: email,
		};

		console.log(
			"Sending request to backend:",
			JSON.stringify(requestBody, null, 2)
		);
		console.log("Backend URL:", process.env.BACKEND_URL);

		const response = await fetch(`${process.env.BACKEND_URL}/create-user`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.BACKEND_SECRET}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		});

		console.log(`Backend response status: ${response.status}`);
		console.log(
			`Backend response headers:`,
			Object.fromEntries(response.headers.entries())
		);

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
			console.log("✅ User created successfully:", result);
		}

		return event;
	} catch (error) {
		console.error("❌ Error in post-confirmation handler:", error);
		console.error("Error stack:", error.stack);
		return event;
	}
}

export { handler };
