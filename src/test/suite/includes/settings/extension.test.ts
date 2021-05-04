import * as assert            from "assert";
import * as path              from "path";
import * as testTarget        from "../../../../includes/settings/extension";
import { BooleanSettingItem } from "../../../../includes/settings/item/base";
import * as Constant          from "../../../../includes/constant";

suite('Extension Setting Test Suite', async () => {
	test('Default Value', async () => {
		const instance = new testTarget.ExtensionSetting();

		for (const key of Object.keys(testTarget.ExtensionSetting.propertyIds)) {
			const itemId = testTarget.ExtensionSetting.propertyIds[key];
			const item   = instance.getItem(itemId);

			if (item instanceof BooleanSettingItem) {
				assert.strictEqual(item.value,         item.defaultValue ? item.trueValue : item.falseValue);
				assert.strictEqual(item.valueAsString, item.defaultValue ? item.trueValue : item.falseValue);
				assert.strictEqual(item.validValue,    item.defaultValue);
			} else if (typeof(item.defaultValue) !== "object") {
				assert.strictEqual(item.value,         item.defaultValue);
				assert.strictEqual(item.validValue,    item.defaultValue);	
			} else {
				if (
					Object.keys(item.defaultValue).length !== Object.keys(item.value).length        ||
					Object.keys(item.defaultValue).length !== Object.keys(item.defaultValue).length
				) {
					assert.fail();
				}

				for (const index in item.defaultValue) {
					const defaultValue = item.defaultValue[index];

					if (item.value[index] !== defaultValue || item.validValue[index] !== defaultValue) {
						assert.fail();
					}
				}
			}

			assert.strictEqual(item.convert4Registration, undefined);
		}

		assert.strictEqual(instance.slideIntervalUnit2Millisecond, instance.slideInterval.value * 1000 * 60);
		assert.strictEqual(instance.isFavoriteRegisterd,           undefined);
		assert.strictEqual(instance.FavoriteAutoset,               undefined);
	});

	test('getItem - Not Exist Item', async () => {
		const instance = new testTarget.ExtensionSetting();

		try {
			instance.getItem("Not Exist Item");
		} catch (e) {
			assert(e instanceof ReferenceError);
		}
	});

	test('Image Setup items', async () => {
		let   setupInstance = new testTarget.ExtensionSetting();
		const filePath      = path.join(__dirname, "test", "test.png");
		const opacity       = 0.55;

		setupInstance.setItemValueNotRegist(testTarget.ExtensionSetting.propertyIds.filePath, filePath);

		assert.strictEqual(setupInstance.filePath.value,                                        filePath);
		assert.strictEqual(setupInstance.get(testTarget.ExtensionSetting.propertyIds.filePath), setupInstance.filePath.defaultValue);

		setupInstance       = new testTarget.ExtensionSetting();
		await setupInstance.setItemValue(testTarget.ExtensionSetting.propertyIds.filePath, filePath);
		await setupInstance.setItemValue(testTarget.ExtensionSetting.propertyIds.opacity,  opacity);

		const instance      = new testTarget.ExtensionSetting();

		assert.strictEqual(instance.getItemValue(testTarget.ExtensionSetting.propertyIds.filePath), filePath);
		assert.strictEqual(instance.filePath.validValue,                                            filePath);
		assert.strictEqual(instance.filePath.convert4Registration,                                  filePath);

		assert.strictEqual(instance.getItemValue(testTarget.ExtensionSetting.propertyIds.opacity),  opacity);
		assert.strictEqual(instance.opacity.validValue,                                             opacity);
		assert.strictEqual(instance.opacity.convert4Registration,                                   opacity);

		assert.strictEqual(instance.isFavoriteRegisterd,                                            undefined);
		assert.strictEqual(instance.FavoriteAutoset,                                                undefined);

		await instance.uninstall();
	}).timeout(30 * 1000);

	test('Slide Setup items', async () => {
		const setupInstance  = new testTarget.ExtensionSetting();
		const slideFilePaths = [
			path.join(__dirname, "testDir1", "test1.png"),
			path.join(__dirname, "testDir1", "test2.jpg"),
			path.join(__dirname, "testDir1", "testDir2", "test3.gif")
		];
		const slideInterval  = 5;

		await setupInstance.setItemValue(testTarget.ExtensionSetting.propertyIds.slideFilePaths,    slideFilePaths);
		await setupInstance.setItemValue(testTarget.ExtensionSetting.propertyIds.slideInterval,     slideInterval);
		await setupInstance.setItemValue(testTarget.ExtensionSetting.propertyIds.slideIntervalUnit, "Hour");

		const instance       = new testTarget.ExtensionSetting();
		let   item1          = instance.slideFilePaths;

		if (
			slideFilePaths.length !== item1.value.length
			|| slideFilePaths.length !== item1.validValue.length
			|| slideFilePaths.length !== (item1.convert4Registration as Array<string>).length
		) {
			assert.fail();
		}

		for (const index in slideFilePaths) {
			if (
				slideFilePaths[index] !== item1.value[index]
				|| slideFilePaths[index] !== item1.validValue[index]
				|| slideFilePaths[index] !== (item1.convert4Registration as Array<string>)[index]
			) {
				assert.fail();
			}
		}

		item1                = instance.slideInterval;
		assert.strictEqual(item1.value,                             slideInterval);
		item1                = instance.slideIntervalUnit;
		assert.strictEqual(item1.value,                             "Hour");
		assert.strictEqual(instance.slideIntervalUnit2Millisecond, slideInterval * 1000 * 60 * 60);

		await instance.setItemValue(testTarget.ExtensionSetting.propertyIds.slideIntervalUnit, "Minute");
		assert.strictEqual(instance.slideIntervalUnit2Millisecond, slideInterval * 1000 * 60);

		await instance.setItemValue(testTarget.ExtensionSetting.propertyIds.slideIntervalUnit, "Second");
		assert.strictEqual(instance.slideIntervalUnit2Millisecond, slideInterval * 1000);

		await instance.setItemValue(testTarget.ExtensionSetting.propertyIds.slideRandomPlay,   true);
		let item2            = instance.slideRandomPlay
		assert.strictEqual(item2.value,      item2.trueValue);
		assert.strictEqual(item2.validValue, true);

		await instance.setItemValue(testTarget.ExtensionSetting.propertyIds.slideRandomPlay,   false)
		assert.strictEqual(item2.value,      item2.falseValue);
		assert.strictEqual(item2.validValue, false);

		await instance.setItemValue(testTarget.ExtensionSetting.propertyIds.slideEffectFadeIn, false);
		item2                = instance.slideEffectFadeIn;
		assert.strictEqual(item2.value,      item2.falseValue)
		assert.strictEqual(item2.validValue, false);

		await instance.setItemValue(testTarget.ExtensionSetting.propertyIds.slideEffectFadeIn, true);
		assert.strictEqual(item2.value,      item2.trueValue)
		assert.strictEqual(item2.validValue, true);

		await instance.uninstall();
	}).timeout(30 * 1000);

	test('Favorite Registerd', async () => {
		await new testTarget.ExtensionSetting().setItemValue(
			testTarget.ExtensionSetting.propertyIds.favoriteImageSet,
			{ dummy : "dummy" }
		);

		let instance = new testTarget.ExtensionSetting();
		assert.strictEqual(instance.isFavoriteRegisterd?.image, true);
		assert.strictEqual(instance.isFavoriteRegisterd?.slide, false);

		await instance.uninstall();

		await new testTarget.ExtensionSetting().setItemValue(
			testTarget.ExtensionSetting.propertyIds.favoriteSlideSet,
			{ dummy : "dummy" }
		);

		instance     = new testTarget.ExtensionSetting();
		assert.strictEqual(instance.isFavoriteRegisterd?.image, false);
		assert.strictEqual(instance.isFavoriteRegisterd?.slide, true);

		await instance.uninstall();

		await new testTarget.ExtensionSetting().setItemValue(
			testTarget.ExtensionSetting.propertyIds.favoriteImageSet,
			{ dummy : "dummy" }
		);

		await new testTarget.ExtensionSetting().setItemValue(
			testTarget.ExtensionSetting.propertyIds.favoriteSlideSet,
			{ dummy : "dummy" }
		);

		instance     = new testTarget.ExtensionSetting();
		assert.strictEqual(instance.isFavoriteRegisterd?.image, true);
		assert.strictEqual(instance.isFavoriteRegisterd?.slide, true);

		await instance.uninstall();
	}).timeout(30 * 1000);

	test('Other Input', async () => {
		const setupInstance = new testTarget.ExtensionSetting();
		await setupInstance.setItemValue(testTarget.ExtensionSetting.propertyIds.opacity,           "0.85");
		await setupInstance.setItemValue(testTarget.ExtensionSetting.propertyIds.slideRandomPlay,   Constant.slideRandomPlay[0].label);
		await setupInstance.setItemValue(testTarget.ExtensionSetting.propertyIds.slideEffectFadeIn, Constant.slideEffectFadeIn[1].label);

		const instance      = new testTarget.ExtensionSetting();
		assert.strictEqual(instance.opacity.value,                0.85);
		assert.strictEqual(instance.slideRandomPlay.value,        Constant.slideRandomPlay[0].label);
		assert.strictEqual(instance.slideRandomPlay.validValue,   true);
		assert.strictEqual(instance.slideEffectFadeIn.value,      Constant.slideEffectFadeIn[1].label);
		assert.strictEqual(instance.slideEffectFadeIn.validValue, false);

		instance.favoriteRandomSet.value = true;
		assert.strictEqual(instance.favoriteRandomSet.value,      Constant.favoriteRandomSet[0].label);
		assert.strictEqual(instance.favoriteRandomSet.validValue, true);

		try {
			instance.favoriteRandomSet.value = 0.5
		} catch (e) {
			assert(e instanceof TypeError);
		}

		await instance.uninstall()
	}).timeout(30 * 1000);
});
