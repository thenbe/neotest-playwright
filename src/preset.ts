import { options } from './adapter-options';
import { logger } from './logging';
import type { Preset } from './preset-options';
import { isPreset } from './preset-options';

export const set_preset = (preset: Preset) => {
	options.preset = preset;
};

export const select_preset = () => {
	const choices = ['headed', 'debug', 'none'] satisfies Preset[];

	const prompt = 'Select preset for neotest-playwright:';

	let choice: unknown;

	vim.ui.select(choices, { prompt }, (c) => {
		choice = c;
	});

	logger('debug', 'preset', choice);

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
