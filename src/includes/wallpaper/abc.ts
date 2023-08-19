import { pathToFileURL }    from "url";
import { ExtensionSetting } from "../settings/extension";
import { ContextManager }   from "../utils/base/context";
import { types }            from "../constant";
import { formatByArray }    from "../utils/base/string";
import { File }             from "../utils/base/file";

type Ready   = { image: boolean, slide: boolean };
type AutoSet = number;

const imageChangeScript         = `const changeImage=(async(pre,current)=>{{0}if(pre){document.body.classList.remove(pre);};document.body.classList.add(current);{1}});`;
const feedInScript1             = `const sleep=(ms)=>{return new Promise((resolve,reject)=>{setTimeout(resolve,ms);});};const feedin=(async(opacity,decrement,ms)=>{let current=1;while(current>opacity){current-=decrement;document.body.style.opacity=current;await sleep(ms);};document.body.style.opacity={0};});document.body.style.opacity=1;`;
const feedInScript2             = `await feedin({0},0.01,50);`;
const feedInScript1WithAdvanced = `const sleep=(ms)=>{return new Promise((resolve,reject)=>{setTimeout(resolve,ms);});};const feedin=(async(start,increment,ms)=>{let current=start;while(current<1){current+=increment;document.body.style.backdropFilter="brightness("+current+")";await sleep(ms);}});`;
const feedInScript2WithAdvanced = `await feedin(0,0.01,50);`;

export abstract class AbstractWallpaper {
	protected destination:    string;
	protected settings:       ExtensionSetting;
	protected extensionKey:   string;
	protected previous:       string;
	protected isAdvancedMode: boolean;
	protected _isInstall:     boolean;
	protected _isReady:       undefined | Ready;
	protected _isAutoSet:     undefined | AutoSet;

	constructor(
		destination:  string,
		settings:     ExtensionSetting,
		extensionKey: string
	) {
		this.destination    = destination;
		this.settings       = settings;
		this.extensionKey   = extensionKey;
		this.previous       = "";
		this.isAdvancedMode = this.settings.isAdvancedMode;
		this._isInstall     = this.checkIsInstall();
		this._isReady       = this.checkIsReady();
		this._isAutoSet     = this.checkIsAutoSet();
	}

	protected checkIsInstall(): boolean {
		return this.getCurrentScript() ? true : false;
	}

	protected checkIsReady(): undefined | Ready {
		const image = this.settings.filePath.value.length > 0;
		const slide = this.settings.slideFilePaths.value.length > 0;

		if (image || slide) {
			return { "image": image, "slide": slide };
		} else {
			return undefined;
		}
	}

