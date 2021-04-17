import { AbstractGuide }      from "../base/abc";
import { StartMenuGuide }     from "../begin";
import { BaseInputGuide }     from "../base/input";
import { BaseConfirmGuide }   from "../confirm";
import { ImageFilePathGuide } from "../image";
import { OpacityGuide }       from "../opacity";
import {
	SlideFilePathsGuide,
	SlideIntervalUnitGuide,
	SlideIntervalGuide,
	SlideRandomPlayGuide,
	SlideEffectFadeInGuide
 } from "../slide";
import {
	SelectSetupType
} from "../select/wallpaper";
import {
	SelectParameterType
} from "../select/parameter";
import {
	SelectFavoriteProcess,
	SelectFavoriteRegisterType,
	SelectFavoriteUnRegisterType,
	SelectFavoriteLoadType
} from "../select/favorite";
import {
	RegisterFavoriteGuide,
	UnRegisterFavoriteGuide,
	LoadFavoriteGuide,
	FavoriteRandomSetGuide
} from "../favorite";

interface Constructable<T> extends Function {
	new (...args: any[]): T;
}

export abstract class GuideFactory {
	private static guides: Constructable<AbstractGuide>[] = [];

	public static create(className: string, ...args: any[]): AbstractGuide {
		if (this.guides.length === 0) {
			this.init();
		}

		const classObject = this.guides.find(
			(guide) => {
				return guide.name === className;
			}
		);

		if (classObject) {
			return new classObject(...args);
		} else {
			throw new ReferenceError("Requested " + className + " class not found...");
		}
	}

	private static init(): void {
		this.guides.push(
			StartMenuGuide,
			BaseInputGuide,
			BaseConfirmGuide,
			ImageFilePathGuide,
			OpacityGuide,
			SlideFilePathsGuide,
			SlideIntervalUnitGuide,
			SlideIntervalGuide,
			SlideRandomPlayGuide,
			SlideEffectFadeInGuide,
			SelectSetupType,
			SelectParameterType,
			SelectFavoriteProcess,
			SelectFavoriteRegisterType,
			SelectFavoriteLoadType,
			SelectFavoriteUnRegisterType,
			RegisterFavoriteGuide,
			UnRegisterFavoriteGuide,
			LoadFavoriteGuide,
			FavoriteRandomSetGuide
		)
	}
}
