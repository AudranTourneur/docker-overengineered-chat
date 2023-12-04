<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.postcss';
	import { getTRPCClient } from '$lib/trpc';
	import { chatMessages, currentUser } from '$lib/stores';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	onMount(async () => {
		console.log('Loading...');
		const client = getTRPCClient();
        $chatMessages = await client.getChatMessages.query();
        const maybeToken = localStorage.getItem('token') || null;
		$currentUser = await client.registerOrLogin.mutate(maybeToken);
        localStorage.setItem('token', $currentUser.token);
	});
</script>

{#if $currentUser}
	<slot />
{:else}
	<ProgressRadial />
{/if}
