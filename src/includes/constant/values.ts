export const values = {
	slide: {
		min: 0.1,
	},
	opacity: {
		min: 1,
		max: 0.5,
	},
	sync: {
		limit: {
			size:    500 * 1024,
			display: "500KB",
		},
	},
	file: {
		apply: {
			image: ["png", "jpg", "jpeg", "gif", "webp"],
		},
	},
} as const;
