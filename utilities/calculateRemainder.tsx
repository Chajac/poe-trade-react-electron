export function calculateRemainder(
	totalPrice: number | undefined,
	marketValue: number | undefined
) {
	// Convert the total price to a string
	if (totalPrice === undefined || marketValue === undefined) {
		return undefined;
	}
	// Calculate the remainder using mathematical operations
	const remainder: number = (totalPrice % 1) * marketValue;

	return Math.round(remainder);
}
