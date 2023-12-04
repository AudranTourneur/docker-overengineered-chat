<script lang="ts">
	import { onMount } from 'svelte';
	import Chat from './Chat.svelte';
	import { getTRPCClient } from '$lib/trpc';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	let chatData: string | null = null;

	onMount(async () => {
		const client = getTRPCClient();

        console.log('Loading...')

		chatData = await client.getChatMessages.query();
        //chatData = await (await fetch('/api/get-chat-messages')).text()

        console.log('Loaded!', chatData)
	});
</script>

<div class="flex flex-col w-full h-full mx-auto items-center m-4">
	<div class="space-y-2 text-center mb-2 sm:mb-4 md:mb-8">
		<h1
			class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-purple-400"
		>
			The Overengineered Chat
		</h1>
	</div>

	{#if chatData}
		<Chat />
	{:else}
		<ProgressRadial />
	{/if}
</div>
