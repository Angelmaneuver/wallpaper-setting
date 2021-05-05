import { QuickPickItem } from "vscode";
import * as iconA2E      from "./icons/a2e";
import * as iconF2J      from "./icons/f2j";
import * as iconK2O      from "./icons/k2o";
import * as iconP2T      from "./icons/p2t";
import * as iconU2Z      from "./icons/u2z";

export class VSCodePreset {
	// @see https://code.visualstudio.com/api/references/icons-in-labels
	public static Icons: { [key: string]: { label: string, description: string}} = { ...iconA2E.icons, ...iconF2J.icons, ...iconK2O.icons, ...iconP2T.icons, ...iconU2Z.icons };

	public static get getAllIcons(): Array<QuickPickItem> {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		return Object.entries(VSCodePreset.Icons).map(([key, value]) => (value));
	}

	public static create(
		baseIcon:         QuickPickItem,
		additionalLabel?: string,
		description?:     string
	): QuickPickItem {
		return {
			label:       baseIcon.label + (additionalLabel ? " " + additionalLabel : ""),
			description: description ? description : baseIcon.description
		};
	}
}
