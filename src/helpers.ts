import { logger } from './logging';

export const emitError = (msg: string) => {
	logger('error', msg);
	vim.defer_fn(
		() => vim.cmd(`echohl WarningMsg | echo "${msg}" | echohl None`),
		0,
	);
};
