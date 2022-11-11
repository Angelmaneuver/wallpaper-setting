import { ConfigurationTarget } from "vscode";
import { SettingBase }         from "./base";
import { Optional }            from "../utils/base/optional";

export class WorkbenchSetting extends SettingBase {
	private _colorCustomizations: Record<string, Record<string, string>>;

	constructor() {
		super("workbench", ConfigurationTarget.Global);

		this._colorCustomizations = Optional.ofNullable(this.get("colorCustomizations")).orElseNonNullable({}) as Record<string, Record<string, string>>;
	}

	public async update(name: string, colors: Record<string, string>): Promise<void> {
		if (!(name in this._colorCustomizations)) {
			this._colorCustomizations[name] = {};
		}

		Object.keys(colors).forEach(
			(key) => {
				this._colorCustomizations[name][key] = colors[key];
			}
		);

		return this.install();
	}

	public async install(): Promise<void> {
		return this.set("colorCustomizations", this._colorCustomizations);
	}

	public async uninstall(): Promise<void> {
		return this.remove("colorCustomizations");
	}

	public get colorTheme(): string {
		return Optional.ofNullable(this.get("colorTheme")).orElseNonNullable("") as string;
	}

	public get colorCustomizations() {
		return this._colorCustomizations;
	}
}
