/**
 * Uses vim.ui.select to present a list of options to the user. However,
 * instead of disappearing when the user selects an option, the list remains
 * open and the user can select multiple options. The user can *keep toggling
 * options until they are satisfied with their selection. Then they can press
 * enter to close the list and return the selected options.
 *
 * An asterisk is used to indicate that an option is selected.
 *
 * A final option "done" is added to the list to allow the user to close the list.
 */
export const selectMultiple = ({
	prompt,
	options,
	initial = 'none',
}: {
	prompt: string;
	options: string[];
	/** Whether to select all options by default */
	initial?: 'all' | 'none';
}) => {
	const done = 'done';
	const done_index = options.length + 1;
	const all_options = [...options, done];
	let selected = initial === 'all' ? new Set(options) : new Set();
	let choice: unknown;
	let done_selected = false;

	while (!done_selected) {
		vim.ui.select(
			all_options,
			{
				prompt,
				format_item: (item: string) => {
					return selected.has(item) ? `* ${item}` : item;
				},
			},
			(c) => {
				choice = c;
			},
		);

		if (choice === done) {
			done_selected = true;
			break;
		} else {
			// @ts-ignore
			const index = all_options.indexOf(choice);
			if (index === -1) {
				// user aborted the dialog, return the last selected options
				done_selected = true;
			} else if (index === done_index) {
				done_selected = true;
			} else {
				if (selected.has(choice)) {
					selected.delete(choice);
				} else {
					selected.add(choice);
				}
			}
		}

		// redraw the screen to avoid stacking multiple dialogs
		vim.cmd('redraw');
	}

	return Array.from(selected);
};
