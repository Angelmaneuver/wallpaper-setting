import { QuickPickItem }             from "vscode";
import { InputStep, MultiStepInput } from "../utils/multiStepInput";
import { State }                     from "./base/base";
import { BaseQuickPickGuide }        from "./base/pick";
import { Type }                      from "./favorite";
import { GuideFactory }              from "./factory/base";
import { ImageFilePathGuide }        from "./image";
import {
	SlideFilePathsGuide,
	SlideIntervalGuide,
	SlideIntervalUnitGuide,
	SlideRandomPlayGuide,
	SlideEffectFadeInGuide
} from "./slide";
import { OpacityGuide }              from "./opacity";
import { Constant }                  from "../constant";
import { VSCodePreset }              from "../utils/base/vscodePreset";
import { File }                      from "../utils/base/file";

export class SelectSetupType extends BaseQuickPickGuide {
	constructor(
		state: State,
	) {
		state.placeholder = "Select the type of wallpaper you want to set.";
		state.items       = [
			VSCodePreset.create(VSCodePreset.Icons.fileMedia, "Image", "Set an image to wallpaper."),
			VSCodePreset.create(VSCodePreset.Icons.folder,    "Slide", "Set an image slide to wallpaper."),
		];

		super(state);
	}

	public async show(input: MultiStepInput): Promise<void | InputStep> {
		this.nextStep = undefined;

		await super.show(input);

		if (this.activeItem) {
			switch (this.activeItem) {
				case this.items[0]:
					this.installer.install();
					this.state.reload = true;
					break;
				case this.items[1]:
					this.installer.installAsSlide();
					this.state.reload = true;
					break;
				default:
					break;
			}
		}
	}
}

export class SelectParameterType extends BaseQuickPickGuide {
	private templateItems: QuickPickItem[];

	constructor(
		state: State,
	) {
		state.placeholder = "Select the item you want to set.";

		super(state);

		this.templateItems = [
			VSCodePreset.create(VSCodePreset.Icons.fileMedia, "Image Path",            "Set the image to be used as the wallpaper."),
			VSCodePreset.create(VSCodePreset.Icons.folder,    "Image Files Path",      "Set the images to be used as the slide."),
			VSCodePreset.create(VSCodePreset.Icons.eye,       "Opacity",               "Set the opacity of the wallpaper."),
			VSCodePreset.create(VSCodePreset.Icons.clock,     "Slide Interval",        "Set the slide interval."),
			VSCodePreset.create(VSCodePreset.Icons.law,       "Slide Interval's Unit", "Set the slide interval's unit."),
			VSCodePreset.create(VSCodePreset.Icons.merge,     "Slide Random Playback", "set whether to play the slides randomly."),
			VSCodePreset.create(VSCodePreset.Icons.foldDown,  "Effect Fade in",        "set whether to use fade in effect."),
			VSCodePreset.create(VSCodePreset.Icons.save,      "Save",                  "Save changes."),
			VSCodePreset.create(VSCodePreset.Icons.mailReply, "Return",                "Return without saving any changes."),
		];
	}

