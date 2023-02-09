/**
 * Uses vim.ui.select to present a list of choices to the user. However,
 * instead of disappearing when the user selects an option, the list remains
 * open and the user can select multiple choices. The user can *keep toggling
 * choices until they are satisfied with their selection. Then they can press
 * enter to close the list and return the selected choices.
 *
 * An asterisk is used to indicate that an option is selected.
 *
 * A final option "done" is added to the list to allow the user to close the list.
 */
export const selectMultiple = ({
	prompt,
	choices,
	initial = 'none',
}: {
	prompt: string;
	choices: string[];
	/** Whether to select all choices by default */
	initial?: 'all' | 'none';
}) => {
	const done = 'done';
	const done_index = choices.length + 1;
	const all_choices = [...choices, done];
	let selected = initial === 'all' ? new Set(choices) : new Set();
	let choice: unknown;
	let done_selected = false;

	while (!done_selected) {
		vim.ui.select(
			all_choices,
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
			const index = all_choices.indexOf(choice);
			if (index === -1) {
				// user aborted the dialog, return the last selected choices
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
