import { useRouteContext, useRouter } from "@tanstack/react-router";
import Recipe from "@/components/recipe-item";
import { type RecipeType, type StoredRecipe } from "@/types/recipe";
import { useCreateRecipe, useFetchRecipes } from "./lib/queries";
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
		addMutation.mutate(newRecipe);
	};

	const handleSignOut = async () => {
		await signOutUser();
		router.invalidate();
	};

	const recipes = useFetchRecipes({ idToken: idToken || "" });
	const addMutation = useCreateRecipe({ idToken: idToken || "" });

	if (recipes.error) {
		return (
			<div className="w-screen h-screen flex items-center justify-center">
				<span>Error loading recipes: {recipes.error.message}</span>
			</div>
		);
	}

	console.log("Recipes data:", recipes.data);

	return (
		<div className="w-screen h-screen p-8 py-4 flex flex-col">
			<Navbar
				handleRecipeCreate={handleRecipeCreate}
				isSignedIn={isSignedIn}
				handleSignOut={handleSignOut}
			/>

			<div className="flex-1 overflow-auto border-t mt-4 pt-4 ">
				<div className="grid grid-cols-4 gap-4 auto-rows-min">
					{recipes.isPending
						? Array.from({ length: 4 }).map((_, index) => (
								<Skeleton
									key={index}
									className="aspect-[3/1] rounded-xl bg-[#f3f3f3]"
								/>
							))
						: recipes.data.map((recipe: StoredRecipe) => (
								<Recipe
									key={recipe.user_id}
									id={recipe.id}
									token={idToken || ""}
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
