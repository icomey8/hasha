import { createRootRouteWithContext } from "@tanstack/react-router";
import App from "@/App";
import { QueryClient } from "@tanstack/react-query";
import type { AuthUser } from "aws-amplify/auth";
import * as auth from "@/lib/auth";

export type AuthContext = {
	isSignedIn: boolean;
	user: AuthUser | null;
	idToken: string | null;
} & typeof auth;

interface MyRouterContext {
	queryClient: QueryClient;
	auth: AuthContext;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async ({ context }) => {
		const { isSignedIn, user } = await context.auth.checkCurrentUser();
		const idToken = await context.auth.getCurrentToken();

		return {
			auth: {
				...context.auth,
				isSignedIn,
				idToken,
				user,
			},
		};
	},
	component: App,
});