	public async show(input: MultiStepInput): Promise<void | InputStep> {
		const imageId             = this.getId(ImageFilePathGuide.itemId);
		const slideId             = this.getId(SlideFilePathsGuide.itemId);
		const opacityId           = this.getId(OpacityGuide.itemId);
		const slideIntervalId     = this.getId(SlideIntervalGuide.itmeId);
		const slideIntervalUnitId = this.getId(SlideIntervalUnitGuide.itemId);
		const SlideRandomPlayId   = this.getId(SlideRandomPlayGuide.itemId);
		const SlideEffectFadeInId = this.getId(SlideEffectFadeInGuide.itemId);
		this.items                = [
			this.templateItems[0],
			this.templateItems[1],
			this.templateItems[2],
			this.templateItems[3],
			this.templateItems[4],
			this.templateItems[5],
			this.templateItems[6]
		].concat(
			Object.keys(this.state.resultSet).length > 0
				? this.templateItems[7]
				: []
		).concat(this.templateItems[8]);
		this.nextStep             = undefined;

		await super.show(input);

		switch (this.activeItem) {
			case this.templateItems[0]:
				this.state.title       = this.title + " - Image Path";
				this.state.inputResult =
					this.state.resultSet[imageId]
						? this.state.resultSet[imageId]
						: this.settings.filePath;
				this.setNextStep(GuideFactory.create("ImageFilePathGuide", this.state));
				break;
			case this.templateItems[1]:
				this.state.title       = this.title + " - Image Files Path";
				this.setNextStep(GuideFactory.create("SlideFilePathsGuide", this.state));
				break;
			case this.templateItems[2]:
				this.state.title       = this.title + " - Opacity";
				console.log(this.state.resultSet);
				this.state.inputResult =
					typeof(this.state.resultSet[opacityId]) === "string"
						? this.state.resultSet[opacityId]
						: this.settings.opacity;
				this.setNextStep(GuideFactory.create("OpacityGuide", this.state));
				break;
			case this.templateItems[3]:
				this.state.title       = this.title + " - Slide Interval";
				this.state.inputResult =
					typeof(this.state.resultSet[slideIntervalId]) === "string"
						? this.state.resultSet[slideIntervalId]
						: this.settings.slideInterval;
				this.setNextStep(GuideFactory.create("SlideIntervalGuide", this.state));
				break;
			case this.templateItems[4]:
				this.state.title       = this.title + " - Slide Interval Unit";
				this.state.activeItem  =
					this.state.resultSet[slideIntervalUnitId]
						? this.state.resultSet[slideIntervalUnitId]
						: SlideIntervalUnitGuide.items.find(
							(item) => {
								return item.label === this.settings.slideIntervalUnit;
							}
						)
				this.setNextStep(GuideFactory.create("SlideIntervalUnitGuide", this.state));
				break;
			case this.templateItems[5]:
				this.state.title       = this.title + " - Slide Random Playback";
				this.state.activeItem  =
					this.state.resultSet[SlideRandomPlayId]
						? this.state.resultSet[SlideRandomPlayId]
						: (this.settings.slideRandomPlay ? SlideRandomPlayGuide.items[0] : SlideRandomPlayGuide.items[1]);
				this.setNextStep(GuideFactory.create("SlideRandomPlayGuide", this.state));
				break;
			case this.templateItems[6]:
				this.state.title       = this.title + " - Slide Effect Fade in";
				this.state.activeItem  =
					this.state.resultSet[SlideEffectFadeInId]
						? this.state.resultSet[SlideEffectFadeInId]
						: (this.settings.slideEffectFadeIn ? SlideEffectFadeInGuide.items[0] : SlideEffectFadeInGuide.items[1]);
				this.setNextStep(GuideFactory.create("SlideEffectFadeInGuide", this.state));
				break;
			case this.templateItems[7]:
				if (this.state.resultSet) {
					if (this.state.resultSet[imageId]) {
						await this.settings.set(ImageFilePathGuide.itemId, this.state.resultSet[imageId]);
					}

					if (this.state.resultSet[slideId]) {
						await this.settings.set(
							SlideFilePathsGuide.itemId,
							File.getChldrens(
								this.state.resultSet[slideId],
								{
									filters:   Constant.applyImageFile,
									fullPath:  true,
									recursive: false,
								}
							)
						);
					}

					if (typeof(this.state.resultSet[opacityId]) === "string") {
						if (this.state.resultSet[opacityId].length > 0) {
							await this.settings.set(OpacityGuide.itemId,  Number(this.state.resultSet[opacityId]));
						} else {
							await this.settings.remove(OpacityGuide.itemId);
						}
					}

					if (this.state.resultSet[slideIntervalUnitId]) {
						await this.settings.set(SlideIntervalUnitGuide.itemId, this.state.resultSet[slideIntervalUnitId].label);
					}

					if (typeof(this.state.resultSet[slideIntervalId]) === "string") {
						if (this.state.resultSet[slideIntervalId].length > 0) {
							await this.settings.set(SlideIntervalGuide.itmeId, Number(this.state.resultSet[slideIntervalId]));
						} else {
							await this.settings.remove(SlideIntervalGuide.itmeId);
						}
					}

					if (this.state.resultSet[SlideRandomPlayId]) {
						if (this.state.resultSet[SlideRandomPlayId] === SlideRandomPlayGuide.items[0]) {
							await this.settings.set(SlideRandomPlayGuide.itemId, true);
						} else {
							await this.settings.remove(SlideRandomPlayGuide.itemId);
						}
					}

					if (this.state.resultSet[SlideEffectFadeInId]) {
						if (this.state.resultSet[SlideEffectFadeInId] === SlideEffectFadeInGuide.items[0]) {
							await this.settings.remove(SlideEffectFadeInGuide.itemId);
						} else {
							await this.settings.set(SlideEffectFadeInGuide.itemId, false);
						}
					}
				}

				const ready       = this.installer.isReady();

				if (!(typeof(ready) === "boolean")) {
					if (ready.image && !ready.slide) {
						this.installer.install();
						this.state.reload = true;
					} else if (!ready.image && ready.slide) {
						this.installer.installAsSlide();
						this.state.reload = true;
					} else {
						this.state.title      = this.title + " - Select Setup Type";
						this.state.step       = 0;
						this.state.totalSteps = 0;
						await GuideFactory.create("SelectSetupType", this.state).start(new MultiStepInput());
					}
				}

				break;
			case this.templateItems[8]:
				this.prev();
				break;
			default:
				break;
		}
	}
}

