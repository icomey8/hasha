import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, ChefHat, Plus, Minus } from "lucide-react";

type RecipeFormProps = {
	onSubmit: (data: any) => void;
	onClose?: () => void;
};

const RecipeForm = ({ onSubmit, onClose }: RecipeFormProps) => {
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState({
		title: "",
		ingredients: [{ name: "", amount: "" }],
		steps: [""],
		totalTime: "",
		type: "",
		cuisine: "",
	});

	const handleNext = () => {
		if (currentStep < 3) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrevious = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSubmit = () => {
		onSubmit(formData);
		onClose?.();
	};

	const updateFormData = (field: string, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const addIngredient = () => {
		setFormData((prev) => ({
			...prev,
			ingredients: [...prev.ingredients, { name: "", amount: "" }],
		}));
	};

	const removeIngredient = (index: number) => {
		setFormData((prev) => ({
			...prev,
			ingredients: prev.ingredients.filter((_, i) => i !== index),
		}));
	};

	const updateIngredient = (index: number, field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			ingredients: prev.ingredients.map((ing, i) =>
				i === index ? { ...ing, [field]: value } : ing
			),
		}));
	};

	const addStep = () => {
		setFormData((prev) => ({
			...prev,
			steps: [...prev.steps, ""],
		}));
	};

	const removeStep = (index: number) => {
		setFormData((prev) => ({
			...prev,
			steps: prev.steps.filter((_, i) => i !== index),
		}));
	};

	const updateStep = (index: number, value: string) => {
		setFormData((prev) => ({
			...prev,
			steps: prev.steps.map((step, i) => (i === index ? value : step)),
		}));
	};

	const renderStep1 = () => (
		<div className="space-y-6">
			<div>
				<Label htmlFor="title">Recipe Title</Label>
				<Input
					id="title"
					value={formData.title}
					onChange={(e) => updateFormData("title", e.target.value)}
					placeholder="Enter recipe title"
					className="mt-1"
				/>
			</div>

			<div>
				<div className="flex items-center justify-between mb-4">
					<Label>Ingredients</Label>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={addIngredient}
						className="gap-2 cursor-pointer"
					>
						<Plus className="w-4 h-4" />
						Add Ingredient
					</Button>
				</div>
				<div className="space-y-3">
					{formData.ingredients.map((ingredient, index) => (
						<div key={index} className="flex gap-2">
							<div className="flex-1">
								<Input
									value={ingredient.name}
									onChange={(e) =>
										updateIngredient(index, "name", e.target.value)
									}
									placeholder="Ingredient name"
								/>
							</div>
							<div className="w-32">
								<Input
									value={ingredient.amount}
									onChange={(e) =>
										updateIngredient(index, "amount", e.target.value)
									}
									placeholder="Amount"
								/>
							</div>
							{formData.ingredients.length > 1 && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => removeIngredient(index)}
									className="cursor-pointer"
								>
									<Minus className="w-4 h-4" />
								</Button>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);

	const renderStep2 = () => (
		<div className="space-y-6">
			<div>
				<div className="flex items-center justify-between mb-4">
					<Label>Cooking Steps</Label>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={addStep}
						className="gap-2 cursor-pointer"
					>
						<Plus className="w-4 h-4" />
						Add Step
					</Button>
				</div>
				<div className="space-y-4">
					{formData.steps.map((step, index) => (
						<div key={index} className="flex gap-2">
							<div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold mt-1">
								{index + 1}
							</div>
							<div className="flex-1">
								<textarea
									value={step}
									onChange={(e) => updateStep(index, e.target.value)}
									placeholder={`Describe step ${index + 1}...`}
									rows={3}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							{formData.steps.length > 1 && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => removeStep(index)}
									className="mt-1 cursor-pointer"
								>
									<Minus className="w-4 h-4" />
								</Button>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);

	const renderStep3 = () => (
		<div className="space-y-6">
			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label htmlFor="totalTime">Total Time (minutes)</Label>
					<Input
						id="totalTime"
						type="number"
						value={formData.totalTime}
						onChange={(e) => updateFormData("totalTime", e.target.value)}
						placeholder="e.g. 30"
						className="mt-1"
					/>
				</div>
				<div>
					<Label htmlFor="type">Recipe Type</Label>
					<select
						id="type"
						value={formData.type}
						onChange={(e) => updateFormData("type", e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
					>
						<option value="">Select type</option>
						<option value="appetizer">Appetizer</option>
						<option value="entree">Entree</option>
						<option value="dessert">Dessert</option>
						<option value="side">Side Dish</option>
						<option value="beverage">Beverage</option>
					</select>
				</div>
			</div>

			<div>
				<Label htmlFor="cuisine">Cuisine</Label>
				<select
					id="cuisine"
					value={formData.cuisine}
					onChange={(e) => updateFormData("cuisine", e.target.value)}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
				>
					<option value="">Select cuisine</option>
					<option value="american">American</option>
					<option value="italian">Italian</option>
					<option value="chinese">Chinese</option>
					<option value="mexican">Mexican</option>
					<option value="indian">Indian</option>
					<option value="french">French</option>
					<option value="japanese">Japanese</option>
					<option value="thai">Thai</option>
					<option value="other">Other</option>
				</select>
			</div>
		</div>
	);

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-xl font-semibold mb-2">
					Create Recipe - Step {currentStep} of 3
				</h2>
				<p className="text-sm text-gray-500">
					{currentStep === 1 &&
						"Start by adding the recipe title and ingredients"}
					{currentStep === 2 && "Add the cooking steps for your recipe"}
					{currentStep === 3 && "Add final details like timing and categories"}
				</p>
			</div>

			{/* Step Progress Indicator */}
			<div className="flex justify-center space-x-2 mb-6">
				{[1, 2, 3].map((step) => (
					<div
						key={step}
						className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
							step === currentStep
								? "bg-primary text-primary-foreground"
								: step < currentStep
									? "bg-green-500 text-white"
									: "bg-gray-200 text-gray-500"
						}`}
					>
						{step}
					</div>
				))}
			</div>

			{/* Form Steps */}
			{currentStep === 1 && renderStep1()}
			{currentStep === 2 && renderStep2()}
			{currentStep === 3 && renderStep3()}

			{/* Navigation */}
			<div className="flex justify-between pt-6 border-t">
				<Button
					type="button"
					variant="outline"
					onClick={handlePrevious}
					disabled={currentStep === 1}
					className="gap-2 cursor-pointer"
				>
					<ArrowLeft className="w-4 h-4" />
					Previous
				</Button>

				{currentStep < 3 ? (
					<Button
						type="button"
						onClick={handleNext}
						className="gap-2 cursor-pointer"
					>
						Next
						<ArrowRight className="w-4 h-4" />
					</Button>
				) : (
					<Button
						type="button"
						onClick={handleSubmit}
						className="gap-2 cursor-pointer"
					>
						<ChefHat className="w-4 h-4" />
						Create Recipe
					</Button>
				)}
			</div>
		</div>
	);
};

export default RecipeForm;
