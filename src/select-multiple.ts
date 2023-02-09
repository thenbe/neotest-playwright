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
export const selectMultiple = (options: string[]) => {
	const prompt = 'Select projects to include in the next test run:';
	const done = 'done';
	const done_index = options.length + 1;
	let selected = new Set();
	let choice: unknown;
	let done_selected = false;

	while (!done_selected) {
		const all_options = options.map((option) => {
			return selected.has(option) ? `* ${option}` : option;
		});

		all_options.push(done);

		vim.ui.select(all_options, { prompt }, (c) => {
			choice = c;
		});

		if (choice === done) {
			done_selected = true;
			break;
		} else {
			// @ts-ignore
			const index = all_options.indexOf(choice);
			if (index === -1) {
				// user aborted the dialog
				return null;
			} else if (index === done_index) {
				done_selected = true;
			} else {
				const selected_option = options[index];
				if (selected.has(selected_option)) {
					selected.delete(selected_option);
				} else {
					selected.add(selected_option);
				}
			}
		}
	}

	return Array.from(selected);
};
