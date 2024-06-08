declare module 'neotest-playwright.pickers' {
	/** Shows a project picker. */
	const show_picker: (
		opts: Record<string, unknown> | null,
		np_opts: {
			prompt: string;
			choices: string[];
			preselected: string[];
			on_select: (this: void, selection: string[]) => void;
		},
	) => void;
}
