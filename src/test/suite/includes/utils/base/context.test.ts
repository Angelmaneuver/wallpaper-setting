import * as assert     from "assert";
import * as testTarget from "../../../../../includes/utils/base/context";

suite('Context Manager Test Suite', () => {
	test('getContext - Reference Error', () => {
		try {
			testTarget.ContextManager.getContext;
		} catch (e) {
			assert(e instanceof ReferenceError);
		}
	});
});
