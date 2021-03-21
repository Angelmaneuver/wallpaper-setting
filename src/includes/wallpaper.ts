import * as path          from 'path';

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

    public install(): void {
        let editFile = new File(this.installPath, {encoding: 'utf-8'});

        editFile.content = this.clearWallpaperScript(editFile.content) + this.getWallpaperScript(
            this.settings.filePath,
            this.settings.opacity
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

            result += `
/*${this.extensionKey}-start*/
/*${this.extensionKey}.ver.${packageInfo.version}*/
window.onload=()=>{`;
            result += `document.body.style.opacity=${this.settings.opacity};`;
            result += `document.body.style.backgroundSize="cover";`;
            result += `document.body.style.backgroundPosition="Top Left";`;
            result += `document.body.style.backgroundRepeat="no-repeat";`;
            result += `document.body.style.backgroundImage='url("data:image/${image.extension};base64,${image.toBase64()}")';`;
            result += `}
/*${this.extensionKey}-end*/`;
        }

        return result;
    }

    private clearWallpaperScript(content: string): string {
        let re = new RegExp(
            '\\/\\*' + this.extensionKey + '-start\\*\\/[\\s\\S]*?\\/\\*' + this.extensionKey + '-end\\*\\/',
            'g'
        );

        return content.replace(re, '').replace(/\s*$/, '');
    }
}
