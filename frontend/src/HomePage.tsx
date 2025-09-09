import { useRouteContext, useRouter } from "@tanstack/react-router";
import Recipe from "@/components/recipe-item";
import { type RecipeType, type StoredRecipe } from "@/types/recipe";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";

const HomePage = () => {
	const { isSignedIn, signOutUser } = useRouteContext({
		from: "__root__",
		select: (c) => c.auth,
	});
	const { idToken } = useRouteContext({
		from: "__root__",
		select: (c) => c.auth,
	});

	const router = useRouter();

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

			// const response = await fetch("http://0.0.0.0:80/recipes", {
			// 	headers: { Authorization: `Bearer ${idToken}` },
			// });
			const response = await fetch("https://hasha.onrender.com/recipes", {
				headers: { Authorization: `Bearer ${idToken}` },
			});

			if (!response.ok) {
				throw new Error("Failed to fetch recipes");
			}

			return response.json();
		},
		enabled: !!idToken,
	});

	if (getUserRecipes.error) {
		return (
			<div className="w-screen h-screen flex items-center justify-center">
				<span>Error loading recipes: {getUserRecipes.error.message}</span>
			</div>
		);
	}

	return (
		<div className="w-screen h-screen p-8 py-4 flex flex-col">
			<Navbar
				handleRecipeCreate={handleRecipeCreate}
				resetDialog={resetDialog}
				isSignedIn={isSignedIn}
				handleSignOut={handleSignOut}
			/>

			<div className="flex-1 overflow-auto border-t mt-4 pt-4 ">
				<div className="grid grid-cols-4 gap-4 auto-rows-min">
					{getUserRecipes.isPending
						? Array.from({ length: 4 }).map((_, index) => (
								<Skeleton
									key={index}
									className="aspect-[3/1] rounded-xl bg-[#f3f3f3]"
								/>
							))
						: getUserRecipes.data.map((recipe: StoredRecipe) => (
								<Recipe
									key={recipe.user_id}
									name={recipe.name}
									ingredients={recipe.ingredients}
									preparation={recipe.preparation}
									totalTime={recipe.metadata.total_time}
									type={recipe.metadata.type}
									cuisine={recipe.metadata.cuisine}
								/>
							))}
				</div>
			</div>
		</div>
	);
};

export default HomePage;
