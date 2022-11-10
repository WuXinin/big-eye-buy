export const capitalize = (str: string): string => {
	return str
		.split(" ")
		.map((strSlice) =>
			strSlice.substring(0, 1).toUpperCase() +
			strSlice.substring(1, strSlice.length)
		).join(" ")
}