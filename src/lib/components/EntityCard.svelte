<script lang="ts">
	import HexIcon from './HexIcon.svelte';
	import type { EntityDisplay } from '$lib/types.js';

	let { entity }: { entity: EntityDisplay } = $props();

	function parseMarkdown(text: string): string {
		return text
			.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
			.replace(/\*(.+?)\*/g, '<em>$1</em>');
	}
</script>

<div class="flex w-[calc(25%-12px)] min-w-[80px] flex-col items-center gap-2.5">
	<HexIcon iconUrl={entity.iconUrl} color={entity.color} />
	<h4 class="text-xs font-semibold">{entity.name}</h4>
	{#if entity.description}
		<p class="self-start text-[10px] leading-relaxed">{@html parseMarkdown(entity.description)}</p>
	{/if}
</div>