export class SelectFavoriteProcess extends BaseQuickPickGuide {
	private templateItems: QuickPickItem[];

	constructor(
		state: State,
	) {
		state.placeholder = "Select the process you want to perform.";

		super(state);

		this.templateItems = [
			VSCodePreset.create(VSCodePreset.Icons.repoPush,  "Register", "Register the current settings to favorite."),
			VSCodePreset.create(VSCodePreset.Icons.repoPull,  "Load",     "Load favorite settings."),
			VSCodePreset.create(VSCodePreset.Icons.mailReply, "Return",   "Return without saving any changes."),

		];
	}

	public async show(input: MultiStepInput): Promise<void | InputStep> {
		const ready      = this.installer.isReady();
		const registered = this.settings.isFavoriteExist;
		this.items       =
			[this.templateItems[0]]
			.concat(this.settings.isFavoriteExist ? [this.templateItems[1]] : [])
			.concat([this.templateItems[2]]);
		this.nextStep    = undefined;

		await super.show(input);

		switch (this.activeItem) {
			case this.templateItems[0]:
				this.state.title        = this.title + " - Register";
				this.state.guideGroupId += "Register";

				if (!(typeof(ready) === "boolean")) {
					if (ready.image && !ready.slide) {
						this.state.title        += " - Image wallpaper";
						this.state.guideGroupId += "Image";
						this.state.itemId       =  "favoriteWallpaperImageSet";
						this.setNextStep(GuideFactory.create("RegisterFavoriteGuide", this.state, Type.Image));
					} else if (!ready.image && ready.slide) {
						this.state.title        += " - Slide wallpaper";
						this.state.guideGroupId += "Slide";
						this.state.itemId       =  "favoriteWallpaperSlideSet";
						this.setNextStep(GuideFactory.create("RegisterFavoriteGuide", this.state, Type.Slide));	
					} else {
						this.setNextStep(GuideFactory.create("SelectFavoriteRegisterType", this.state));
					}
				}
				break;
			case this.templateItems[1]:
				this.state.title        = this.title + " - Load";
				this.state.guideGroupId += "Load";

				if (!(typeof(registered) === "boolean")) {
					if (registered.image && !registered.slide) {
						this.state.title        += " - Image wallpaper";
						this.state.guideGroupId += "Image";
						this.setNextStep(GuideFactory.create("LoadFavoriteGuide", this.state, Type.Image));
					} else if (!registered.image && registered.slide) {
						this.state.title        += " - Slide wallpaper";
						this.state.guideGroupId += "Slide";
						this.setNextStep(GuideFactory.create("LoadFavoriteGuide", this.state, Type.Slide));	
					} else {
						this.setNextStep(GuideFactory.create("SelectFavoriteLoadType", this.state));
					}
				}
				break;
			case this.templateItems[2]:
				this.prev();
				break;
			default:
				break;
		}
	}
}