	protected checkIsAutoSet(): undefined | AutoSet {
		let checkResult: undefined | AutoSet = undefined;

		if (this.isReady) {
			if (this.isReady.image && !this.isReady.slide) {
				checkResult = types.wallpaper.image;
			} else if (!this.isReady.image && this.isReady.slide) {
				checkResult = types.wallpaper.slide;
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

	public install(): void {
		const editFile   = new File(this.destination);

		editFile.content = this.clearWallpaperScript(editFile.toString()) + this.getWallpaperScript(
			this.getFileUrl(File.normalize(this.settings.filePath.value)),
			this.settings.opacity.validValue,
		);

		editFile.write();
	}

	public installFromSync(data: string, opacity: number): void {
		const editFile   = new File(this.destination);

		editFile.content = this.clearWallpaperScript(editFile.toString()) + this.getWallpaperScript(data, opacity);

		editFile.write();
	}

	public installAsSlide(): void {
		const editFile   = new File(this.destination);

		editFile.content =
			this.clearWallpaperScript(editFile.toString()) +
			this.getSlideScript(
				File.normalizes(this.settings.slideFilePaths.value),
				this.settings.opacity.validValue,
				this.settings.slideIntervalUnit2Millisecond,
				this.settings.slideRandomPlay.validValue,
				this.settings.slideEffectFadeIn.validValue
			);

		editFile.write();
	}

	public installWithPrevious(): void {
		const editFile   = new File(this.destination);

		editFile.content = this.clearWallpaperScript(editFile.toString()) + this.previous;

		editFile.write();
	}

	public uninstall(): void {
		const editFile   = new File(this.destination);

		editFile.content = this.clearWallpaperScript(editFile.toString());

		editFile.write();
	}

	public holdScriptData(): void {
		this.previous = this.getCurrentScript();
	}

	protected getCurrentScript(): string {
		const data = new File(this.destination).toString().match(this.getScriptMatch());

		return data ? data[0] : "";
	}

	protected getWallpaperScript(image: string, opacity: number): string {
		let script = "";

		if (image && opacity) {
			const style = formatByArray(
				this.getBasicStyle(),
				`background-image:url('${image}');${this.getOpacity(opacity)}`,
			);

			script = formatByArray(
				this.getScriptTemplate(),
				style,
				"",
				"",
			);
		}

		return script;
	}

	protected getSlideScript(
		filePaths: Array<string>,
		opacity:   number,
		interval:  number,
		random:    boolean,
		feedin:    boolean
	): string {
		let script = "";

		if (filePaths.length > 0 && opacity && interval) {
			const [script1, script2] = (() => {
				const data = this.getSlideScriptData(filePaths, opacity, interval, random, feedin);

				if (this.settings.slideLoadWaitComplete.validValue) {
					return ["", formatByArray(this.getSlideScriptTemplate(), data)];
				} else {
					return [data, ""];
				}
			})();

			script = formatByArray(
				this.getScriptTemplate(),
				this.getSlideStyleData(filePaths, opacity),
				script1,
				script2,
			);
		}

		return script;
	}

	protected getSlideStyleData(filePaths: Array<string>, opacity: number): string {
		const body:        Array<string> = [];
		const bodyClasses: Array<string> = [];

		filePaths.forEach((filePath, index) => {{
			const url = `url('${this.getFileUrl(filePath)}')`;

			body.push(url);

			bodyClasses.push(` body.${this.extensionKey}-${index} {background-image:url('${this.getFileUrl(filePath)}');background-size:cover;}`)
		}});

		return formatByArray(
			this.getBasicStyle(false),
			`background-image:${body.join(",")};${this.getOpacity(opacity)}`,
		) + bodyClasses.join("");
	}

	protected getSlideScriptData(
		filePaths: Array<string>,
		opacity:   number,
		interval:  number,
		random:    boolean,
		feedin:    boolean
	): string {
		const [
			feedIn1,
			feedIn2
		]            = feedin ? this.getFeedInScript(opacity) : [``, ``];

		let   script = `let images=[...Array(${filePaths.length}).keys()];`
		script      += formatByArray(imageChangeScript, feedIn1, feedIn2);
		script      += this.getRandomOrNormalScript(random);
		script      += `setInterval((async()=>{i=choice(0,Math.max(...images));current="${this.extensionKey}-"+i.toString();changeImage(pre,current);pre=current;after(i);}),${interval});`;

		return script;
	}

	private getFeedInScript(opacity: number): [script1: string, script2: string] {
		if (this.isAdvancedMode) {
			return [
				feedInScript1WithAdvanced,
				feedInScript2WithAdvanced,
			];
		} else {
			return [
				formatByArray(feedInScript1, opacity.toString()),
				formatByArray(feedInScript2, opacity.toString()),
			];
		}
	}

	protected getScriptTemplate(): string {
		let script = `/*${this.extensionKey}-start*/
/*${this.extensionKey}.ver.${ContextManager.version}*/
document.addEventListener('DOMContentLoaded', () => {`;
		script += `const style=document.createElement("style");`;
		script += `style.appendChild(document.createTextNode("{0}"));`
		script += `document.head.appendChild(style);`;
		script += `{1}`;
		script += `});{2}
/*${this.extensionKey}-end*/`;

		return script;
	}

	protected getSlideScriptTemplate(): string {
		return `window.addEventListener('load', () => {{0}});`;
	}

	protected getBasicStyle(wallpaper = true): string {
		let style = ``;
		style += `body > div {background-color:transparent !important;}`;
		style += ` body {`;
		style += `{0}`;
		style += `background-size:${wallpaper ? "cover" : "0%"};`
		style += `background-position:center;`;
		style += `background-repeat:no-repeat;`;
		style += `}`;

		return style;
	}

	protected clearWallpaperScript(content: string): string {
		return content.replace(this.getScriptMatch(), "");
	}

	protected getScriptMatch(): RegExp {
		return new RegExp(
			"\\/\\*" + this.extensionKey + "-start\\*\\/[\\s\\S]*?\\/\\*" + this.extensionKey + "-end\\*\\/",
			"g"
		);
	}

	protected getRandomOrNormalScript(random: boolean): string {
		let script = "let i=0;let pre=undefined;";

		if (random) {
			script += `let played=new Array();`;
			script += `const choice=(min,max)=>{return Math.floor(Math.random()*(max-min+1))+min;};`;
			script += `const after=(index)=>{played.push(images[index]);images.splice(index,1);if(images.length===0){images=played;played=new Array();}};`;
			script += `i=choice(0,images.length-1);`;
		} else {
			script += `const choice=(min,max)=>{i++; return i===max?min:i;};`
			script += `const after=(index)=>{return;};`;
		}

		script += `let current="${this.extensionKey}-"+i.toString();`;
		script += `changeImage(pre,current);pre=current;after(i);`;

		return script;
	}

	protected getFileUrl(image: string): string {
		return `vscode-file://vscode-app${pathToFileURL(image).pathname}`;
	}

	protected getOpacity(opacity: number): string {
		return this.isAdvancedMode ? `` : `opacity:${opacity};`
	}
}
