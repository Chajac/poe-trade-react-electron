export function calculateAveragePercentageChange(
	dataPoints: number[] | undefined
): number {
	if (!dataPoints || !Array.isArray(dataPoints) || dataPoints.length === 0) {
		console.log("Invalid or empty dataPoints array.");
		return 0;
	}

	const numDataPoints = dataPoints.length;
	let totalPercentageChange = 0;

	for (let i = 1; i < numDataPoints; i++) {
		const initialVal = dataPoints[i - 1];
		const finalVal = dataPoints[i];
		const deltaV = finalVal - initialVal;
		const percentageChange = (deltaV / Math.abs(initialVal)) * 100;
		totalPercentageChange += percentageChange;
	}

	const averagePercentageChange = totalPercentageChange / numDataPoints;
	return parseFloat(averagePercentageChange.toFixed(2));
}
