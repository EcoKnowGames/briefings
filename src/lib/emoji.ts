/**
 * Resolves icon paths from scenario JSON to static URLs.
 *
 * Emoji SVGs come from the fluentui-emoji submodule at:
 *   static/fluentui-emoji/assets/{Title Case Name}/High Contrast/{name}_high_contrast.svg
 *
 * The lookup map is built once by scanning the submodule directory.
 */
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { asset } from '$app/paths';
import { PALETTE } from './palette.js';

const EMOJI_BASE = 'static/fluentui-emoji/assets';

/** Maps snake_case filename (without .svg) to its URL path */
const emojiLookup: Map<string, string> = new Map();

// Build lookup by scanning the submodule directory structure once at startup
if (existsSync(EMOJI_BASE)) {
	for (const folder of readdirSync(EMOJI_BASE, { withFileTypes: true })) {
		if (!folder.isDirectory()) continue;
		const hcDir = join(EMOJI_BASE, folder.name, 'High Contrast');
		if (!existsSync(hcDir)) continue;
		for (const file of readdirSync(hcDir)) {
			if (file.endsWith('.svg')) {
				const name = file.slice(0, -4); // strip .svg
				emojiLookup.set(
					name,
					`/fluentui-emoji/assets/${encodeURIComponent(folder.name)}/High Contrast/${file}`
				);
			}
		}
	}
}

/** Known custom icons in /icons/ that override the default emoji set */
const customIcons = new Set([
	'benguet_pine_high_contrast',
	'bamboo_high_contrast',
	'coffee_plant_high_contrast',
	'currency',
	'faeces_high_contrast',
	'fertiliser_high_contrast',
	'litter_high_contrast',
	'long_grass_high_contrast'
]);

export function resolveIconUrl(iconPath: string, scenarioSlug: string): string {
	if (!iconPath) return '';

	// Strip "Icons/" prefix if present
	const name = iconPath.replace(/^Icons\//, '');

	// If it already has an extension, treat as custom asset in scenario folder
	if (name.includes('.')) {
		return asset(`/scenarios/${scenarioSlug}/${name}`);
	}

	// Check custom icons directory first
	if (customIcons.has(name)) {
		return asset(`/icons/${name}.svg`);
	}

	// Look up in fluentui-emoji submodule
	const emojiUrl = emojiLookup.get(name);
	if (emojiUrl) return asset(emojiUrl);

	// Fallback: try legacy flat emoji directory
	return asset(`/emoji/${name}.svg`);
}

/**
 * Convert entity colour from scenario JSON (RRGGBBAA hex) to CSS color.
 */
export function entityColorToCss(colour: string): string {
	if (!colour || colour.length < 6) return '#888888';
	const r = colour.slice(0, 2);
	const g = colour.slice(2, 4);
	const b = colour.slice(4, 6);
	return `#${r}${g}${b}`;
}

/**
 * Resolve a color value that may be a palette name or a CSS hex color.
 */
export function resolveColor(value: string): string {
	if (value.startsWith('#')) return value;
	return PALETTE[value] ?? value;
}
