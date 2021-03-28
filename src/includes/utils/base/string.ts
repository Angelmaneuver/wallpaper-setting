export function formatByArray(message: string, ...args: any[]): string {
	return message.replace(/\{(\d+)\}/g, (blanket, index) => {
		return args[index];
	});
}
