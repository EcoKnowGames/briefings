<script lang="ts">
	import { asset } from '$app/paths';

	let {
		title,
		body,
		image,
		slug
	}: { title: string; body: string; image?: string; slug: string } = $props();

	const imageUrl = image ? asset(`/scenarios/${slug}/${image}`) : undefined;
</script>

<div class="flex w-full max-w-[440px] items-center overflow-hidden rounded-panel border-2 border-eco-mid-blue bg-white">
	<div class="flex flex-1 flex-col gap-3 p-4">
		<h3 class="text-[13px] font-bold">{title}</h3>
		<div class="text-[13px] leading-relaxed">
			{#each body.split('\n\n') as paragraph}
				<p class="mb-2 last:mb-0">{paragraph}</p>
			{/each}
		</div>
	</div>
	{#if imageUrl}
		<div class="w-[181px] shrink-0 self-stretch overflow-hidden border-l-2 border-eco-mid-blue">
			<img src={imageUrl} alt={title} class="h-full w-full object-cover" />
		</div>
	{/if}
</div>
