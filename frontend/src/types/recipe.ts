export type RecipeType = {
	image?: string;
	name?: string;
	description?: string;
	ingredients?: { name: string; amount: string }[];
	preparation?: { text: string }[];
	totalTime?: string;
	type?: string;
	cuisine?: string;
};

export type StoredRecipe = {
	name?: string;
	user_id: string;
	ingredients?: { name: string; amount: string }[];
	preparation?: { text: string }[];
	metadata: {
		total_time?: string;
		type?: string;
		cuisine?: string;
	};
};
