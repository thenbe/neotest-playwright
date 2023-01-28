interface IVimExtended {
	json: {
		decode: (
			this: void,
			value: string,
			options?: { luanil: { object: true } },
		) => any;
	};

	loop: {
		fs_scandir: (this: void, path: string) => any[];
		dirname: (this: void, path: string) => string;
	};
}
