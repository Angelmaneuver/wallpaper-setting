import * as assert     from "assert";
import * as testTarget from "../../../includes/constant";

suite('Constant Test Suite', async () => {
	test('itemsCreat', async () => {
		const confirmItem1  = "Confirm Yes";
		const confirmItem2  = "Confirm No";
		const confirm       = testTarget.itemsCreat(testTarget.ItemType.Confirm, { item1: confirmItem1, item2: confirmItem2 });

		assert.strictEqual(confirm[0].label,       "$(check) Yes");
		assert.strictEqual(confirm[0].description, confirmItem1);
		assert.strictEqual(confirm[1].label,       "$(x) No");
		assert.strictEqual(confirm[1].description, confirmItem2);

		const wallpaperItem1 = "Confirm Yes";
		const wallpaperItem2 = "Confirm No";
		const returnItem     = "Return";
		const wallpaper      = testTarget.itemsCreat(testTarget.ItemType.Wallpaper, { item1: wallpaperItem1, item2: wallpaperItem2, return: returnItem });

		assert.strictEqual(wallpaper[0].label,       "$(file-media) Image");
		assert.strictEqual(wallpaper[0].description, confirmItem1);
		assert.strictEqual(wallpaper[1].label,       "$(folder) Slide");
		assert.strictEqual(wallpaper[1].description, confirmItem2);
		assert.strictEqual(wallpaper[2].label,       "$(reply) Return");
		assert.strictEqual(wallpaper[2].description, returnItem);

		try {
			testTarget.itemsCreat(999, { item1: "", item2: "" });
		} catch(e) {
			assert(e instanceof ReferenceError);
		}
	});
});
