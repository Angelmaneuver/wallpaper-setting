import { AbstractSettingItem }                                    from "../abc";
import { BaseSettingItem, NumberSettingItem, BooleanSettingItem } from "../base";
import * as Constant                                              from "../../../constant";

interface Constructable<T> extends Function {
	new (...args: any[]): T;
};

type Items = { [key: string]: { className: string, args: { [key: string]: any } } };

export abstract class SettingItemFactory {
	private static items:    Items                                = {};
	private static classes:  Constructable<AbstractSettingItem>[] = [];

	public static create(itemId: string, value: any): AbstractSettingItem {
		if (Object.keys(this.items).length === 0) {
			this.init();
		}

		const item        = this.items[itemId];
		const classObject = this.classes.find(
			(itemClass) => {
				return itemClass.name === item.className;
			}
		);

		if (classObject) {
			let args: any[] = [];

			Object.keys(item.args).forEach((key) => { args.push(item.args[key]); } );

			return new classObject(...[itemId, value, ...args]);
		} else {
			throw new ReferenceError("Requested " + itemId + "'s class not found...");
		}
	}

	private static init(): void {
		this.items = {
			filePath:                   { className: BaseSettingItem.name,    args: { default: "" } },
			opacity:                    { className: NumberSettingItem.name,  args: { default: 0.75 } },
			slideFilePaths:             { className: BaseSettingItem.name,    args: { default: [] } },
			slideInterval:              { className: NumberSettingItem.name,  args: { default: 25 } },
			slideIntervalUnit:          { className: BaseSettingItem.name,    args: { default: "Minute" } },
			slideRandomPlay:            { className: BooleanSettingItem.name, args: { default: true,  trueValue: Constant.slideRandomPlay[0].label,   falseValue: Constant.slideRandomPlay[1].label } },
			slideEffectFadeIn:          { className: BooleanSettingItem.name, args: { default: false, trueValue: Constant.slideEffectFadeIn[0].label, falseValue: Constant.slideEffectFadeIn[1].label } },
			favoriteWallpaperImageSet:  { className: BaseSettingItem.name,    args: { default: {} } },
			favoriteWallpaperSlideSet:  { className: BaseSettingItem.name,    args: { default: {} } },
			favoriteWallpaperRandomSet: { className: BooleanSettingItem.name, args: { default: false, trueValue: Constant.favoriteRandomSet[0].label, falseValue: Constant.favoriteRandomSet[1].label } }
		};

		this.classes.push(BaseSettingItem, NumberSettingItem, BooleanSettingItem);
	}
}
