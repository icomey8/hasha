import { ProgressiveBlur } from "./ui/progressive-blur";
import { motion } from "motion/react";
import { useState } from "react";
import { Music } from "lucide-react";

const Brick = ({ image }: { image: string }) => {
	const [isHover, setIsHover] = useState(false);

	return (
		<div
			className="relative aspect-square w-full rounded-xl overflow-hidden cursor-pointer"
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
		>
			<img
				src={image}
				alt="Benjamin Spiers - Moonlight 2023"
				className="absolute inset-0 w-full h-full object-cover"
			/>
			<ProgressiveBlur
				className="pointer-events-none rounded-xl absolute bottom-0 left-0 h-[60%] w-full"
				blurIntensity={1.2}
				initial="hidden"
				animate={isHover ? "visible" : "hidden"}
				variants={{
					hidden: { opacity: 0 },
					visible: { opacity: 1 },
				}}
				transition={{ duration: 0.2, ease: "easeOut" }}
			/>
			<motion.div
				className="absolute top-0 left-0"
				animate={isHover ? "visible" : "hidden"}
				initial="hidden"
				variants={{
					hidden: { opacity: 0 },
					visible: { opacity: 1 },
				}}
				transition={{ duration: 0.2, ease: "easeOut" }}
			>
				<div className="flex flex-col items-start gap-0 px-4 py-2">
					{/* <p className="text-base font-sm text-white">Music</p> */}
					<Music className="text-white mt-2" />
				</div>
			</motion.div>
			<motion.div
				className="absolute bottom-0 left-0"
				animate={isHover ? "visible" : "hidden"}
				initial="hidden"
				variants={{
					hidden: { opacity: 0 },
					visible: { opacity: 1 },
				}}
				transition={{ duration: 0.2, ease: "easeOut" }}
			>
				<div className="flex flex-col items-start gap-0 px-4 py-2">
					<p className="text-base font-sm text-white">Benjamin Spiers</p>
					<span className="mb-2 text-base text-zinc-300">Moonlight 2023</span>
				</div>
			</motion.div>
		</div>
	);
};

export default Brick;
