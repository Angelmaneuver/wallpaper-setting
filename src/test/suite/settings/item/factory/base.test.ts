import * as assert     from "assert";
import * as sinon      from "sinon";
import { Optional }    from "../../../../../includes/utils/base/optional";
import * as testTarget from "../../../../../includes/settings/item/factory/base";

suite('Settings Item Factory Test Suite', async () => {
	test('create - Non Exist Class', () => {
		const itemName  = "Not Exist Item";
		const className = "Not Exist Class";

		try {
			testTarget.SettingItemFactory.create(itemName, undefined);
		} catch (e) {
			assert(e instanceof ReferenceError);
		}

		const mock      = sinon.mock(Optional.ofNullable(undefined));
		mock.expects("orElseThrow").once().returns(className);

		try {
			testTarget.SettingItemFactory.create(itemName, undefined);
		} catch (e) {
			assert(e instanceof ReferenceError);
		}

		mock.restore();
	});
});
