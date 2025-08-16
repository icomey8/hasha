import { GalleryVerticalEnd } from "lucide-react";
import {
	type UseFormRegister,
	type FieldErrors,
	type SubmitHandler,
	type UseFormHandleSubmit,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import type { ConfirmationCodeType } from "./signup-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ConfirmationType = {
	handleCodeSubmit: UseFormHandleSubmit<{ code: string }, { code: string }>;
	onConfirmSubmit: SubmitHandler<ConfirmationCodeType>;
	registerCode: UseFormRegister<{ code: string }>;
	codeErrors: FieldErrors<{
		code: string;
	}>;
	className?: string;
} & React.ComponentProps<"div">;

const ConfirmSignUp = ({
	handleCodeSubmit,
	onConfirmSubmit,
	registerCode,
	codeErrors,
	className,
	...props
}: ConfirmationType) => {
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<form onSubmit={handleCodeSubmit(onConfirmSubmit)}>
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
						<h1 className="text-xl font-bold">Check your email</h1>
						<p className="text-muted-foreground text-sm text-center">
							We've sent a verification code to your email address.
						</p>
					</div>
					<div className="flex flex-col gap-6">
						<div className="grid gap-3">
							<Label htmlFor="code">Verification Code</Label>
							<Input
								id="code"
								type="text"
								placeholder="Enter your code"
								{...registerCode("code", { required: true })}
								aria-invalid={codeErrors.code ? "true" : "false"}
							/>
							{codeErrors.code && (
								<p className="text-sm text-red-500">
									{codeErrors.code.message}
								</p>
							)}
						</div>
						<Button type="submit" className="w-full">
							Verify
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default ConfirmSignUp;
