import NewRecipeButton from "./home/NewRecipeButton";
import type { RecipeType } from "@/types/recipe";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Trash2, LogOut, LogIn } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
} from "./ui/dropdown-menu";

type NavbarProps = {
	handleRecipeCreate: (newRecipeData: RecipeType) => void;
	isSignedIn: boolean;
	handleSignOut: () => Promise<void>;
	handleDeleteUser: () => Promise<void>;
};

const Navbar = ({
	handleRecipeCreate,
	isSignedIn,
	handleSignOut,
	handleDeleteUser,
}: NavbarProps) => {
	return (
		<div className="flex justify-between items-center">
			<div className="flex items-center text-xl gap-6">
				<h1>Hasha</h1>
				<NewRecipeButton onRecipeCreate={handleRecipeCreate} />
			</div>
			<div className="flex items-center gap-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<div className="flex text-sm items-center gap-2 px-1 cursor-pointer">
							<Avatar>
								<AvatarFallback className="bg-foreground text-background">
									U
								</AvatarFallback>
							</Avatar>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuGroup>
							{isSignedIn ? (
								<DropdownMenuItem onClick={handleSignOut}>
									<LogOut />
									Sign Out
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem>
									<LogIn />
									<Link to="/login">Sign In</Link>
								</DropdownMenuItem>
							)}
							<DropdownMenuItem
								className="text-red-600"
								onClick={handleDeleteUser}
							>
								<Trash2 color="#fb2c36" />
								Delete Account
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};

export default Navbar;
