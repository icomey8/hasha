import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Amplify } from "aws-amplify";
import * as auth from "@/lib/auth";

Amplify.configure({
	Auth: {
		Cognito: {
			userPoolId: "us-east-1_XG2BIQQ5d",
			userPoolClientId: "28kp95h3rpm4emm9kpj2kn95mh",
			identityPoolId: "us-east-1:43908fa5-7f33-41c0-873f-9e4f934b9586",
		},
	},
});

const queryClient = new QueryClient();

const router = createRouter({
	routeTree,
	context: {
		queryClient,
		auth: {
			isSignedIn: false,
			user: null,
			idToken: null,
			...auth,
		},
	},
	defaultPreload: "intent",
	defaultPreloadStaleTime: 0,
	scrollRestoration: true,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</StrictMode>
	);
}
