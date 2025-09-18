import { GalleryVerticalEnd } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
import ConfirmSignUp from "./confirm-signup";
import { useNavigate } from "@tanstack/react-router";

const FormInputSchema = z.object({
	username: z.string().min(5, "Username must be at least 5 characters"),
	email: z.email(),
	password: z.string().min(8),
});
const ConfirmationCodeSchema = z.object({
	code: z.string().min(6, "Verification code must be 6 characters long"),
});

export type FormInputType = z.infer<typeof FormInputSchema>;
export type ConfirmationCodeType = z.infer<typeof ConfirmationCodeSchema>;

export function SignUpForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [username, setUsername] = useState("");
	const [isConfirmationStep, setIsConfirmationStep] = useState(false);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormInputType>({ resolver: zodResolver(FormInputSchema) });

	const {
		register: registerCode,
		handleSubmit: handleCodeSubmit,
		formState: { errors: codeErrors },
	} = useForm<ConfirmationCodeType>({
		resolver: zodResolver(ConfirmationCodeSchema),
	});

	const { signUpUser, confirmUser, autoSignInUser } = useRouteContext({
		from: "__root__",
		select: (c) => c.auth,
	});

	const onSignUpSubmit: SubmitHandler<FormInputType> = async (data) => {
		console.log(data);
		try {
			const nextStep = await signUpUser(
				data.username,
				data.email,
				data.password
			);
			console.log("User signed up successfully");
			console.log("next step:", nextStep.signUpStep);
			if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
				setUsername(data.username);
				setIsConfirmationStep(true);
			}
		} catch (error) {
			throw new Error("Failed to sign up user: " + error);
		}
	};

	const onConfirmSubmit: SubmitHandler<ConfirmationCodeType> = async (data) => {
		try {
			const { isSignUpComplete, nextStep } = await confirmUser(
				username,
				data.code
			);

			console.log("User confirmed successfully:", isSignUpComplete);
			if (nextStep.signUpStep === "COMPLETE_AUTO_SIGN_IN") {
				const autoSignInNextStep = await autoSignInUser();
				if (autoSignInNextStep.signInStep === "DONE") {
					navigate({ to: "/" });
				}
			}
		} catch (error) {
			console.error("Failed to confirm sign up", error);
		}
	};

	if (isConfirmationStep) {
		return (
			<ConfirmSignUp
				handleCodeSubmit={handleCodeSubmit}
				onConfirmSubmit={onConfirmSubmit}
				registerCode={registerCode}
				codeErrors={codeErrors}
			/>
		);
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<form onSubmit={handleSubmit(onSignUpSubmit)}>
				<div className="flex flex-col gap-6 ">
					<div className="flex flex-col items-center gap-2">
						<a
							href="#"
							className="flex flex-col items-center gap-2 font-medium"
						>
							<div className="flex size-8 items-center justify-center rounded-md">
								<GalleryVerticalEnd className="size-6" />
							</div>
						</a>
						<h1 className="text-xl font-bold">Welcome to Hasha</h1>
					</div>
					<div className="flex flex-col gap-6">
						<div className="grid gap-3">
							<div className="col-start-1 flex flex-col gap-3">
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									type="text"
									placeholder="Enter your username"
									{...register("username", { required: true })}
									aria-invalid={errors.username ? "true" : "false"}
								/>
							</div>
							<div className="col-start-2 gap-3 flex flex-col">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="text"
									placeholder="m@example.com"
									{...register("email", { required: true })}
									aria-invalid={errors.email ? "true" : "false"}
								/>
							</div>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="text"
								placeholder="Enter password"
								{...register("password", { required: true })}
								aria-invalid={errors.password ? "true" : "false"}
							/>
						</div>
						<Button type="submit" className="w-full">
							Submit
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}
