import NewRecipeButton from "./home/NewRecipeButton";
import type { RecipeType } from "@/types/recipe";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type NavbarProps = {
	handleRecipeCreate: (newRecipeData: RecipeType) => void;
	resetDialog: () => void;
	isSignedIn: boolean;
	handleSignOut: () => Promise<void>;
};

const Navbar = ({
	handleRecipeCreate,
	resetDialog,
	isSignedIn,
	handleSignOut,
}: NavbarProps) => {
	return (
		<div className="flex justify-between items-center">
			<div className="flex items-center text-xl gap-6">
				<h1>Hasha</h1>
				<NewRecipeButton
					onRecipeCreate={handleRecipeCreate}
					resetDialog={resetDialog}
				/>
			</div>
			<div className="flex items-center gap-4">
				{isSignedIn ? (
					<button
						onClick={handleSignOut}
						className="flex border border-gray-300 items-center text-sm rounded-2xl p-1 px-2 cursor-pointer gap-1.5 hover:bg-accent"
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
	);
};

export default Navbar;
