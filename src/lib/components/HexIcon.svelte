<script lang="ts">
	let {
		iconUrl,
		color = 'var(--color-eco-lightest-blue)',
		size = 60,
		iconSize = 32
	}: { iconUrl: string; color?: string; size?: number; iconSize?: number } = $props();
</script>

<div class="relative shrink-0" style="width: {size}px; height: {size * 114 / 128}px;">
	<svg class="block" viewBox="0 0 128 114" width={size} height={size * 114 / 128} xmlns="http://www.w3.org/2000/svg">
		<path d="M126.566 51.7246C128.353 54.8186 128.353 58.6306 126.566 61.7246L99.5897 108.449C97.8034 111.543 94.5022 113.449 90.9295 113.449L36.9765 113.449C33.4038 113.449 30.1026 111.543 28.3162 108.449L1.33975 61.7246C-0.446577 58.6306 -0.446576 54.8186 1.33975 51.7246L28.3163 4.99994C30.1026 1.90593 33.4038 -5.76042e-05 36.9765 -5.7448e-05L90.9295 -5.50897e-05C94.5022 -5.49335e-05 97.8034 1.90593 99.5898 4.99995L126.566 51.7246Z" fill={color} />
	</svg>
	{#if iconUrl}
		<img
			src={iconUrl}
			alt=""
			class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
			style="width: {iconSize}px; height: {iconSize}px;"
		/>
	{/if}
</div>
