// import { useState } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogHeader,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "./ui/dialog";
import { type RecipeType } from "@/types/recipe";

const Recipe = ({
	name = "Untitled Recipe",
	description = "No description",
	ingredients = [],
	preparation = [],
	totalTime = "",
	type = "",
	cuisine = "",
}: RecipeType) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<div
					className="relative aspect-[3/1] rounded-xl overflow-hidden cursor-pointer border bg-[#f3f3f3] hover:border-gray-300 transition-colors duration-200"
					// onMouseEnter={() => setIsHover(true)}
					// onMouseLeave={() => setIsHover(false)}
				>
					<div className="flex items-center h-full p-4">
						<div className="flex-shrink-0 w-16 h-16  rounded-lg flex items-center justify-center border border-gray-200">
							<span className="text-2xl">👨‍🍳</span>
						</div>

						<div className="flex-1 ml-4 flex flex-col justify-center min-w-0">
							<h3 className="text-lg font-semibold truncate">{name}</h3>
							<p className="text-sm  mt-1 truncate">{description}</p>
						</div>
					</div>
				</div>
			</DialogTrigger>
			<DialogContent className="!max-w-4xl !w-full min-w-[500px]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-semibold">{name}</DialogTitle>
					<DialogDescription>
						{type && cuisine && totalTime
							? `${type} • ${cuisine} • ${totalTime} mins`
							: description}
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
