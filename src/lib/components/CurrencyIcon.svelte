<script lang="ts">
	import { asset } from '$app/paths';

	let { size = 30 }: { size?: number } = $props();
</script>

<img src={asset('/icons/currency.svg')} alt="Currency" width={size} height={size} />
