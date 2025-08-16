import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";

export interface InfraStackProps extends cdk.StackProps {
	preTokenFn: lambda.Function;
	postConfirmationFn: lambda.Function;
}

export class InfraStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: InfraStackProps) {
		super(scope, id, props);

		const hashaUserPool = new cognito.UserPool(this, "hasha-user-pool", {
			userPoolName: "hasha-user-pool",
			selfSignUpEnabled: true,
			userVerification: {
				emailSubject: "Verify your email to start using Hasha",
				emailBody:
					"Thank you for signing up for Hasha! Your verification code is {####}.",
				emailStyle: cognito.VerificationEmailStyle.CODE,
			},
			signInAliases: {
				email: true,
				username: true,
			},
			standardAttributes: {
				email: {
					mutable: true,
					required: true,
				},
			},
			passwordPolicy: {
				minLength: 8,
				requireDigits: true,
				requireSymbols: true,
			},
			removalPolicy: cdk.RemovalPolicy.DESTROY,
			accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
			lambdaTriggers: {
				preTokenGeneration: props.preTokenFn,
				postConfirmation: props.postConfirmationFn,
			},
		});

		const client = hashaUserPool.addClient("hasha-user-pool-client", {
			authFlows: {
				adminUserPassword: true,
				userPassword: true,
				userSrp: true,
			},
			accessTokenValidity: cdk.Duration.hours(1),
			idTokenValidity: cdk.Duration.hours(1),
			refreshTokenValidity: cdk.Duration.days(30),
			preventUserExistenceErrors: true,
		});

		const identityPool = new cognito.CfnIdentityPool(
			this,
			"hasha-identity-pool",
			{
				identityPoolName: "hasha-identity-pool",
				allowUnauthenticatedIdentities: false,
				cognitoIdentityProviders: [
					{
						clientId: client.userPoolClientId,
						providerName: hashaUserPool.userPoolProviderName,
					},
				],
			}
		);

		const authenticatedRole = new iam.Role(this, "CognitoAuthenticatedRole", {
			assumedBy: new iam.FederatedPrincipal("cognito-identity.amazonaws.com", {
				StringEquals: {
					"cognito-identity.amazonaws.com:aud": identityPool.ref,
				},
				"ForAnyValue:StringLike": {
					"cognito-identity.amazonaws.com:amr": "authenticated",
				},
			}, "sts:AssumeRoleWithWebIdentity"),
		});

		authenticatedRole.addToPolicy(
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				actions: [
					"mobileanalytics:PutEvents",
					"cognito-sync:*",
					"cognito-identity:*",
				],
				resources: ["*"],
			})
		);

		const CfnIdentityPoolRoleAttachment =
			new cognito.CfnIdentityPoolRoleAttachment(
				this,
				"IdentityPoolRoleAttachment",
				{
					identityPoolId: identityPool.ref,
					roles: {
						authenticated: authenticatedRole.roleArn,
					},
				}
			);

		new cdk.CfnOutput(this, "UserPoolId", {
			value: hashaUserPool.userPoolId,
			description: "User Pool ID",
		});
		new cdk.CfnOutput(this, "UserPoolClientId", {
			value: client.userPoolClientId,
			description: "User Pool Client ID",
		});
		new cdk.CfnOutput(this, "IdentityPoolId", {
			value: identityPool.ref,
			description: "Identity Pool ID",
		});
		new cdk.CfnOutput(this, "Region", {
			value: this.region,
			description: "AWS Region",
		});
		new cdk.CfnOutput(this, "PreTokenFnName", {
			value: props.preTokenFn.functionName,
			description: "Pre Token Generation Lambda Function Name",
		});
	}
}
