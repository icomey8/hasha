import {
	createFileRoute,
	Link,
	useRouteContext,
	useRouter,
} from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowDownWideNarrow } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import NewRecipeButton from "@/components/home/NewRecipeButton";
import Recipe from "@/components/recipe-item";
import { type RecipeType } from "@/types/recipe";
import { useMutation, useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isSignedIn, signOutUser } = useRouteContext({
		from: "__root__",
		select: (c) => c.auth,
	});
	const { idToken } = useRouteContext({
		from: "__root__",
		select: (c) => c.auth,
	});
	const router = useRouter();

	const [recipes, setRecipes] = useState<RecipeType[]>([]);

	const mutation = useMutation({
		mutationFn: async (newRecipe: RecipeType) => {
			if (!idToken) {
				throw new Error("User is not authenticated");
			}

			const response = await fetch(
				// "http://0.0.0.0:80/recipes/create-recipe",
				"https://hasha.onrender.com/recipes/create-recipe",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${idToken}`,
					},
					body: JSON.stringify(newRecipe),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to create recipe");
			}

			return response.json();
		},
		onSuccess: (data) => {
			console.log("✅ Recipe created successfully:", data);
			resetDialog();
		},
		onError: (error) => {
			console.error("❌ Failed to create recipe:", error);
		},
	});

	const handleRecipeCreate = (newRecipeData: RecipeType) => {
		if (!idToken) {
			throw new Error("User is not authenticated");
		}

		const newRecipe = {
			id: Date.now(),
			image:
				newRecipeData.image ||
				"https://i.pinimg.com/1200x/bb/d8/7c/bbd87ca99b1849996d5d12f516f6cf94.jpg",
			name: newRecipeData.name || "Untitled Recipe",
			description: newRecipeData.description || "No description",
			ingredients: newRecipeData.ingredients || [],
			preparation: newRecipeData.preparation || [],
			totalTime: newRecipeData.totalTime || "",
			type: newRecipeData.type || "",
			cuisine: newRecipeData.cuisine || "",
		};
		setRecipes((prev) => [...prev, newRecipe]);
		console.log("The recipe is: ", newRecipe);

		console.log("the recipe is being sent to the backend");
		mutation.mutate(newRecipe);
	};

	const resetDialog = () => {
		// Simple reset function
	};

	const handleSignOut = async () => {
		await signOutUser();
		router.invalidate();
	};

	const getUserRecipes = useQuery({
		queryKey: ["getUserRecipes"],
		queryFn: async () => {
			if (!idToken) {
				throw new Error("User is not authenticated");
			}

			const response = await fetch("http://0.0.0.0:80/recipes", {
				headers: { Authorization: `Bearer ${idToken}` },
			});
			// const response = await fetch("https://hasha.onrender.com/recipes", {
			// 	headers: { Authorization: `Bearer ${idToken}` },
			// });

			if (!response.ok) {
				throw new Error("Failed to fetch recipes");
			}

			return response.json();
		},
		enabled: !!idToken,
	});

	const displayRecipes = getUserRecipes.data || recipes;

	if (getUserRecipes.isPending) {
		return (
			<div className="w-screen h-screen flex items-center justify-center">
				<span>Loading recipes...</span>
			</div>
		);
	}

	if (getUserRecipes.error) {
		return (
			<div className="w-screen h-screen flex items-center justify-center">
				<span>Error loading recipes: {getUserRecipes.error.message}</span>
			</div>
		);
	}

	return (
		<div className="w-screen h-screen p-8 py-4 flex flex-col">
			<div className="flex justify-between items-center">
				<div className="flex items-center text-xl gap-10">
					<h1>Saved Recipes</h1>
					<div className="flex gap-4">
						<NewRecipeButton
							onRecipeCreate={handleRecipeCreate}
							resetDialog={resetDialog}
						/>
						<Dialog>
							<DialogTrigger className="flex border items-center text-sm rounded-2xl p-1 px-2 cursor-pointer gap-1.5 hover:bg-accent">
								<ArrowDownWideNarrow size={16} /> Sort By
							</DialogTrigger>
						</Dialog>
					</div>
				</div>
				<div className="flex items-center gap-4">
					{isSignedIn ? (
						<button
							onClick={handleSignOut}
							className="flex border items-center text-sm rounded-2xl p-1 px-2 cursor-pointer gap-1.5 hover:bg-accent"
						>
							Sign Out
						</button>
					) : (
						<Link
							to="/login"
							className="flex border items-center text-sm rounded-2xl p-1 px-2 cursor-pointer gap-1.5 hover:bg-accent"
						>
							Sign In
						</Link>
					)}

					<Avatar>
						<AvatarImage src="https://i.pinimg.com/1200x/bb/d8/7c/bbd87ca99b1849996d5d12f516f6cf94.jpg" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</div>
			</div>

			<div className="flex-1 overflow-auto border-t mt-4 p-4 ">
				<div className="grid grid-cols-4 gap-4 auto-rows-min">
					{displayRecipes.map((recipe) => (
						<Recipe
							key={recipe.user_id}
							name={recipe.name}
							description={"nothing"}
							ingredients={recipe.ingredients}
							preparation={recipe.preparation}
							totalTime={recipe.metadata.totalTime}
							type={recipe.metadata.type}
							cuisine={recipe.metadata.cuisine}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
