import type * as P from '@playwright/test/reporter';
import type { Position, RangedPosition, RangelessPosition } from 'neotest';
import { data } from './adapter-data';
import { options } from './adapter-options';
import { emitError } from './helpers';
import { logger } from './logging';

type BasePosition = Omit<RangedPosition, 'id'>;

/** Given a test position, return one or more positions based on what can be
 * dynamically discovered using the playwright cli. */
export const buildTestPosition = (basePosition: BasePosition): Position[] => {
	const line = basePosition.range[0];
	// const column = position.range[1];

	if (!data.specs) {
		throw new Error('No specs found');
	}

	const specs = data.specs.filter((spec) => {
		const specAbsolutePath = data.rootDir + '/' + spec.file;

		const fileMatch = specAbsolutePath === basePosition.path;

		if (!fileMatch) {
			return false;
		}

		const rowMatch = spec.line === line + 1;
		// const columnMatch = spec.column === column + 1;

		const match = rowMatch && fileMatch;

		return match;
	});

	if (specs.length === 0) {
		logger('debug', 'No match found');

		// return position with available data
		return [basePosition];
	}

	// filter out positions belonging to ignored projects
	const projects = options.projects;

	const positions: Position[] = [];

	/** The parent of the range-less positions */
	const main = {
		...basePosition,
		// TODO: use treesitter id?
	} satisfies Position;

	positions.push(main);

	specs.map((spec) => {
		const position = specToPosition(spec, basePosition);

		// Determine if the position is part of the selected projects.

		if (options.projects.length === 0) {
			// No projects specified, so all positions are selected
			positions.push(position);
			return;
		} else {
			const projectId = position.project_id;

			if (!projectId) {
				const msg = `No project id found for position: ${position.name}`;
				emitError(msg);
				throw new Error(msg);
			}

			if (projects.includes(projectId)) {
				positions.push(position);
			}
		}
	});

	return positions;
};

/** Convert a playwright spec to a neotest position. */
const specToPosition = (
	spec: P.JSONReportSpec,
	basePosition: BasePosition,
): RangelessPosition | RangedPosition => {
	const projectId = spec.tests[0]?.projectName;

	if (!projectId) {
		const msg = `No project id found for spec: ${spec.title}`;
		emitError(msg);
		throw new Error(msg);
	}

	const { range, ...rest } = basePosition;
	const position = {
		...rest,
		id: spec.id,
		name: projectId,
		project_id: projectId,
	};

	return position;
};
