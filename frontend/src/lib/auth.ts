import {
	signUp,
	confirmSignUp,
	getCurrentUser,
	signIn,
	autoSignIn,
	signOut,
	fetchAuthSession,
} from "@aws-amplify/auth";

export const signUpUser = async (
	username: string,
	email: string,
	password: string
) => {
	const { nextStep: signUpNextStep } = await signUp({
		username: username,
		password: password,
		options: { userAttributes: { email: email }, autoSignIn: true },
	});

	return signUpNextStep;
};

export const signOutUser = async () => {
	try {
		await signOut();
		console.log("User signed out successfully");
	} catch (error) {
		console.error("Failed to sign out user:", error);
	}
};

export const confirmUser = async (
	username: string,
	confirmationCode: string
) => {
	const { isSignUpComplete, nextStep } = await confirmSignUp({
		username,
		confirmationCode,
	});
	return { isSignUpComplete, nextStep };
};

export const autoSignInUser = async () => {
	const { nextStep: autoSignInNextStep } = await autoSignIn();
	return autoSignInNextStep;
};

export const signInUser = async (username: string, password: string) => {
	const { nextStep: signInNextStep } = await signIn({
		username,
		password,
	});

	return signInNextStep;
};

export const checkCurrentUser = async () => {
	try {
		const user = await getCurrentUser();
		return {
			isSignedIn: !!user,
			user,
		};
	} catch (error) {
		console.error("Failed to get current user:", error);
		return {
			isSignedIn: false,
			user: null,
		};
	}
};

export async function getCurrentToken() {
	try {
		const session = await fetchAuthSession();
		console.log("Amplify Auth Session Tokens:", session.tokens);
		const idToken = session.tokens?.idToken?.toString() || null;
		return idToken;
	} catch (error) {
		console.error("Failed to fetch auth session:", error);
		return null;
	}
}
