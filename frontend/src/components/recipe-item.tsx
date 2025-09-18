import {
	Dialog,
	DialogTrigger,
	DialogHeader,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "./ui/dialog";
import { type RecipeType } from "@/types/recipe";
import { Pencil, Ellipsis } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { type SVGProps, useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { useDeleteRecipe } from "@/lib/queries";

const BowlRiceIcon = (
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		fill={"currentColor"}
		viewBox="0 0 24 24"
		{...props}
	>
		{/* Boxicons v3.0 https://boxicons.com | License  https://docs.boxicons.com/free */}
		<path d="M7 19.66V21c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-1.34c3.1-1.78 5-5.05 5-8.66 0-.55-.45-1-1-1a3.58 3.58 0 0 0-1.8-2.99c-.24-1.77-1.78-3.13-3.63-3.13-.34 0-.68.05-1.01.14-.68-.65-1.58-1.01-2.54-1.01s-1.87.37-2.54 1.01c-.33-.09-.67-.14-1.01-.14H8.4c-1.82.04-3.32 1.39-3.56 3.13A3.59 3.59 0 0 0 3.04 10c-.55 0-1 .45-1 1 0 3.61 1.9 6.87 5 8.66ZM6.11 8.61l.83-.25-.16-.85c0-.88.73-1.6 1.63-1.62.95.02 1.72.79 1.72 1.75h2c0-.93-.35-1.77-.92-2.43.24-.13.51-.2.79-.2.57 0 1.1.28 1.42.76l.51.77.81-.44c.25-.14.53-.21.83-.21.92 0 1.67.73 1.67 1.6l-.16.85.82.28c.62.21 1.03.76 1.09 1.39H5.02c.05-.63.47-1.19 1.09-1.39Z"></path>
	</svg>
);

type RecipeProps = RecipeType & { token: string };

const Recipe = ({
	name = "Untitled Recipe",
	id = 0,
	token = "",
	ingredients = [],
	preparation = [],
	totalTime = "",
	type = "",
	cuisine = "",
}: RecipeProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleDoubleClick = () => {
		setIsOpen(true);
	};

	const handleSingleClick = (e: React.MouseEvent) => {
		// Prevent dialog from opening on single click
		e.preventDefault();
		e.stopPropagation();
	};

	const deleteMutation = useDeleteRecipe({
		idToken: token || "",
		recipeId: id,
	});

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<div
					onDoubleClick={handleDoubleClick}
					onClick={handleSingleClick}
					className="relative aspect-[3/1] rounded-xl overflow-hidden border bg-[#f3f3f3] hover:border-gray-300 transition-colors duration-200 select-none"
				>
					<div className="flex items-center h-full p-4">
						<div className="flex-shrink-0 w-16 h-16  rounded-lg flex items-center justify-center border border-gray-200">
							<BowlRiceIcon />
						</div>

						<div className="flex-1 ml-4 flex flex-col h-full justify-center min-w-0">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold truncate">{name}</h3>
								<DropdownMenu>
									<DropdownMenuTrigger>
										<Ellipsis size={14} className="cursor-pointer" />
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuItem onClick={() => deleteMutation.mutate()}>
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
							<div className="flex gap-2 mt-3">
								<Badge
									variant={"outline"}
									className="text-xs h-4.5 text-[#978275]"
								>
									{type}
								</Badge>
								<Badge
									variant={"outline"}
									className="text-xs h-4.5 text-[#978275]"
								>
									{cuisine}
								</Badge>
								<Badge
									variant={"outline"}
									className="text-xs h-4.5 text-[#978275]"
								>
									{`${totalTime} min`}
								</Badge>
							</div>
						</div>
					</div>
				</div>
			</DialogTrigger>
			<DialogContent className="!max-w-4xl !w-full min-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-2xl font-semibold">
						{name} <Pencil size={14} className="cursor-pointer" />
					</DialogTitle>
					<DialogDescription>
						{`${type} • ${cuisine} • ${totalTime} mins`}
					</DialogDescription>
				</DialogHeader>

				{/* Left side - Ingredients */}
				<div className="grid grid-cols-1 md:grid-cols-[1fr_2.5fr] gap-12 w-full h-[400px]">
					<div>
						<h4 className="text-lg font-semibold mb-3">Ingredients</h4>
						<div className="space-y-2 overflow-y-scroll max-h-[350px]">
							{ingredients.length > 0 ? (
								ingredients.map((ingredient, index) => (
									<div
										key={index}
										className="flex justify-between items-center py-1 border-b  gap-3"
									>
										<span className="text-sm flex-1 break-words">
											{ingredient.name}
										</span>
										<span className="text-sm  flex-shrink-0">
											{ingredient.amount}
										</span>
									</div>
								))
							) : (
								<p className="text-sm">No ingredients listed</p>
							)}
						</div>
					</div>

					{/* Right side - Steps */}
					<div>
						<h4 className="text-lg font-semibold mb-3">Instructions</h4>
						<div className="space-y-3 overflow-y-scroll max-h-[350px]">
							{preparation.length > 0 && preparation[0]?.text !== "" ? (
								preparation.map((step, index) => (
									<div key={index} className="flex items-start gap-3 pb-1">
										<div className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold">
											{index + 1}
										</div>
										<p className="text-sm  leading-relaxed">{step.text}</p>
									</div>
								))
							) : (
								<p className=" text-sm">No instructions provided</p>
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default Recipe;
