import { useEffect, useRef, useState } from "react";
import { Image } from "@nextui-org/react";

const DynamicFontSizingPaymentTitle = ({ tradeData }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [fontSize, setFontSize] = useState<number>(5);
	useEffect(() => {
		const updateContainerWidth = () => {
			const container = containerRef.current;
			if (container) {
				container.style.width = "fit-content";
			}
		};

		const calculateFontSize = () => {
			const container = containerRef.current;
			if (container) {
				const containerWidth = container.offsetWidth;
				const content = `${tradeData.price} ${
					tradeData.currency?.toUpperCase() || ""
				}`;
				const contentLength = content.length;

				const maxFontSize = 5;
				const minFontSize = 1;
				const scalingFactor = 0.2;

				let calculatedFontSize =
					(containerWidth / contentLength) * scalingFactor;

				calculatedFontSize = Math.min(
					Math.max(calculatedFontSize, minFontSize),
					maxFontSize
				);

				setFontSize(calculatedFontSize);
			}
		};
		updateContainerWidth();
		calculateFontSize();
		window.addEventListener("resize", updateContainerWidth);
		window.addEventListener("resize", calculateFontSize);

		// Cleanup the event listeners on component unmount
		return () => {
			window.removeEventListener("resize", updateContainerWidth);
			window.removeEventListener("resize", calculateFontSize);
		};
	}, [fontSize, tradeData]);

	return (
		<>
			<div className="flex flex-row gap-12 flex-nowrap">
				<div
					ref={containerRef}
					className="flex flex-no-wrap whitespace-nowrap max-w-[170px]"
				>
					<span style={{ fontSize: `${fontSize}rem` }}>
						{tradeData.price}{" "}
						{tradeData.currency
							? tradeData.currency.toUpperCase()
							: ""}
						<div className="shrink-0"></div>
					</span>
					<span className={`mt-5`}>
						<Image
							alt="Currency Icon"
							radius="sm"
							src={tradeData.currency_icon}
							width={50}
							className="min-w-[50px]"
						/>
					</span>
				</div>
			</div>
		</>
	);
};

export default DynamicFontSizingPaymentTitle;
