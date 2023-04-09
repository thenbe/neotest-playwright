// merged with the global IVim interface provided by "@gkzhb/lua-types-nvim"
interface IVim {
	json: {
		decode: (
			this: void,
			value: string,
			options?: { luanil: { object: true } },
		) => unknown;
	};

	loop: {
		fs_scandir: (this: void, path: string) => unknown[];
		dirname: (this: void, path: string) => string;
		cwd: (this: void) => string;
	};

	ui: {
		select: (
			this: void,
			items: string[],
			opts: {
				prompt: string;
				format_item?: (this: void, item: string) => string;
			},
			on_choice: (choice: string) => void,
		) => void;
	};

	cmd: (this: void, cmd: string) => void;

	// TODO: override api.nvim_create_user_command only, without affecting other api.* functions
	// api: {
	// 	nvim_create_user_command: (
	// 		this: void,
	// 		name: string,
	// 		fn: () => void,
	// 		opts?: { nargs: 0 },
	// 	) => void;
	// };
}
