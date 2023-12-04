<script lang="ts">
	//import { getTRPCClient } from '$lib/trpc';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import { faPaperPlane, faPlus } from '@fortawesome/free-solid-svg-icons';
	import { currentUser, chatMessages } from '$lib/stores';
	import { getTRPCClient} from '$lib/trpc';

	let elemChat: HTMLElement;

    //const serverMessages = client.getChatMessages.query()

    onMount(async () => {
        // We should use a WebSocket in a real app
        setInterval(async () => {
            $chatMessages = await getTRPCClient().getChatMessages.query()
        }, 2000)
    })

	let currentMessage = '';

	// For some reason, eslint thinks ScrollBehavior is undefined...
	// eslint-disable-next-line no-undef
	function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	async function addMessage(): Promise<void> {
        await getTRPCClient().sendChatMessage.mutate({
            token: $currentUser?.token || '',
            messageContent: currentMessage
        })

		$chatMessages = await getTRPCClient().getChatMessages.query()
       
		// Clear prompt
		currentMessage = '';
		// Smooth scroll to bottom
		// Timeout prevents race condition
		setTimeout(() => {
			scrollChatBottom('smooth');
		}, 100);
	}

	function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			addMessage();
		}
	}

	// When DOM mounted, scroll to bottom
	onMount(() => {
		scrollChatBottom();
	});
</script>

<section class="card w-full max-w-[800px]">
	<!-- Chat -->
	<div class="grid grid-row-[1fr_auto]">
		<!-- Conversation -->
		<section bind:this={elemChat} class="max-h-[500px] p-4 overflow-y-auto space-y-4">
			{#each $chatMessages as bubble}
				{#if bubble.username === $currentUser?.username}
					<div class="grid grid-cols-[auto_1fr] gap-2">
						<Avatar src="/avatar-default-icon.png" width="w-12" />
						<div class="card p-4 variant-soft rounded-tl-none space-y-2">
							<header class="flex justify-between items-center">
								<p class="font-bold">{bubble.username}</p>
								<small class="opacity-50">{bubble.createdAt?.toISOString()}</small>
							</header>
							<p>{bubble.messageContent}</p>
						</div>
					</div>
				{:else}
					<div class="grid grid-cols-[1fr_auto] gap-2">
						<div class="card p-4 rounded-tr-none space-y-2 variant-soft-primary">
							<header class="flex justify-between items-center">
								<p class="font-bold">{bubble.username}</p>
								<small class="opacity-50">{bubble.createdAt?.toISOString().split('.')[0]}</small>
							</header>
							<p>{bubble.messageContent}</p>
						</div>
						<Avatar src="/avatar-default-icon.png" width="w-12" />
					</div>
				{/if}
			{/each}
		</section>
		<!-- Prompt -->
		<section class="border-t border-surface-500/30 p-4 h-max-[100px]">
			<div
				class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token"
			>
				<button class="input-group-shim">
					<Fa icon={faPlus} />
				</button>
				<textarea
					bind:value={currentMessage}
					class="bg-transparent border-0 ring-0 p-1"
					name="prompt"
					id="prompt"
					placeholder="Write a message..."
					rows="1"
					on:keydown={onPromptKeydown}
				/>
				<button
					class={currentMessage ? 'variant-filled-primary' : 'input-group-shim'}
					on:click={addMessage}
				>
					<i class="fa-solid fa-paper-plane" />
					<Fa icon={faPaperPlane} />
				</button>
			</div>
		</section>
	</div>
</section>
