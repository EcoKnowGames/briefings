<script lang="ts">
	import HexIcon from './HexIcon.svelte';
	import CurrencyIcon from './CurrencyIcon.svelte';
	import type { ObjectiveDisplay } from '$lib/types.js';

	let { objective }: { objective: ObjectiveDisplay } = $props();

	const isCurrency = objective.iconUrl.includes('currency');
</script>

<div class="flex w-full items-center gap-4 rounded-panel border-2 border-eco-light-blue p-4">
	<div class="shrink-0">
		{#if isCurrency}
			<div class="flex size-[60px] items-center justify-center rounded-panel bg-eco-lightest-blue">
				<CurrencyIcon />
			</div>
		{:else if objective.iconUrl}
			<HexIcon iconUrl={objective.iconUrl} color={objective.iconBgColor ?? 'var(--color-eco-lightest-blue)'} />
		{:else}
			<div class="flex size-[60px] items-center justify-center rounded-panel bg-eco-lightest-blue"></div>
		{/if}
	</div>
	<div class="flex min-w-0 flex-1 flex-col gap-2">
		<h4 class="text-xs font-bold">{objective.title}</h4>
		<p class="text-[10px] leading-relaxed">{objective.description}</p>
		<p class="text-[10px] font-bold text-eco-mid-blue">{objective.goal}</p>
	</div>
</div>
