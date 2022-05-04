import { ExtensionContext } from "vscode";
import { Optional }         from "./optional";

export class ContextManager {
	private static context: ExtensionContext | undefined;

	public static setContext(context: ExtensionContext): void {
		ContextManager.context = context;
	}

	public static get getContext(): ExtensionContext {
		return Optional.ofNullable(ContextManager.context).orElseThrow(
			ReferenceError("Extension Context not set...")
		);
	}

	public static get version() {
		return ContextManager.getContext.extension.packageJSON.version;
	}
}
