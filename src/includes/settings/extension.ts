import {SettingBase} from './base';


export class ExtensionSetting extends SettingBase {
    public filePath: string;
    public opacity:  number;

    constructor() {
        super('wallpaper-setting');
        this.filePath = this.get('filePath');
        this.opacity  = this.get('opacity');
    }

    public uninstall(): void {
        this.remove('filePath');
        this.remove('opacity');
    }
}
