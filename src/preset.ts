import * as logger from 'neotest.logging';
import { config } from './config';
import { isPreset, Preset } from './preset-options';

export const set_preset = (preset: Preset) => {
	logger.debug('neotest-playwright preset', preset);
	config.options.preset = preset;
};

export const select_preset = () => {
	const options = ['headed', 'debug', 'none'] satisfies Preset[];

	const prompt = 'Select preset for neotest-playwright:';

	let choice: unknown;

	vim.ui.select(options, { prompt }, (c) => {
		choice = c;
	});

	logger.debug('neotest-playwright preset', choice);

	if (isPreset(choice)) {
		return choice;
	} else {
		return null;
	}
};

export const create_preset_command = () => {
	vim.api.nvim_create_user_command(
		'NeotestPlaywrightPreset',
		// @ts-expect-error until type is updated
		() => {
			const choice = select_preset();

			if (choice === null) {
				// nothing selected (user aborted the dialog)
				return;
			}

			set_preset(choice);
		},
		{
			nargs: 0,
		},
	);
};
