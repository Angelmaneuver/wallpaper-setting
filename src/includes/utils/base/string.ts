export function formatByArray(message: string, ...args: Array<string>): string {
	return message.replace(/\{(\d+)\}/g, (blanket, index) => {
		return args[index];
	});
}
