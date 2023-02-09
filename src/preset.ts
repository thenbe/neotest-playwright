export const set_preset = (preset: string) => {
	print('set_preset', preset);
};

export const select_preset = () => {
	const options = ['headless', 'headed', 'debug'];

	const prompt = 'Select preset for neotest-playwright:';

	let choice: string | null = null;

	vim.ui.select(options, { prompt }, (c) => {
		choice = c;
	});

	return choice;
};

export const create_preset_command = () => {
	vim.api.nvim_create_user_command(
		'NeotestPlaywright',
		// @ts-expect-error until type is updated
		() => {
			const choice = select_preset();

			if (choice === null) {
				return;
			}

			set_preset(choice);
		},
		{
			nargs: 0,
		},
	);
};
