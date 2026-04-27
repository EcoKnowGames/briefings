<script lang="ts">
	let { title, description, url }: { title: string; description: string; url: string } = $props();
</script>

<a
	href={url}
	target="_blank"
	rel="noopener noreferrer"
	class="flex w-full items-center justify-between gap-4 rounded-panel border-2 border-eco-mid-blue bg-eco-lightest-blue p-4 text-black no-underline transition-all active:scale-[0.98] hover:bg-eco-light-blue/30"
>
	<div class="flex-1 text-[13px] leading-relaxed">
		<strong class="font-bold">{title}</strong> - {description}
	</div>
	<svg class="shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-eco-blue)" stroke-width="2">
		<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
	</svg>
</a>
