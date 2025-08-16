import { SignUpForm } from "./components/sign-up/signup-form";

const SignUpPage = () => {
	return (
		<div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="w-full max-w-sm">
				<SignUpForm />
			</div>
		</div>
	);
};

export default SignUpPage;
