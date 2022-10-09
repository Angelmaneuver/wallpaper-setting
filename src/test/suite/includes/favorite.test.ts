import * as assert                    from "assert";
import * as path                      from "path";
import * as sinon                     from "sinon";
import * as testTarget                from "../../../includes/favorite";
import { ExtensionSetting, Favorite } from "../../../includes/settings/extension";
import { InstallManager }             from "../../../includes/installer";

suite('Favorite Test Suite', async () => {
	test('Image Only', async () => {
		const installStub               = sinon.stub(InstallManager.prototype, "install");
		const installAsSlideStub        = sinon.stub(InstallManager.prototype, "installAsSlide");

		const setupInstance             = new ExtensionSetting();
		const imageFavorite             = {} as Favorite;
		imageFavorite["Image Favorite"] = {
			filePath: path.join(__dirname, "testDir", "test.png"),
			opacity:  0.5
		}

		await setupInstance.setItemValue(ExtensionSetting.propertyIds.favoriteImageSet, imageFavorite);
		await testTarget.randomSet();
		assert.strictEqual(installStub.notCalled,        true);
		assert.strictEqual(installAsSlideStub.notCalled, true);

		await setupInstance.setItemValue(ExtensionSetting.propertyIds.favoriteRandomSet, true);
		await testTarget.randomSet();
		assert.strictEqual(installStub.calledOnce,       true);
		assert.strictEqual(installAsSlideStub.notCalled, true);

		installStub.restore();
		installAsSlideStub.restore();
		await setupInstance.uninstall();
	}).timeout(30 * 1000);

	test('Slide Only', async () => {
		const installStub               = sinon.stub(InstallManager.prototype, "install");
		const installAsSlideStub        = sinon.stub(InstallManager.prototype, "installAsSlide");

		const setupInstance             = new ExtensionSetting();
		const slideFavorite             = {} as Favorite;
		slideFavorite["Slide Favorite"] = {
			slideFilePaths:    [path.join(__dirname, "testDir", "test.png")],
			opacity:           0.5,
			slideInterval:     10,
			slideIntervalUnit: "Second",
			slideEffectFadeIn: false,
			slideRandomPlay:   false
		}

		await setupInstance.setItemValue(ExtensionSetting.propertyIds.favoriteSlideSet, slideFavorite);
		await testTarget.randomSet();
		assert.strictEqual(installStub.notCalled,        true);
		assert.strictEqual(installAsSlideStub.notCalled, true);

		await setupInstance.setItemValue(ExtensionSetting.propertyIds.favoriteRandomSet, true);
		await testTarget.randomSet()
		assert.strictEqual(installStub.notCalled,         true);
		assert.strictEqual(installAsSlideStub.calledOnce, true);

		installStub.restore();
		installAsSlideStub.restore();
		await setupInstance.uninstall();
	}).timeout(30 * 1000);

	test('Image and Slide', async () => {
		const installStub               = sinon.stub(InstallManager.prototype, "install");
		const installAsSlideStub        = sinon.stub(InstallManager.prototype, "installAsSlide");

		const setupInstance             = new ExtensionSetting();
		const imageFavorite             = {} as Favorite;
		imageFavorite["Image Favorite"] = {
			filePath: path.join(__dirname, "testDir", "test.png"),
			opacity:  0.5
		}
		const slideFavorite             = {} as Favorite;
		slideFavorite["Slide Favorite"] = {
			slideFilePaths:    [path.join(__dirname, "testDir", "test.png")],
			opacity:           0.5,
			slideInterval:     10,
			slideIntervalUnit: "Second",
			slideEffectFadeIn: false,
			slideRandomPlay:   false
		}

		await setupInstance.setItemValue(ExtensionSetting.propertyIds.favoriteImageSet, imageFavorite);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.favoriteSlideSet, slideFavorite);
		await testTarget.randomSet(); 
		assert.strictEqual(installStub.notCalled,                                   true);
		assert.strictEqual(installAsSlideStub.notCalled,                            true);

		await setupInstance.setItemValue(ExtensionSetting.propertyIds.favoriteRandomSet, true);
		await testTarget.randomSet()
		assert.strictEqual(installStub.calledOnce || installAsSlideStub.calledOnce, true);

		installStub.restore();
		installAsSlideStub.restore();
		await setupInstance.uninstall();
	}).timeout(30 * 1000);

	test('Image and Slide - Filtering Image Only', async () => {
		const installStub               = sinon.stub(InstallManager.prototype, "install");
		const installAsSlideStub        = sinon.stub(InstallManager.prototype, "installAsSlide");

		const setupInstance             = new ExtensionSetting();
		const imageFavorite             = {} as Favorite;
		imageFavorite["Image Favorite"] = {
			filePath: path.join(__dirname, "testDir", "test.png"),
			opacity:  0.5
		}
		const slideFavorite             = {} as Favorite;
		slideFavorite["Slide Favorite"] = {
			slideFilePaths:    [path.join(__dirname, "testDir", "test.png")],
			opacity:           0.5,
			slideInterval:     10,
			slideIntervalUnit: "Second",
			slideEffectFadeIn: false,
			slideRandomPlay:   false
		}

		await setupInstance.setItemValue(ExtensionSetting.propertyIds.favoriteImageSet,        imageFavorite);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.favoriteSlideSet,        slideFavorite);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.favoriteRandomSet,       true);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.favoriteRandomSetFilter, "Image");

		for( let i = 0; i < 100; i++ ) {
			await testTarget.randomSet();
		}

		assert.strictEqual(installStub.callCount,        100);
		assert.strictEqual(installAsSlideStub.notCalled, true);

		installStub.restore();
		installAsSlideStub.restore();
		await setupInstance.uninstall();
	}).timeout(30 * 1000);

	test('Image and Slide - Filtering Slide Only', async () => {
		const installStub               = sinon.stub(InstallManager.prototype, "install");
		const installAsSlideStub        = sinon.stub(InstallManager.prototype, "installAsSlide");

		const setupInstance             = new ExtensionSetting();
		const imageFavorite             = {} as Favorite;
		imageFavorite["Image Favorite"] = {
			filePath: path.join(__dirname, "testDir", "test.png"),
			opacity:  0.5
		}
		const slideFavorite             = {} as Favorite;
		slideFavorite["Slide Favorite"] = {
			slideFilePaths:    [path.join(__dirname, "testDir", "test.png")],
			opacity:           0.5,
			slideInterval:     10,
			slideIntervalUnit: "Second",
			slideEffectFadeIn: false,
			slideRandomPlay:   false
		}

		await setupInstance.setItemValue(ExtensionSetting.propertyIds.favoriteImageSet,        imageFavorite);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.favoriteSlideSet,        slideFavorite);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.favoriteRandomSet,       true);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.favoriteRandomSetFilter, "Slide");

		for( let i = 0; i < 100; i++ ) {
			await testTarget.randomSet();
		}

		assert.strictEqual(installStub.notCalled,        true);
		assert.strictEqual(installAsSlideStub.callCount, 100);

		installStub.restore();
		installAsSlideStub.restore();
		await setupInstance.uninstall();
	}).timeout(30 * 1000);
});
