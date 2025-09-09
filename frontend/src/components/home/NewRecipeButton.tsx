import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import RecipeForm from "./RecipeForm";
import { type RecipeType } from "@/types/recipe";

type NewRecipeButtonProps = {
	resetDialog: () => void;
	onRecipeCreate: (recipeData: RecipeType) => void;
};

const NewRecipeButton = ({
	resetDialog,
	onRecipeCreate,
}: NewRecipeButtonProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleSubmit = (recipeData: RecipeType) => {
		onRecipeCreate({
			name: recipeData.name || "Untitled Recipe",
			description: `${recipeData.type} • ${recipeData.cuisine} • ${recipeData.totalTime} mins`,
			ingredients: recipeData.ingredients,
			preparation: recipeData.preparation,
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
				className="flex border border-gray-300 items-center text-sm rounded-2xl p-1 px-2 cursor-pointer gap-1.5"
				onClick={() => setIsOpen(true)}
			>
				<Plus size={16} /> New
			</DialogTrigger>
			<DialogContent className="!max-w-3xl">
				<DialogTitle>Create a New Recipe</DialogTitle>
				<RecipeForm onSubmit={handleSubmit} onClose={handleClose} />
			</DialogContent>
		</Dialog>
	);
};

export default NewRecipeButton;
