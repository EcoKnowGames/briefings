<script lang="ts">
	let { text, fontSize = 13 }: { text: string; fontSize?: number } = $props();

	function parseMarkdown(input: string): string {
		return input
			.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
			.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
	}

	let paragraphs = $derived(text.split('\n\n').filter((p) => p.trim()));
</script>

<div class="w-full max-w-[400px] leading-relaxed" style="font-size: {fontSize}px;">
	{#each paragraphs as paragraph}
		<p class="mb-4 last:mb-0">{@html parseMarkdown(paragraph)}</p>
	{/each}
</div>
