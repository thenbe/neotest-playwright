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
	preselected,
}: {
	prompt: string;

	choices: string[];

	/** Whether to select all choices by default. Ignored if `preselected` is a
	 * non-null array. */
	initial?: 'all' | 'none';

	/** An array of choices to select by default. If this is a non-null array,
	 * then the `initial` option is ignored. */
	preselected: string[] | null;
}) => {
	const selected = determineInitialSelection(initial, choices, preselected);
	let choice: unknown;

	let done = false as boolean;

	while (!done) {
		vim.ui.select(
			choices,
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

		const index = choices.indexOf(choice as string);
		done = index === -1;

		if (done) {
			// user aborted the dialog
			break;
		} else if (selected.has(choice)) {
			selected.delete(choice);
		} else {
			selected.add(choice);
		}

		// redraw the screen to avoid stacking multiple dialogs
		vim.cmd('redraw');
	}

	return Array.from(selected);
};

const determineInitialSelection = (
	initial: string,
	choices: string[],
	preselected: string[] | null,
) => {
	if (preselected) {
		return new Set(preselected);
	} else if (initial === 'all') {
		return new Set(choices);
	} else {
		return new Set();
	}
};
