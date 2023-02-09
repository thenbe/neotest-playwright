// TODO: replace vim.notify with logger.debug

export const get_projects = () => {
	const testFilter = './does-not-exist';
	const cmd = `npx playwright test --list --reporter=json ${testFilter} `;
	const output = run(cmd);
	return output;
};

/** Returns the playwright config */
const run = (cmd: string) => {
	const [handle, errmsg] = io.popen(cmd);

	if (typeof errmsg === 'string') {
		vim.notify(errmsg, vim.log.levels.ERROR, {});
	}

	if (!handle) {
		vim.notify(`Failed to execute command: ${cmd}`, vim.log.levels.ERROR, {});
		return;
	}

	const output = handle.read('*a');
	handle.close();

	// print(output);

	if (typeof output !== 'string') {
		vim.notify(
			`Failed to read output from command: ${cmd}`,
			vim.log.levels.ERROR,
			{},
		);
		return;
	}

	if (output === '') {
		vim.notify(`No output from command: ${cmd}`, vim.log.levels.ERROR, {});
		return;
	}

	const parsed = vim.fn.json_decode(output);

	return parsed;
};
