import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class LambdaStack extends cdk.Stack {
	public readonly preTokenFn: lambda.Function;
	public readonly postConfirmationFn: lambda.Function;

	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const backendUrl = process.env.BACKEND_URL;
		const backendSecret = process.env.BACKEND_SECRET;

		if (!backendUrl || !backendSecret) {
			throw new Error(
				"BACKEND_URL and BACKEND_SECRET environment variables are required. Please check your .env file or set them manually."
			);
		}

		this.preTokenFn = new lambda.Function(this, "PreTokenGenerationFn", {
			runtime: lambda.Runtime.NODEJS_22_X,
			handler: "index.handler",
			code: lambda.Code.fromAsset("lambda/pre-token"),
			description: "Pre Token Generation trigger to add Supabase role claim",
			memorySize: 256,
			timeout: cdk.Duration.seconds(15),
		});

		this.postConfirmationFn = new lambda.Function(this, "PostConfirmationFn", {
			runtime: lambda.Runtime.NODEJS_22_X,
			handler: "index.handler",
			code: lambda.Code.fromAsset("lambda/post-confirmation"),
			description: "Post Confirmation trigger to populate user in Supabase",
			memorySize: 256,
			timeout: cdk.Duration.seconds(15),
			environment: {
				BACKEND_URL: backendUrl,
				BACKEND_SECRET: backendSecret,
			},
		});
	}
}
