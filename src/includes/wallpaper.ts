import * as path            from "path";
import { ExtensionSetting } from "./settings/extension";
import { ContextManager }   from "./utils/base/context";
import * as Constant        from "./constant";
import { formatByArray }    from "./utils/base/string";
import { File }             from "./utils/base/file";

const imageChangeScript = `const changeImage=(async(imageData)=>{{0}document.body.style.backgroundImage=imageData;{1}});`;
const feedInScript1     = `const sleep=(ms)=>{return new Promise((resolve,reject)=>{setTimeout(resolve,ms);});};const feedin=(async(opacity,decrement,ms)=>{let current=1;while(current>opacity){current-=decrement;document.body.style.opacity=current;await sleep(ms);};document.body.style.opacity={0};});document.body.style.opacity=1;`;
const feedInScript2     = `await feedin({0},0.01,50);`;

type Ready = { image: boolean, slide: boolean };

type AutoSet = number;

export class Wallpaper {
	private installLocation: string;
	private installFilaName: string;
	private installPath:     string;
	private settings:        ExtensionSetting;
	private extensionKey:    string;
	private _isInstall:      boolean;
	private _isReady:        undefined | Ready;
	private _isAutoSet:      undefined | AutoSet;

	constructor(
		locationPath: string,
		fileName:     string,
		settings:     ExtensionSetting,
		extensionKey: string
	) {
		this.installLocation = locationPath;
		this.installFilaName = fileName,
		this.installPath     = path.join(this.installLocation, this.installFilaName);
		this.settings        = settings;
		this.extensionKey    = extensionKey;
		this._isInstall      = this.checkIsInstall();
		this._isReady        = this.checkIsReady();
		this._isAutoSet      = this.checkIsAutoSet();
	}

	private checkIsInstall(): boolean {
		const script =  new File(this.installPath).toString().match(this.getScriptMatch());

		return script ? true : false;
	}

	private checkIsReady(): undefined | Ready {
		let checkResult: undefined | Ready = undefined;
		const image: boolean               = this.settings.filePath.value.length > 0;
		const slide: boolean               = this.settings.slideFilePaths.value.length > 0;

		if (image || slide) {
			checkResult =  { "image": image, "slide": slide };
		}

		return checkResult;
	}

	private checkIsAutoSet(): undefined | AutoSet {
		let checkResult: undefined | AutoSet = undefined;

		if (this.isReady) {
			if (this.isReady.image && !this.isReady.slide) {
				checkResult = Constant.wallpaperType.Image;
			} else if (!this.isReady.image && this.isReady.slide) {
				checkResult = Constant.wallpaperType.Slide;
			}
		}

		return checkResult;
	}

	public get isInstall(): boolean {
		return this._isInstall;
	}

	public get isReady(): undefined | Ready {
		return this._isReady;
	}

	public get isAutoSet(): undefined | AutoSet {
		return this._isAutoSet;
	}

	public install(fromSync?: boolean, syncData?: string, syncOpacity?: number): void {
		const editFile   = new File(this.installPath);
		let   image      = "";
		let   opacity    = undefined;

		if (
			fromSync                                              &&
			syncData    && syncData.length > 0                    &&
			syncOpacity && syncOpacity >= Constant.maximumOpacity
		) {
			image        = syncData;
			opacity      = syncOpacity;
		} else if (this.settings.filePath.value) {
			const file   = new File(this.settings.filePath.value,);
			image        = `data:image/${file.extension};base64,${file.toBase64()}`
			opacity      = this.settings.opacity.validValue;
		}

		editFile.content =
			this.clearWallpaperScript(editFile.toString()) +
			this.getWallpaperScript(image, opacity);

		editFile.write();
	}

	public installAsSlide(): void {
		const editFile   = new File(this.installPath);

		editFile.content =
			this.clearWallpaperScript(editFile.toString()) +
			this.getSlideScript(
				this.settings.slideFilePaths.value,
				this.settings.opacity.validValue,
				this.settings.slideIntervalUnit2Millisecond,
				this.settings.slideRandomPlay.validValue,
				this.settings.slideEffectFadeIn.validValue
			);

		editFile.write();
	}

	public uninstall(): void {
		const editFile   = new File(this.installPath);

		editFile.content = this.clearWallpaperScript(editFile.toString());

		editFile.write();
	}

	private getWallpaperScript(image: string, opacity: number): string {
		let result = "";

		if (image && opacity) {
			result = formatByArray(
				this.getScriptTemplate(opacity),
				`document.body.style.backgroundImage='url("${image}")';`
			);
		}

		return result;
	}

	private getSlideScript(
		filePaths: Array<string>,
		opacity:   number,
		interval:  number,
		random:    boolean,
		feedin:    boolean
	): string {
		let result = "";

		if (filePaths.length > 0 && opacity && interval) {
			const script1 = feedin ? formatByArray(feedInScript1, opacity.toString()) : ``;
			const script2 = feedin ? formatByArray(feedInScript2, opacity.toString()) : ``;

			let temp      = `let images=new Array();`;

			filePaths.forEach((filePath) => {
				const image = new File(filePath);
				temp        += `images.push('url("data:image/${image.extension};base64,${image.toBase64()}")');`;
			});

			temp          += formatByArray(imageChangeScript, script1, script2);
			temp          += this.getRandomOrNormalScript(random);
			temp          += `setInterval((async()=>{i=choice(0,images.length-1);changeImage(images[i]);after(i);}),${interval});`;

			result        = formatByArray(this.getScriptTemplate(opacity), temp);
		}

		return result;
	}

	private getScriptTemplate(opacity: number): string {
		let result = `
/*${this.extensionKey}-start*/
/*${this.extensionKey}.ver.${ContextManager.version}*/
window.onload=()=>{`;
		result     += `if(document.querySelector("body > #process-list")){return;};`;
		result     += `document.body.style.opacity=${opacity};`;
		result     += `document.body.style.backgroundSize="cover";`;
		result     += `document.body.style.backgroundPosition="Center";`;
		result     += `document.body.style.backgroundRepeat="no-repeat";`;
		result     += `{0}`;
		result     += `}
/*${this.extensionKey}-end*/`;

		return result;
	}

	private clearWallpaperScript(content: string): string {
		return content.replace(this.getScriptMatch(), "").replace(/\s*$/, "");
	}

	private getScriptMatch(): RegExp {
		return new RegExp(
			"\\/\\*" + this.extensionKey + "-start\\*\\/[\\s\\S]*?\\/\\*" + this.extensionKey + "-end\\*\\/",
			"g"
		);
	}

	private getRandomOrNormalScript(random: boolean): string {
		let result = "";
		if (random) {
			result += `let played=new Array();let i=0;`;
			result += `const choice=(min,max)=>{return Math.floor(Math.random()*(max-min+1))+min;};`;
			result += `const after=(index)=>{played.push(images[index]);images.splice(index,1);if(images.length===0){images=played;played=new Array();}};`;
			result += `i=choice(0,images.length-1);`;
			result += `document.body.style.backgroundImage=images[i];after(i);`;
		} else {
			result += `let i=0;`;
			result += `const choice=(min,max)=>{i++; return i===max?min:i;};`
			result += `const after=(index)=>{return;};`;
			result += `document.body.style.backgroundImage=images[i];`;
		}

		return result;
	}
}
