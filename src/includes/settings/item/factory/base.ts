import { AbstractSettingItem } from "../abc";
import {
	BaseSettingItem,
	NumberSettingItem,
	BooleanSettingItem
}                              from "../base";
import { Optional }            from "../../../utils/base/optional";
import * as Constant           from "../../../constant";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Constructable<T> extends Function { new (...args: Array<any>): T; }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Items = { [key: string]: { className: string, args: { [key: string]: any } } };

export abstract class SettingItemFactory {
	private static items:    Items                                     = {};
	private static classes:  Array<Constructable<AbstractSettingItem>> = [];

	public static create(itemId: string, value: unknown): AbstractSettingItem {
		if (Object.keys(this.items).length === 0) {
			this.init();
		}

		const error       = ReferenceError("Requested " + itemId + "'s class not found...");
		const item        = Optional.ofNullable(this.items[itemId]).orElseThrow(error);
		const classObject = Optional.ofNullable(this.classes.find((itemClass) => {
			return itemClass.name === item.className;
		})).orElseThrow(error);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const args: Array<any> = [];

		Object.keys(item.args).forEach((key) => { args.push(item.args[key]); } );

		return new classObject(...[itemId, value, ...args]);
	}

	private static init(): void {
		this.items = {
			filePath:                         { className: BaseSettingItem.name,    args: { default: "" } },
			opacity:                          { className: NumberSettingItem.name,  args: { default: 0.75 } },
			slideFilePaths:                   { className: BaseSettingItem.name,    args: { default: [] } },
			slideInterval:                    { className: NumberSettingItem.name,  args: { default: 25 } },
			slideIntervalUnit:                { className: BaseSettingItem.name,    args: { default: "Minute" } },
			slideRandomPlay:                  { className: BooleanSettingItem.name, args: { default: false, trueValue: Constant.slideRandomPlay[0].label,   falseValue: Constant.slideRandomPlay[1].label } },
			slideEffectFadeIn:                { className: BooleanSettingItem.name, args: { default: true,  trueValue: Constant.slideEffectFadeIn[0].label, falseValue: Constant.slideEffectFadeIn[1].label } },
			favoriteWallpaperImageSet:        { className: BaseSettingItem.name,    args: { default: {} } },
			favoriteWallpaperSlideSet:        { className: BaseSettingItem.name,    args: { default: {} } },
			favoriteWallpaperRandomSet:       { className: BooleanSettingItem.name, args: { default: false, trueValue: Constant.favoriteRandomSet[0].label, falseValue: Constant.favoriteRandomSet[1].label } },
			favoriteWallpaperRandomSetFilter: { className: BaseSettingItem.name,    args: { default: "All" } },
			enableSync:                       { className: BooleanSettingItem.name, args: { default: false, trueValue: true,                                falseValue: false } },
			advancedMode:                     { className: BooleanSettingItem.name, args: { default: false, trueValue: true,                                falseValue: false } },
		};

		this.classes.push(BaseSettingItem, NumberSettingItem, BooleanSettingItem);
	}
}
