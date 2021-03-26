import * as path          from 'path';

import {formatByArray}    from './utils/base/string';
import {ExtensionSetting} from './settings/extension';
import {File}             from './utils/base/file';


const packageInfo = require('./../../package.json');

export class Wallpaper {
    private installLocation: string;
    private installFilaName: string;
    private installPath:     string;
    private settings:        ExtensionSetting;
    private extensionKey:    string;

    constructor(
        locationPath: any,
        fileName:     string,
        settings:     ExtensionSetting,
        extensionKey: string
    ) {
        this.installLocation = locationPath;
        this.installFilaName = fileName,
        this.installPath     = path.join(this.installLocation, this.installFilaName);
        this.settings        = settings;
        this.extensionKey    = extensionKey;
    }

	public isInstall(): boolean {
        let script = new File(
			this.installPath,
			{encoding: 'utf-8'}
		).toString().match(this.getScriptMatch());

		return script ? true : false;
	}

	public isReady(): boolean {
		return this.settings.filePath.length > 0 || this.settings.slideFilePaths.length > 0 ? true : false;
	}

    public install(): void {
        let editFile = new File(this.installPath, {encoding: 'utf-8'});

        editFile.content = this.clearWallpaperScript(editFile.content) + this.getWallpaperScript(
            this.settings.filePath,
            this.settings.opacity
        );

        editFile.write({encoding: 'utf-8'});
    }

    public installAsSlide(): void {
        let editFile = new File(this.installPath, {encoding: 'utf-8'});

        editFile.content = this.clearWallpaperScript(editFile.content) + this.getSlideScript(
            this.settings.slideFilePaths,
            this.settings.opacity,
			this.settings.slideIntervalUnit2Millisecond
        );

        editFile.write({encoding: 'utf-8'});
    }

    public uninstall(): void {
        let editFile = new File(this.installPath, {encoding: 'utf-8'});

        editFile.content = this.clearWallpaperScript(editFile.content);

        editFile.write({encoding: 'utf-8'});
    }

    private getWallpaperScript(
        filePath: string,
        opacity:  number
    ): string {
        let result: string = '';

        if(filePath && opacity) {
            let image = new File(filePath);

			result = formatByArray(
				this.getScriptTemplate(opacity),
				`document.body.style.backgroundImage='url("data:image/${image.extension};base64,${image.toBase64()}")';`
			);
        }

        return result;
    }

	private getSlideScript(
		filePaths: Array<string>,
		opacity:   number,
		interval:  number
	): string {
		let result: string = '';

		if(filePaths.length > 0 && opacity && interval) {
			let temp:  string = `let images=new Array();`;
			let count: number = 0

			filePaths.forEach(
				(filePath) => {
					let image  = new File(filePath);
					temp      += `images.push('url("data:image/${image.extension};base64,${image.toBase64()}")');`;
					count     += 1;
				}
			)

			temp += `let i=0;`
			temp += `document.body.style.backgroundImage=images[i];i++;if(i===${count}){i=0;}`
			temp += `setInterval(`;
			temp +=     `()=>{`;
			temp +=         `document.body.style.backgroundImage=images[i];i++;if(i===${count}){i=0;}`;
		    temp +=     `},`;
			temp +=     `${interval}`;
			temp +=     `);`

			result = formatByArray(
				this.getScriptTemplate(opacity),
				temp
			);
		}

		return result;
	}

	private getScriptTemplate(opacity: number): string {
		let result =`
/*${this.extensionKey}-start*/
/*${this.extensionKey}.ver.${packageInfo.version}*/
window.onload=()=>{`;
					result += `document.body.style.opacity=${opacity};`;
					result += `document.body.style.backgroundSize="cover";`;
					result += `document.body.style.backgroundPosition="Top Left";`;
					result += `document.body.style.backgroundRepeat="no-repeat";`;
					result += `{0}`;
					result += `}
/*${this.extensionKey}-end*/`;

		return result;
	}

    private clearWallpaperScript(content: string): string {
        return content.replace(this.getScriptMatch(), '').replace(/\s*$/, '');
    }

	private getScriptMatch(): RegExp {
        return new RegExp(
            '\\/\\*' + this.extensionKey + '-start\\*\\/[\\s\\S]*?\\/\\*' + this.extensionKey + '-end\\*\\/',
            'g'
        );
	}
}
