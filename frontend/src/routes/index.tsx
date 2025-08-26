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
import { useMutation } from "@tanstack/react-query";
// import { supabase } from "@/lib/supabase";

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

	const [recipes, setRecipes] = useState([
		{
			id: 2,
			image:
				"https://cdn.cosmos.so/0ea26e1b-6e2c-4a85-836f-9048027b7a0f?format=jpeg",
			name: "Mom's Spaghetti & Meatballs",
			description: "Entree • Italian • 30 mins",
			ingredients: [
				{ name: "Pasta", amount: "1 lb" },
				{ name: "Tomatoes", amount: "2 cups" },
				{
					name: "Large garlic cloves, crushed but left whole",
					amount: "4 cloves",
				},
				{
					name: "Pecorino Romano or Parmesan",
					amount: "4 oz",
				},
			],
			preparation: [
				{ text: "Bring a large pot of salted water to a boil." },
				{
					text: "Heat a large, high-sided skillet over medium-high. Add the oil and bacon and cook, stirring occasionally, until the bacon is crispy at the edges, about 5 minutes. Carefully drain all but 3 tablespoons of the fat, reserving any excess for later.",
				},
				{
					text: "Lower the heat to medium. Stir in the red-pepper flakes, oregano and garlic and cook, stirring constantly, until fragrant, just a few seconds. Add the onion, season generously with salt and pepper and cook over medium-high, stirring, until the onion is translucent, about 5 minutes. Add more bacon fat if the pan dries out. Add the tomato paste and stir constantly until slightly darker in color, about 3 minutes. Turn off the heat and stir in the vodka.",
				},
				{
					text: "Lower the heat to medium. Stir in the red-pepper flakes, oregano and garlic and cook, stirring constantly, until fragrant, just a few seconds. Add the onion, season generously with salt and pepper and cook over medium-high, stirring, until the onion is translucent, about 5 minutes. Add more bacon fat if the pan dries out. Add the tomato paste and stir constantly until slightly darker in color, about 3 minutes. Turn off the heat and stir in the vodka.",
				},
			],
			totalTime: "30",
			type: "Entree",
			cuisine: "Italian",
		},
		{
			id: 3,
			image:
				"https://cdn.cosmos.so/0ea26e1b-6e2c-4a85-836f-9048027b7a0f?format=jpeg",
			name: "Another Recipe",
			description: "Dessert • American • 45 mins",
		},
		{
			id: 4,
			image:
				"https://cdn.cosmos.so/0ea26e1b-6e2c-4a85-836f-9048027b7a0f?format=jpeg",
			name: "Third Recipe",
			description: "Appetizer • Mexican • 15 mins",
		},
		{
			id: 5,
			image:
				"https://cdn.cosmos.so/0ea26e1b-6e2c-4a85-836f-9048027b7a0f?format=jpeg",
			name: "Fourth Recipe",
			description: "Side • Chinese • 20 mins",
		},
	]);

	const mutation = useMutation({
		mutationFn: (newRecipe: RecipeType) => {
			if (!idToken) {
				throw new Error("User is not authenticated");
			}

			// return fetch("http://0.0.0.0:80/recipes/create-recipe", {
			return fetch("https://hasha.onrender.com/recipes/create-recipe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${idToken}`,
				},
				body: JSON.stringify(newRecipe),
			});
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

		if (!idToken) {
			throw new Error("User is not authenticated");
		}

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
					{recipes.map((recipe) => (
						<Recipe
							key={recipe.id}
							image={recipe.image}
							name={recipe.name}
							description={recipe.description}
							ingredients={recipe.ingredients}
							preparation={recipe.preparation}
							totalTime={recipe.totalTime}
							type={recipe.type}
							cuisine={recipe.cuisine}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
