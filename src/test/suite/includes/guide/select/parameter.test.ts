import * as assert                                 from "assert";
import * as sinon                                  from "sinon";
import * as path                                   from "path";
import {
	ExtensionContext,
	QuickInputButton,
	QuickPickItem
}                                                  from "vscode";
import * as testTarget                             from "../../../../../includes/guide/select/parameter";
import { MultiStepInput }                          from "../../../../../includes/utils/multiStepInput";
import * as Installer                              from "../../../../../includes/installer";
import { State }                                   from "../../../../../includes/guide/base/base";
import { ExtensionSetting }                        from "../../../../../includes/settings/extension";
import { VSCodePreset }                            from "../../../../../includes/utils/base/vscodePreset";
import { BaseQuickPickGuide }                      from "../../../../../includes/guide/base/pick";
import { ImageFilePathGuide }                      from "../../../../../includes/guide/image";
import { SlideFilePathsGuide, SlideIntervalGuide } from "../../../../../includes/guide/slide";
import { OpacityGuide }                            from "../../../../../includes/guide/opacity";
import * as Wallpaper                              from "../../../../../includes/guide/select/wallpaper";

interface QuickPickParameters<T extends QuickPickItem> {
	title:        string;
	step:         number;
	totalSteps:   number;
	items:        T[];
	activeItem?:  T;
	placeholder:  string;
	buttons?:     QuickInputButton[];
	shouldResume: () => Thenable<boolean>;
}

suite('Guide - SelectFavoriteProcess Test Suite', async () => {
	const items         = [
		VSCodePreset.create(VSCodePreset.Icons.fileMedia, "Image Path",            "Set the image to be used as the wallpaper."),
		VSCodePreset.create(VSCodePreset.Icons.folder,    "Image Files Path",      "Set the images to be used as the slide."),
		VSCodePreset.create(VSCodePreset.Icons.eye,       "Opacity",               "Set the opacity of the wallpaper."),
		VSCodePreset.create(VSCodePreset.Icons.clock,     "Slide Interval",        "Set the slide interval."),
		VSCodePreset.create(VSCodePreset.Icons.law,       "Slide Interval's Unit", "Set the slide interval's unit."),
		VSCodePreset.create(VSCodePreset.Icons.merge,     "Slide Random Playback", "set whether to play the slides randomly."),
		VSCodePreset.create(VSCodePreset.Icons.foldDown,  "Effect Fade in",        "set whether to use fade in effect."),
		VSCodePreset.create(VSCodePreset.Icons.save,      "Save",                  "Save changes."),
		VSCodePreset.create(VSCodePreset.Icons.reply,     "Return",                "Return without saving any changes."),
	];
	const stateCreater  = (setting: ExtensionSetting) => ({ title: "Test Suite", guideGroupId: "test", settings: setting, installer: Installer.getInstance(setting), resultSet: {} } as State);
	const itemChecker = (assumption: Array<QuickPickItem>, result: Array<QuickPickItem>) => {
		if (assumption.length !== result.length) {
			assert.fail(`assumption:${assumption.length} !== result:${result.length}`);
		}

		assumption.forEach((assumptionItem) => {
			const check = result.find((resultItem) => {
				return assumptionItem.label === resultItem.label && assumptionItem.description === resultItem.description
			});

			if (!check) {
				assert.fail(`${assumptionItem.label} is not found...`);
			}
		});
	};

	test('SelectParameterType', async () => {
		const pickStub                = sinon.stub(MultiStepInput.prototype,      "showQuickPick");
		const imageStub               = sinon.stub(ImageFilePathGuide.prototype,  "start");
		const slideStub               = sinon.stub(SlideFilePathsGuide.prototype, "start");
		const opacityStub             = sinon.stub(OpacityGuide.prototype,        "start");
		const intervalStub            = sinon.stub(SlideIntervalGuide.prototype,  "start");
		const baseQuickPickStub       = sinon.stub(BaseQuickPickGuide.prototype,  "start");
		const wallpaperStub           = sinon.stub(Wallpaper,                     "delegation2Transition");
		let   state                   = stateCreater(new ExtensionSetting());
		const context                 = { asAbsolutePath: (dir: string) => path.join(__dirname, "..", "..", "..", "..", "..", "..", dir) } as ExtensionContext;

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectParameterType(state).start(input));
		itemChecker(
			[items[0], items[1], items[2], items[3], items[4], items[5], items[6], items[8]],
			pickStub.getCall(0).args[0].items
		);

		state                         = stateCreater(new ExtensionSetting());
		state.resultSet["test"]       = { opacity: "0.85" };
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectParameterType(state).start(input));
		itemChecker(items, pickStub.getCall(1).args[0].items);

		// eslint-disable-next-line
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => args.items[0]);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectParameterType(state, context).start(input));

		// eslint-disable-next-line
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => args.items[1]);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectParameterType(state, context).start(input));

		// eslint-disable-next-line
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => args.items[2]);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectParameterType(state, context).start(input));
		
		// eslint-disable-next-line
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => args.items[3]);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectParameterType(state, context).start(input));

		// eslint-disable-next-line
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => args.items[4]);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectParameterType(state, context).start(input));

		// eslint-disable-next-line
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => args.items[5]);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectParameterType(state, context).start(input));

		// eslint-disable-next-line
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => args.items[6]);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectParameterType(state, context).start(input));

		// eslint-disable-next-line
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => args.items[7]);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectParameterType(state, context).start(input));
		assert.strictEqual(new ExtensionSetting().getItemValue(ExtensionSetting.propertyIds.opacity), 0.85);

		// eslint-disable-next-line
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => args.items[8]);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectParameterType(state, context).start(input));

		assert.strictEqual(imageStub.calledOnce,           true);
		assert.strictEqual(slideStub.calledOnce,           true);
		assert.strictEqual(opacityStub.calledOnce,         true);
		assert.strictEqual(intervalStub.calledOnce,        true);
		assert.strictEqual(baseQuickPickStub.calledThrice, true);

		pickStub.restore();
		imageStub.restore();
		slideStub.restore();
		opacityStub.restore();
		intervalStub.restore();
		baseQuickPickStub.restore();
		wallpaperStub.restore();

		await new ExtensionSetting().uninstall();
	}).timeout(30 * 1000);
});
