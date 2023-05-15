import { WorkbenchSetting } from "./settings/workbench";
import * as jsonc           from "jsonc-parser";
import { File }             from "./utils/base/file";

const id                  = "colors" as const;
const target              = [
	"activityBar.background",
	"sideBar.background",
	"sideBarSectionHeader.background",
	"editorGroupHeader.tabsBackground",
	"tab.activeBackground",
	"tab.inactiveBackground",
	"editorGutter.background",
	"breadcrumb.background",
	"statusBar.background",
	"statusBar.noFolderBackground",
	"statusBarItem.remoteBackground",
	"panel.background",
	"terminal.background",
	"button.background",
	"button.secondaryBackground",
];
const targetWithOverlap   = [
	"editor.background",
	"editor.lineHighlightBackground",
	"button.background",
	"button.secondaryBackground",
	"checkbox.background",
	"dropdown.background",
	"input.background",
];
const targetWithSelection = [
	"quickInput.background",
	"notifications.background",
];
const matchColorCode      = /^#[A-Fa-f0-9]{6}$/;

interface Opacity {
	base:      string,
	overlap:   string,
	selection: string,
}

export async function theme2transparancy(
	name:       string,
	sourcePath: string,
	opacity:    Opacity,
): Promise<void> {
	const workbenchSetting               = new WorkbenchSetting();
	const baseAa                         = decimal2hex(opacity.base);
	const overlapAa                      = decimal2hex(opacity.overlap);
	const selectionAa                    = decimal2hex(opacity.selection);
	const theme                          = jsonc.parse(new File(sourcePath).content.toString());
	const colors: Record<string, string> = {};

	if (!(id in theme)) {
		return;
	}

	Object.keys(theme[id]).forEach(
		(key) => {
			if (target.includes(key)) {
				colors[key] = convert(theme[id][key], baseAa);
			} else if (targetWithOverlap.includes(key)) {
				colors[key] = convert(theme[id][key], overlapAa);
			} else if (targetWithSelection.includes(key)) {
				colors[key] = convert(theme[id][key], selectionAa);
			}
		}
	);

	return workbenchSetting.update(`[${name}]`, colors);
}

function decimal2hex(opacity: string): string {
	return (Math.round(255 * parseFloat(opacity))).toString(16).padStart(2, "0");
}

function convert(color: string, aa: string): string {
	if (matchColorCode.test(color)) {
		return `${color}${aa}`;
	} else {
		return color;
	}
}
