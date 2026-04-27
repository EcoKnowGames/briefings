import { error } from '@sveltejs/kit';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type {
	ScenarioFile,
	BriefingData,
	BriefingYaml,
	EntityDisplay,
	ObjectiveDisplay,
	WatchOutDisplay
} from '$lib/types.js';
import { resolveIconUrl, entityColorToCss, resolveColor } from '$lib/emoji.js';
import { parseSimpleYaml } from '$lib/yaml.js';
import { asset } from '$app/paths';
import type { PageServerLoad } from './$types.js';

const SCENARIOS_DIR = 'static/scenarios';

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug;
	const scenarioDir = join(SCENARIOS_DIR, slug);

	// Load scenario JSON (required)
	const scenarioPath = join(scenarioDir, 'scenario.json');
	if (!existsSync(scenarioPath)) {
		error(404, `Scenario "${slug}" not found`);
	}
	const scenarioFile: ScenarioFile = JSON.parse(readFileSync(scenarioPath, 'utf-8'));
	const scenario = scenarioFile.Scenario;

	// Load briefing YAML (optional — enriches the page but not required)
	let briefing: BriefingYaml | null = null;
	const yamlPath = join(scenarioDir, 'briefing.yaml');
	if (existsSync(yamlPath)) {
		briefing = parseSimpleYaml(readFileSync(yamlPath, 'utf-8')) as BriefingYaml;
	}

	// Load map CSV (optional — provides zone/grid data)
	let mapCsv: string | undefined;
	const csvPath = join(scenarioDir, 'map.csv');
	if (existsSync(csvPath)) {
		mapCsv = readFileSync(csvPath, 'utf-8');
	}

	// Cover image: base64 from JSON, or empty
	const coverImage = scenario.CoverImageBase64
		? `data:image/png;base64,${scenario.CoverImageBase64}`
		: '';

	// Build entity displays
	const introduceEntities: EntityDisplay[] = [];
	const observeEntities: EntityDisplay[] = [];

	for (const e of scenario.Entities ?? []) {
		const iconPath = briefing?.entity_icons?.[e.ID] ?? e.Icon;
		const colorOverride = briefing?.entity_colors?.[e.ID];
		const color = colorOverride ? resolveColor(colorOverride) : entityColorToCss(e.Colour);
		const display: EntityDisplay = {
			id: e.ID,
			name: briefing?.entity_names?.[e.ID] ?? humanizeId(e.ID),
			iconUrl: resolveIconUrl(iconPath, slug),
			color,
			description: briefing?.entity_descriptions?.[e.ID] ?? '',
			canHarvest: e.CanHarvest,
			canIntroduce: e.CanIntroduce
		};

		if (e.CanIntroduce) {
			introduceEntities.push(display);
		} else {
			observeEntities.push(display);
		}
	}

	// Build objectives — use YAML if provided, otherwise auto-generate from WinConditions
	let objectives: ObjectiveDisplay[];

	if (briefing?.objectives && briefing.objectives.length > 0) {
		objectives = briefing.objectives.map((o) => {
			let iconUrl = '';
			let iconBgColor: string | undefined;

			if (o.entity) {
				const entity = scenario.Entities.find((e) => e.ID === o.entity);
				if (entity) {
					const iconPath = briefing?.entity_icons?.[entity.ID] ?? entity.Icon;
					iconUrl = resolveIconUrl(iconPath, slug);
					iconBgColor = entityColorToCss(entity.Colour);
				}
			} else if (o.icon) {
				iconUrl = resolveIconUrl(`Icons/${o.icon}`, slug);
			}

			return {
				title: o.title,
				iconUrl,
				iconBgColor,
				description: o.description,
				goal: o.goal
			};
		});
	} else {
		objectives = (scenario.WinConditions ?? []).map((wc) => {
			let iconUrl = '';
			let iconBgColor: string | undefined;
			let goal = '';

			// Resolve type: newer format uses TypeIndex, older format has EntityIndex (always entity)
			const typeIndex = wc.TypeIndex ?? 0;
			const targetIndex = wc.TargetIndex ?? wc.EntityIndex ?? 0;

			if (typeIndex === 2) {
				// Currency objective
				iconUrl = resolveIconUrl('Icons/currency', slug);
				goal = formatGoal('budget', wc);
			} else if (typeIndex === 1) {
				// Item objective
				const item = (scenario.Items ?? [])[targetIndex];
				if (item) {
					iconUrl = resolveIconUrl(item.Icon, slug);
					goal = formatGoal(item.ID, wc);
				}
			} else {
				// Entity population objective (typeIndex === 0)
				const entity = (scenario.Entities ?? [])[targetIndex];
				if (entity) {
					const iconPath = briefing?.entity_icons?.[entity.ID] ?? entity.Icon;
					iconUrl = resolveIconUrl(iconPath, slug);
					iconBgColor = entityColorToCss(entity.Colour);
					const name = briefing?.entity_names?.[entity.ID] ?? humanizeId(entity.ID);
					goal = formatGoal(name, wc);
				}
			}

			return {
				title: wc.Title,
				iconUrl,
				iconBgColor,
				description: wc.Description,
				goal
			};
		});
	}

	// Build watch out items
	const watchOut: WatchOutDisplay[] = (briefing?.watch_out ?? []).map((w) => {
		let iconUrl = '';
		let iconBgColor: string | undefined;
		let name = w.name ?? '';

		if (w.entity) {
			const entity = scenario.Entities.find((e) => e.ID === w.entity);
			if (entity) {
				iconUrl = resolveIconUrl(entity.Icon, slug);
				iconBgColor = entityColorToCss(entity.Colour);
				if (!name) name = briefing?.entity_names?.[w.entity] ?? humanizeId(w.entity);
			}
		} else if (w.icon) {
			iconUrl = resolveIconUrl(`Icons/${w.icon}`, slug);
		}

		return { name, iconUrl, iconBgColor, description: w.description };
	});

	// Build gameplay summary — auto-generate if not provided
	const gameplaySummary =
		briefing?.gameplay_summary ??
		`Over <strong>${scenario.Rounds} rounds</strong>, with <strong>${scenario.ActionsPerRound} actions</strong> per round and a budget of <strong>${(scenario.StartCurrency ?? 0).toLocaleString()} credits</strong>, you must manage the ecosystem to meet your objectives.`;

	const data: BriefingData = {
		slug,
		name: scenario.Name,
		tag: briefing?.tag ?? 'Scenario Briefing',
		appVersion: scenarioFile.AppVersion ?? '',
		author: scenario.Author,
		authorUrl: briefing?.author_url,
		coverImage,
		situation: briefing?.situation ?? scenario.Description ?? '',
		rounds: scenario.Rounds,
		actions: scenario.ActionsPerRound,
		credits: scenario.StartCurrency ?? 0,
		gameplaySummary,
		infoCard: briefing?.info_card,
		actionsIntro:
			briefing?.actions_intro ??
			'You can perform limited actions to try to meet your **Objectives**.\n\nYou can **Introduce** or **Harvest** certain entities, others you can only observe.\n\nUnderstanding how they interact across zones is key to your strategy and it will take some trial and error.',
		introduceEntities,
		observeEntities,
		zones: briefing?.zones ?? parseZonesFromMap(mapCsv),
		objectives,
		watchOut,
		whyThisMatters: briefing?.why_this_matters,
		furtherReading: briefing?.further_reading ?? [],
		collaborators: briefing?.collaborators
			? {
					image: briefing.collaborators.image,
					label: briefing.collaborators.label ?? 'A collaboration between'
				}
			: undefined,
		play: briefing?.play
	};

	return { briefing: data, scenarioJsonUrl: asset(`/scenarios/${slug}/scenario.json`), mapCsv };
};

