<script lang="ts">
	import { ArrowLeft, UserStar } from '@lucide/svelte';

	let { author, authorUrl, backUrl = '/' }: { author: string; authorUrl?: string; backUrl?: string } = $props();
</script>

<nav class="sticky top-0 z-50 flex items-center justify-between overflow-hidden bg-eco-dark px-4 py-4">
	<a href={backUrl} class="flex items-center gap-1.5 rounded-panel px-2.5 py-1.5 font-[Inter,Albert_Sans,sans-serif] text-[10px] font-bold text-eco-green underline transition-opacity active:opacity-70 hover:opacity-80">
		<ArrowLeft size={16} />
		Scenario Briefings
	</a>
	<div class="flex items-center gap-1.5 rounded-panel px-2.5 py-1.5 font-[Inter,Albert_Sans,sans-serif] text-[10px] text-eco-green">
		Created by
		{#if authorUrl}
			<UserStar size={16} />
			<a href={authorUrl} class="font-bold text-eco-green no-underline transition-opacity active:opacity-70 hover:opacity-80">{author}</a>
		{:else}
			<UserStar size={16} />
			<strong class="font-bold">{author}</strong>
		{/if}
	</div>
</nav>
