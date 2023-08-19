export type WallpaperType = typeof types.wallpaper[keyof typeof types.wallpaper];

export const types = {
	wallpaper: {
		image: 0,
		slide: 1,
	}
} as const;
