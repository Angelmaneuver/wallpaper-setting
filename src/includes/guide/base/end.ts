import { InputStep, MultiStepInput } from "../../utils/multiStepInput";
import { AbstractBaseGuide }         from "./base";

export class BaseGuideEnd extends AbstractBaseGuide {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async show(input: MultiStepInput):Promise<void | InputStep> { return; }
}
