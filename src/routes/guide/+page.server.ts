import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { PageServerLoad } from './$types.js';

const SCENARIOS_DIR = 'static/scenarios';

export const load: PageServerLoad = async () => {
	const slugs = readdirSync(SCENARIOS_DIR, { withFileTypes: true })
		.filter((d) => d.isDirectory())
		.map((d) => d.name);

	// Load copper-tailings as the default example scenario
	const defaultSlug = 'copper-tailings';
	const json = JSON.parse(readFileSync(join(SCENARIOS_DIR, defaultSlug, 'scenario.json'), 'utf-8'));
	const s = json.Scenario;

	return {
		slugs,
		defaultScenario: {
			name: s.Name as string,
			slug: defaultSlug,
			entities: ((s.Entities as any[]) ?? []).map((e) => ({
				id: e.ID as string,
				icon: e.Icon as string,
				colour: e.Colour as string
			}))
		}
	};
};