export class SelectFavoriteRegisterType extends BaseQuickPickGuide {
	constructor(
		state: State,
	) {
		state.placeholder = "Select the type of wallpaper you want to register for favorite.";
		state.items       = [
			VSCodePreset.create(VSCodePreset.Icons.fileMedia, "Image",  "Register to favorite the current wallpaper image settings."),
			VSCodePreset.create(VSCodePreset.Icons.folder,    "Slide",  "Register to favorite the current wallpaper slide settings."),
			VSCodePreset.create(VSCodePreset.Icons.mailReply, "Return", "Return without saving any changes."),
		];

		super(state);
	}

	public async show(input: MultiStepInput): Promise<void | InputStep> {
		this.nextStep = undefined;

		await super.show(input);

		if (this.activeItem) {
			switch (this.activeItem) {
				case this.items[0]:
					this.state.title        = this.title + " - Image wallpaper";
					this.state.guideGroupId = this.guideGroupId + "Image";
					this.state.itemId       = "favoriteWallpaperImageSet";
					this.setNextStep(GuideFactory.create("RegisterFavoriteGuide", this.state, Type.Image));
					break;
				case this.items[1]:
					this.state.title        = this.title + " - Slide wallpaper";
					this.state.guideGroupId = this.guideGroupId + "Slide";
					this.state.itemId       = "favoriteWallpaperSlideSet";
					this.setNextStep(GuideFactory.create("RegisterFavoriteGuide", this.state, Type.Slide));
					break;
				case this.items[2]:
					this.prev();
					break;
				default:
					break;
			}
		}
	}
}

export class SelectFavoriteLoadType extends BaseQuickPickGuide {
	constructor(
		state: State,
	) {
		state.placeholder = "Select the type of wallpaper you want to load.";
		state.items       = [
			VSCodePreset.create(VSCodePreset.Icons.fileMedia, "Image",  "Load wallpaper image settings from favorites."),
			VSCodePreset.create(VSCodePreset.Icons.folder,    "Slide",  "Load wallpaper slide settings from favorites."),
			VSCodePreset.create(VSCodePreset.Icons.mailReply, "Return", "Return without loading any changes."),
		];

		super(state);
	}

	public async show(input: MultiStepInput): Promise<void | InputStep> {
		this.nextStep = undefined;

		await super.show(input);

		if (this.activeItem) {
			switch (this.activeItem) {
				case this.items[0]:
					this.state.title        = this.title + " - Image wallpaper";
					this.state.guideGroupId = this.guideGroupId + "Image";
					this.setNextStep(GuideFactory.create("LoadFavoriteGuide", this.state, Type.Image));
					break;
				case this.items[1]:
					this.state.title        = this.title + " - Slide wallpaper";
					this.state.guideGroupId = this.guideGroupId + "Slide";
					this.setNextStep(GuideFactory.create("LoadFavoriteGuide", this.state, Type.Slide));
					break;
				case this.items[2]:
					this.prev();
					break;
				default:
					break;
			}
		}
	}
}
