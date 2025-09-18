import { type RecipeType } from "@/types/recipe";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateRecipe = ({ idToken }: { idToken: string }) => {
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
		},
		onError: (error) => {
			console.error("❌ Failed to create recipe:", error);
		},
	});

	return mutation;
};

export const useDeleteRecipe = ({
	idToken,
	recipeId,
}: {
	idToken: string;
	recipeId: number;
}) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async () => {
			if (!idToken) {
				throw new Error("User is not authenticated.");
			}
			// "http://0.0.0.0:80/recipes/delete-recipe"
			const response = await fetch(
				"https://hasha.onrender.com/recipes/delete-recipe",
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${idToken}`,
					},
					body: JSON.stringify({ id: recipeId }),
				}
			);

			if (!response.ok) throw new Error("Failed to delete recipe");
			return response.json();
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["getUserRecipes"] });
			console.log("✅ Recipe deleted successfully:", data);
		},
		onError: (error) => {
			console.error("❌ Failed to delete recipe:", error);
		},
	});

	return mutation;
};

export const useFetchRecipes = ({ idToken }: { idToken: string }) => {
	const getUserRecipes = useQuery({
		queryKey: ["getUserRecipes"],
		queryFn: async () => {
			if (!idToken) {
				throw new Error("User is not authenticated");
			}

			// "http://0.0.0.0:80/recipes"
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

	return getUserRecipes;
};
