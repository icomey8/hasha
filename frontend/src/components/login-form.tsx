import { GalleryVerticalEnd } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
	Link,
	useNavigate,
	useRouteContext,
	useRouter,
} from "@tanstack/react-router";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FormInputSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
});

export type FormInputType = z.infer<typeof FormInputSchema>;

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const { signInUser } = useRouteContext({
		from: "__root__",
		select: (c) => c.auth,
	});
	const navigate = useNavigate();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormInputType>({ resolver: zodResolver(FormInputSchema) });

	const onSignInSubmit: SubmitHandler<FormInputType> = async (data) => {
		try {
			const resultMessage = await signInUser(data.email, data.password);
			console.log("Login successful:", resultMessage);
			if (resultMessage.signInStep === "DONE") {
				await navigate({ to: "/" });
				router.invalidate();
			}
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<form onSubmit={handleSubmit(onSignInSubmit)}>
				<div className="flex flex-col gap-6">
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
						<div className="text-center text-sm">
							Don&apos;t have an account?{" "}
							<Link to="/signup" className="underline underline-offset-4">
								Sign up
							</Link>
						</div>
					</div>
					<div className="flex flex-col gap-6">
						<div className="grid gap-3">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								{...register("email", { required: true })}
								aria-invalid={errors.email ? "true" : "false"}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="$trongp4ssword"
								{...register("password", { required: true })}
								aria-invalid={errors.password ? "true" : "false"}
							/>
						</div>
						<Button type="submit" className="w-full">
							Login
						</Button>
					</div>
				</div>
			</form>
			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
				and <a href="#">Privacy Policy</a>.
			</div>
		</div>
	);
}
