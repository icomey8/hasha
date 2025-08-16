import {
	createFileRoute,
	Link,
	useRouteContext,
	useRouter,
} from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dot, ArrowDownWideNarrow } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import NewBrickButton from "@/components/home/NewBrickButton";
import Brick from "@/components/brick";
import { useQuery } from "@tanstack/react-query";

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

	const [dialogStep, setDialogStep] = useState<"category" | "form">("category");
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [bricks, setBricks] = useState([
		{
			id: 1,
			image:
				"https://cdn.cosmos.so/c4653e73-d082-42e9-87d2-5377d7e6a7f3?format=jpeg",
		},
		{
			id: 2,
			image:
				"https://cdn.cosmos.so/0ea26e1b-6e2c-4a85-836f-9048027b7a0f?format=jpeg",
		},
		{
			id: 3,
			image:
				"https://xl.movieposterdb.com/24_12/2025/5950044/xl_superman-movie-poster_e4162d63.jpg?v=2025-07-21%2010:28:55",
		},
		{
			id: 4,
			image:
				"https://cdn.cosmos.so/919713f5-9a86-4333-bb21-1421bc538219?format=jpeg",
		},
		{
			id: 5,
			image:
				"https://posters.movieposterdb.com/05_03/1995/0113277/l_10324_0113277_21d91b53.jpg",
		},
	]);

	const { data } = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			console.log("=== FRONTEND FETCH DEBUG ===");
			console.log("Token starts with:", idToken?.substring(0, 50));

			const response = await fetch("https://hasha.onrender.com/users", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${idToken}`,
				},
			});

			console.log("Response status:", response.status);
			console.log("Response ok:", response.ok);

			if (!response.ok) {
				console.error("Response not ok:", response.status, response.statusText);
				throw new Error(`HTTP error! ${response.status}`);
			}

			const data = await response.json();
			console.log("Response data:", data);
			return data;
		},
		enabled: !!idToken,
	});

	console.log(data);

	const handleCategorySelect = (category: string) => {
		setSelectedCategory(category);
		setDialogStep("form");
	};

	const handleBrickCreate = (newBrickData: {
		image: string;
		title?: string;
		description?: string;
	}) => {
		const newBrick = {
			id: Date.now(),
			...newBrickData,
		};
		setBricks((prev) => [...prev, newBrick]);
		resetDialog();
	};

	const resetDialog = () => {
		setTimeout(() => {
			setDialogStep("category");
			setSelectedCategory("");
		}, 150);
	};

	const handleSignOut = async () => {
		await signOutUser();
		router.invalidate();
	};

	return (
		<div className="w-screen h-screen p-8 py-4 flex flex-col">
			<div className="flex justify-between items-center">
				<div className="flex items-center text-xl gap-10">
					<div className="flex items-center gap-1">
						<h1>bricks</h1>
						<Dot size={24} />
						<h1 className="text-muted-foreground">boxes</h1>
					</div>
					<div className="flex gap-4">
						<NewBrickButton
							onBrickCreate={handleBrickCreate}
							resetDialog={resetDialog}
							handleCategorySelect={handleCategorySelect}
							dialogStep={dialogStep}
							selectedCategory={selectedCategory}
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

			<div className="flex-1 overflow-auto border rounded-xl mt-4 p-4 ">
				<div className="grid grid-cols-5 gap-3 auto-rows-min">
					{bricks.map((brick) => (
						<Brick key={brick.id} image={brick.image} />
					))}
				</div>
			</div>
		</div>
	);
}
