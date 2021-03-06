import * as assert                    from "assert";
import * as path                      from "path";
import * as sinon                     from "sinon";
import * as testTarget                from "../../../includes/favorite";
import { ExtensionSetting, Favorite } from "../../../includes/settings/extension";
import { Wallpaper }                  from "../../../includes/wallpaper";

suite('Favorite Test Suite', async () => {
	test('Image Only', async () => {
		const installStub               = sinon.stub(Wallpaper.prototype, "install");
		const installAsSlideStub        = sinon.stub(Wallpaper.prototype, "installAsSlide");

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
		await testTarget.randomSet()
		assert.strictEqual(installStub.calledOnce,       true);
		assert.strictEqual(installAsSlideStub.notCalled, true);

		installStub.restore();
		installAsSlideStub.restore();
		await setupInstance.uninstall();
	}).timeout(30 * 1000);

	test('Slide Only', async () => {
		const installStub               = sinon.stub(Wallpaper.prototype, "install");
		const installAsSlideStub        = sinon.stub(Wallpaper.prototype, "installAsSlide");

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
		const installStub               = sinon.stub(Wallpaper.prototype, "install");
		const installAsSlideStub        = sinon.stub(Wallpaper.prototype, "installAsSlide");

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
});
