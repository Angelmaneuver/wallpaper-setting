import { QuickPickItem }             from "vscode";
import { InputStep, MultiStepInput } from "../utils/multiStepInput";
import { State }                     from "./base/base";
import { BaseQuickPickGuide }        from "./base/pick";
import { Type }                      from "./favorite";
import { GuideFactory }              from "./factory/base";
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
			VSCodePreset.create(VSCodePreset.Icons.save,      "Save",                  "Save changes."),
			VSCodePreset.create(VSCodePreset.Icons.mailReply, "Return",                "Return without saving any changes."),

		];
	}

	public async show(input: MultiStepInput): Promise<void | InputStep> {
		this.items = [
			this.templateItems[0],
			this.templateItems[1],
			this.templateItems[2],
			this.templateItems[3],
			this.templateItems[4]
		].concat(
			Object.keys(this.state.resultSet).length > 0
				? this.templateItems[5]
				: []
		).concat(this.templateItems[6]);
		this.nextStep = undefined;

		await super.show(input);

		switch (this.activeItem) {
			case this.templateItems[0]:
				this.state.title       = this.title + " - Image Path";
				this.state.inputResult =
					this.state.resultSet["filePath"]
						? this.state.resultSet["filePath"]
						: this.settings.filePath;
				this.setNextStep(GuideFactory.create("ImageFilePathGuide", this.state));
				break;
			case this.templateItems[1]:
				this.state.title       = this.title + " - Image Files Path";
				this.setNextStep(GuideFactory.create("SlideFilePathsGuide", this.state));
				break;
			case this.templateItems[2]:
				this.state.title       = this.title + " - Opacity";
				this.state.inputResult =
					this.state.resultSet["opacity"]
						? this.state.resultSet["opacity"]
						: this.settings.opacity;
				this.setNextStep(GuideFactory.create("OpacityGuide", this.state));
				break;
			case this.templateItems[3]:
				this.state.title       = this.title + " - Slide Interval";
				this.state.inputResult =
					this.state.resultSet["slideInterval"]
						? this.state.resultSet["slideInterval"]
						: this.settings.slideInterval;
				this.setNextStep(GuideFactory.create("SlideIntervalGuide", this.state));
				break;
			case this.templateItems[4]:
				this.state.title       = this.title + " - Slide Interval Unit";
				this.state.activeItem  =
					this.state.resultSet["slideIntervalUnit"]
						? this.state.resultSet["slideIntervalUnit"]
						: Constant.slideIntervalUnit.find(
							(item) => {
								return item.label === this.settings.slideIntervalUnit;
							}
						)
				this.setNextStep(GuideFactory.create("SlideIntervalUnitGuide", this.state));
				break;
			case this.templateItems[5]:
				if (this.state.resultSet) {
					if (this.state.resultSet["filePath"]) {
						await this.settings.set("filePath", this.state.resultSet["filePath"]);
					}

					if (this.state.resultSet["slideFilePaths"]) {
						await this.settings.set(
							"slideFilePaths",
							File.getChldrens(
								this.state.resultSet["slideFilePaths"],
								{
									filters:   Constant.applyImageFile,
									fullPath:  true,
									recursive: false,
								}
							)
						);
					}

					if (this.state.resultSet["opacity"] && this.state.resultSet["opacity"].length > 0) {
						await this.settings.set("opacity",  Number(this.state.resultSet["opacity"]));
					}

					if (this.state.resultSet["slideIntervalUnit"]) {
						await this.settings.set("slideIntervalUnit", this.state.resultSet["slideIntervalUnit"].label);
					}

					if (this.state.resultSet["slideInterval"] && this.state.resultSet["slideInterval"].length > 0) {
						await this.settings.set("slideInterval", Number(this.state.resultSet["slideInterval"]));
					}		
				}

				const ready            = this.installer.isReady();

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
			case this.templateItems[6]:
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
						this.state.itemId       =  "favoriteWallpaperImageSet";
						this.setNextStep(GuideFactory.create("RegisterFavoriteGuide", this.state, Type.Image));
					} else if (!registered.image && registered.slide) {
						this.state.title        += " - Slide wallpaper";
						this.state.guideGroupId += "Slide";
						this.state.itemId       =  "favoriteWallpaperSlideSet";
						this.setNextStep(GuideFactory.create("RegisterFavoriteGuide", this.state, Type.Slide));	
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
