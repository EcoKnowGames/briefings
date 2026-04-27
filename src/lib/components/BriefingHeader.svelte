<script lang="ts">
	let {
		tag,
		title,
		appVersion,
		author,
		authorUrl
	}: {
		tag: string;
		title: string;
		appVersion: string;
		author: string;
		authorUrl?: string;
	} = $props();
</script>

<header class="flex w-full flex-col items-center gap-2 pb-6 pt-16">
	<span
		class="inline-flex items-center justify-center rounded-full bg-black px-2.5 py-1 text-xs font-semibold text-white"
	>
		{tag}
	</span>
	<h1 class="text-center text-lg font-semibold text-black">{title}</h1>
	<span class="text-xs text-gray-400">
		Designed by
		{#if authorUrl}
			<a href={authorUrl} class="text-gray-400 underline transition-opacity hover:opacity-70">{author}</a>
		{:else}
			{author}
		{/if}
		with EcoKnow Creator {appVersion}
	</span>
</header>
