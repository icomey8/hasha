import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import RecipeForm from "./RecipeForm";

type NewRecipeButtonProps = {
	resetDialog: () => void;
	onBrickCreate: (brickData: {
		image: string;
		title?: string;
		description?: string;
		ingredients?: { name: string; amount: string }[];
		steps?: string[];
		totalTime?: string;
		type?: string;
		cuisine?: string;
	}) => void;
	handleCategorySelect: (category: string) => void;
	dialogStep: "category" | "form";
	selectedCategory: string;
};

const NewRecipeButton = ({
	resetDialog,
	onBrickCreate,
}: NewRecipeButtonProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleSubmit = (recipeData: {
		title: string;
		ingredients: { name: string; amount: string }[];
		steps: string[];
		totalTime: string;
		type: string;
		cuisine: string;
	}) => {
		onBrickCreate({
			image:
				"https://i1.sndcdn.com/artworks-f5c1cd47-aee7-4017-b0e7-7c7194c9f1b3-0-t500x500.webp", // Fallback image
			title: recipeData.title || "Untitled Recipe",
			description: `${recipeData.type} • ${recipeData.cuisine} • ${recipeData.totalTime} mins`,
			ingredients: recipeData.ingredients,
			steps: recipeData.steps,
			totalTime: recipeData.totalTime,
			type: recipeData.type,
			cuisine: recipeData.cuisine,
		});
	};

	const handleClose = () => {
		setIsOpen(false);
		resetDialog();
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open);
				if (!open) resetDialog();
			}}
		>
			<DialogTrigger
				className="flex border items-center text-sm rounded-2xl p-1 px-2 cursor-pointer gap-1.5 hover:bg-accent"
				onClick={() => setIsOpen(true)}
			>
				<Plus size={16} /> New
			</DialogTrigger>
			<DialogContent className="!max-w-3xl">
				<RecipeForm onSubmit={handleSubmit} onClose={handleClose} />
			</DialogContent>
		</Dialog>
	);
};

export default NewRecipeButton;
