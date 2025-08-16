import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import type { SVGProps } from "react";

const YouTube = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 256 180"
		width="1em"
		height="1em"
		xmlns="http://www.w3.org/2000/svg"
		preserveAspectRatio="xMidYMid"
		{...props}
	>
		<path
			d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z"
			fill="red"
		/>
		<path fill="#FFF" d="m102.421 128.06 66.328-38.418-66.328-38.418z" />
	</svg>
);

type NewBrickButtonProps = {
	resetDialog: () => void;
	onBrickCreate: (brickData: {
		image: string;
		title?: string;
		description?: string;
	}) => void;
	handleCategorySelect: (category: string) => void;
	dialogStep: "category" | "form";
	selectedCategory: string;
};

const NewBrickButton = ({
	resetDialog,
	onBrickCreate,
	handleCategorySelect,
	dialogStep,
	selectedCategory,
}: NewBrickButtonProps) => {
	const handleSubmit = () => {
		onBrickCreate({
			image:
				"https://i1.sndcdn.com/artworks-f5c1cd47-aee7-4017-b0e7-7c7194c9f1b3-0-t500x500.webp", // Fallback image
			title: "test",
			description: "test",
		});
	};

	return (
		<Dialog onOpenChange={(open) => !open && resetDialog()}>
			<DialogTrigger className="flex border items-center text-sm rounded-2xl p-1 px-2 cursor-pointer gap-1.5 hover:bg-accent">
				<Plus size={16} /> New
			</DialogTrigger>
			<DialogContent className="!max-w-2xl">
				{dialogStep === "category" ? (
					<>
						<DialogHeader>
							<DialogTitle>Select Category</DialogTitle>
							<DialogDescription>
								Choose a category for your new item.
							</DialogDescription>
						</DialogHeader>
						<div className="grid grid-cols-4 gap-4">
							<CategoryBox onClick={() => handleCategorySelect("youtube")}>
								<YouTube className="text-4xl" />
								<h1>YouTube</h1>
							</CategoryBox>
							<CategoryBox onClick={() => handleCategorySelect("movies")}>
								<h1 className="text-4xl">🎬</h1>
								<h1>Film & TV</h1>
							</CategoryBox>
							<CategoryBox onClick={() => handleCategorySelect("tv")}>
								<h1 className="text-4xl">📚</h1>
								<h1>Books</h1>
							</CategoryBox>
							<CategoryBox onClick={() => handleCategorySelect("nyt")}>
								<h1 className="text-4xl">📰</h1>
								<h1>NYT</h1>
							</CategoryBox>
						</div>
					</>
				) : (
					<>
						<DialogHeader>
							<DialogTitle>Search {selectedCategory}</DialogTitle>
							<DialogDescription>
								Fill out the form for your {selectedCategory} item.
							</DialogDescription>
						</DialogHeader>
						<div className="p-8">
							<p>Form content will go here for: {selectedCategory}</p>
						</div>
						<button
							onClick={handleSubmit}
							className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
						>
							Create Brick
						</button>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};

function CategoryBox({
	children,
	onClick,
}: {
	children: React.ReactNode;
	onClick: () => void;
}) {
	return (
		<div
			className="cursor-pointer border rounded-lg w-32 h-32 hover:bg-accent text-muted-foreground flex flex-col items-center justify-center gap-3"
			onClick={onClick}
		>
			{children}
		</div>
	);
}

export default NewBrickButton;