function humanizeId(id: string): string {
	const name = id.includes('_')
		? id
				.split('_')
				.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
				.join(' ')
		: id.replace(/([A-Z])/g, ' $1').trim();
	return name.charAt(0).toUpperCase() + name.slice(1);
}

function parseZonesFromMap(csv: string | undefined): { name: string; color: string }[] {
	if (!csv) return [];
	const zonesLine = csv.split('\n').find((l) => l.startsWith('#zones:'));
	if (!zonesLine) return [];
	// Format: #zones:0=Tailings:#CD853F,1=Land:#48bb78,2=Water:#4aa1f2
	return zonesLine
		.slice(7)
		.split(',')
		.map((part) => {
			const match = part.match(/\d+=([^:]+):(#[0-9a-fA-F]+)/);
			return match ? { name: match[1], color: match[2] } : null;
		})
		.filter((z): z is { name: string; color: string } => z !== null);
}

function formatGoal(name: string, wc: import('$lib/types.js').WinCondition): string {
	const hasLower = wc.LowerLimit > 0;
	const hasUpper = wc.UpperLimit > 0;
	const rounds = wc.RequiredRounds;
	const roundsStr = rounds > 1 ? ` for ${rounds} rounds` : '';

	if (hasLower && hasUpper) {
		return `Keep ${name} between ${wc.LowerLimit.toLocaleString()} and ${wc.UpperLimit.toLocaleString()}${roundsStr}`;
	} else if (hasLower) {
		return `Keep ${name} above ${wc.LowerLimit.toLocaleString()}${roundsStr}`;
	} else if (hasUpper) {
		return `Keep ${name} below ${wc.UpperLimit.toLocaleString()}${roundsStr}`;
	}
	return '';
}
