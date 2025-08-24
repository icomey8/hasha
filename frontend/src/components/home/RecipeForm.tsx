import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { ArrowLeft, ArrowRight, ChefHat, Plus, Minus } from "lucide-react";
import { type RecipeType } from "@/types/recipe";

type RecipeFormProps = {
	onSubmit: (data: RecipeType) => void;
	onClose?: () => void;
};

const FormInputSchema = z.object({
	name: z
		.string()
		.min(2, "Title must be at least 2 characters")
		.max(100, "Title must be less than 100 characters"),
	ingredients: z
		.array(
			z.object({
				name: z
					.string()
					.min(2, "Ingredient name must be at least 2 characters")
					.max(100, "Ingredient name must be less than 100 characters"),
				amount: z
					.string()
					.min(1, "Amount is required")
					.max(50, "Amount must be less than 50 characters"),
			})
		)
		.min(1, "At least one ingredient is required"),
	preparation: z
		.array(
			z.object({
				text: z
					.string()
					.min(5, "Step must be at least 5 characters")
					.max(500, "Step must be less than 500 characters"),
			})
		)
		.min(1, "At least one step is required"),
	totalTime: z
		.string()
		.min(1, "Total time is required")
		.max(50, "Total time must be less than 50 characters"),
	type: z
		.string()
		.min(1, "Recipe type is required")
		.max(50, "Recipe type must be less than 50 characters"),
	cuisine: z
		.string()
		.min(1, "Cuisine is required")
		.max(50, "Cuisine must be less than 50 characters"),
});

type FormInputType = z.infer<typeof FormInputSchema>;

const RecipeForm = ({ onSubmit, onClose }: RecipeFormProps) => {
	const [currentStep, setCurrentStep] = useState(1);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FormInputType>({
		resolver: zodResolver(FormInputSchema),
		defaultValues: {
			name: "",
			ingredients: [{ name: "", amount: "" }],
			preparation: [{ text: "" }],
			totalTime: "",
			type: "",
			cuisine: "",
		},
	});

	const {
		fields: ingredientFields,
		append: appendIngredient,
		remove: removeIngredient,
	} = useFieldArray({
		control,
		name: "ingredients",
	});

	const {
		fields: stepFields,
		append: appendStep,
		remove: removeStep,
	} = useFieldArray({
		control,
		name: "preparation",
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

	const onFormSubmit: SubmitHandler<FormInputType> = (data) => {
		onSubmit(data);
		onClose?.();
	};

	const addIngredient = () => {
		appendIngredient({ name: "", amount: "" });
	};

	const addStep = () => {
		appendStep({ text: "" });
	};

	const renderStep1 = () => (
		<div className="space-y-6">
			<div>
				<Label htmlFor="recipe_name">Recipe Title</Label>
				<Input
					id="recipe_name"
					{...register("name", { required: true })}
					aria-invalid={errors.name ? "true" : "false"}
					placeholder="Enter recipe title"
					className="mt-1"
				/>
				{errors.name && (
					<p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
				)}
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
					{ingredientFields.map((field, index) => (
						<div key={field.id} className="flex gap-2">
							<div className="flex-1">
								<Input
									id={`ingredient-${index}-name`}
									{...register(`ingredients.${index}.name`)}
									placeholder="Ingredient name"
									aria-invalid={
										errors.ingredients?.[index]?.name ? "true" : "false"
									}
								/>
								{errors.ingredients?.[index]?.name && (
									<p className="text-sm text-red-500 mt-1">
										{errors.ingredients[index]?.name?.message}
									</p>
								)}
							</div>
							<div className="w-32">
								<Input
									id={`ingredient-${index}-amount`}
									{...register(`ingredients.${index}.amount`)}
									placeholder="Amount"
									aria-invalid={
										errors.ingredients?.[index]?.amount ? "true" : "false"
									}
								/>
								{errors.ingredients?.[index]?.amount && (
									<p className="text-sm text-red-500 mt-1">
										{errors.ingredients[index]?.amount?.message}
									</p>
								)}
							</div>
							{ingredientFields.length > 1 && (
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
				{errors.ingredients && !Array.isArray(errors.ingredients) && (
					<p className="text-sm text-red-500 mt-1">
						{errors.ingredients.message}
					</p>
				)}
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
					{stepFields.map((field, index) => (
						<div key={field.id} className="flex gap-2">
							<div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold mt-1">
								{index + 1}
							</div>
							<div className="flex-1">
								<textarea
									id={`step-${index}`}
									{...register(`preparation.${index}.text`)}
									placeholder={`Describe step ${index + 1}...`}
									rows={3}
									aria-invalid={
										errors.preparation?.[index]?.text ? "true" : "false"
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								{errors.preparation?.[index]?.text && (
									<p className="text-sm text-red-500 mt-1">
										{errors.preparation[index]?.text?.message}
									</p>
								)}
							</div>
							{stepFields.length > 1 && (
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
				{errors.preparation && !Array.isArray(errors.preparation) && (
					<p className="text-sm text-red-500 mt-1">
						{errors.preparation.message}
					</p>
				)}
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
						{...register("totalTime")}
						aria-invalid={errors.totalTime ? "true" : "false"}
						placeholder="e.g. 30"
						className="mt-1"
					/>
					{errors.totalTime && (
						<p className="text-sm text-red-500 mt-1">
							{errors.totalTime.message}
						</p>
					)}
				</div>
				<div>
					<Label htmlFor="type">Recipe Type</Label>
					<select
						id="type"
						{...register("type")}
						aria-invalid={errors.type ? "true" : "false"}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
					>
						<option value="">Select type</option>
						<option value="appetizer">Appetizer</option>
						<option value="entree">Entree</option>
						<option value="dessert">Dessert</option>
						<option value="side">Side Dish</option>
						<option value="beverage">Beverage</option>
					</select>
					{errors.type && (
						<p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
					)}
				</div>
			</div>

			<div>
				<Label htmlFor="cuisine">Cuisine</Label>
				<select
					id="cuisine"
					{...register("cuisine")}
					aria-invalid={errors.cuisine ? "true" : "false"}
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
				{errors.cuisine && (
					<p className="text-sm text-red-500 mt-1">{errors.cuisine.message}</p>
				)}
			</div>
		</div>
	);

	return (
		<form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
			<div className="text-center">
				<h2 className="text-xl font-semibold mb-2">Step {currentStep} of 3</h2>
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
					<Button type="submit" className="gap-2 cursor-pointer">
						<ChefHat className="w-4 h-4" />
						Create Recipe
					</Button>
				)}
			</div>
		</form>
	);
};

export default RecipeForm;
