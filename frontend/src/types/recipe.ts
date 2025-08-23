export type RecipeType = {
	image?: string;
	recipe_name?: string;
	description?: string;
	ingredients?: { name: string; amount: string }[];
	preparation?: { text: string }[];
	totalTime?: string;
	type?: string;
	cuisine?: string;
};
