import * as assert        from "assert";
import * as testTarget    from "../../../../../includes/guide/factory/base";
import { State }          from "../../../../../includes/guide/base/base";
import { StartMenuGuide } from "../../../../../includes/guide/begin";

suite('Guide Factory Test Suite', async () => {
	test('create', async () => {
		const instance = testTarget.GuideFactory.create("StartMenuGuide", {} as Partial<State>);
		assert(instance instanceof StartMenuGuide);
	});

	test('create - Non Exist Class', () => {
		const className = "Not Exist Class";

		try {
			testTarget.GuideFactory.create(className);
		} catch (e) {
			assert(e instanceof ReferenceError);
		}
	});
});
