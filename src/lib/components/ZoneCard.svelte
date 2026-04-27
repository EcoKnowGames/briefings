<script lang="ts">
	let { name, color }: { name: string; color: string } = $props();
</script>

<div
	class="flex h-[120px] flex-1 items-center justify-center rounded-panel border-2 border-black/10 p-2.5"
	style="background: {color};"
>
	<span class="text-xs">{name}</span>
</div>
