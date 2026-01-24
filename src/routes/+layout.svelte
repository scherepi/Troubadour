<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import "../app.css";
	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { fade } from 'svelte/transition'
	import { sidebarContent } from '$lib/stores/layout'

	export let data

	let { supabase, session } = data
	$: ({ supabase, session } = data)

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})

		return () => data.subscription.unsubscribe()
	})

	$: inAnnotate = $page.url.pathname.startsWith('/lyrics/') || $page.url.pathname === '/create' || $page.url.pathname === '/dashboard' || $page.url.pathname === '/'
</script>

<style lang="postcss">
	@reference "tailwindcss";

	:global(html) {
		background-color: #BDBDBD;
		overflow-x: clip;
	}
	:global(body) {
		margin: 0;
		overflow-x: clip;
	}
	:global(*) {
		box-sizing: border-box;
	}
</style>

<svelte:head>
	<title>Troubadour</title>
</svelte:head>

<div class="w-full max-w-screen overflow-x-hidden px-4 sm:px-6">
	<div class="flex items-start" class:gap-6={!inAnnotate} class:gap-0={inAnnotate}>
		{#if !inAnnotate}
		<aside
			class="transition-all duration-500 ease-in-out overflow-hidden w-[320px]"
			aria-hidden={inAnnotate}
		>
			{#if $sidebarContent}
				<div class="flex flex-col items-center space-y-4">
					<div class="relative">
						<img 
							src={$sidebarContent.imageSrc}
							alt="Album preview"
							class="w-64 h-64 object-cover border-2 border-[#023E8A] mt-16"
						/>
					</div>
					<div class="text-right space-y-1 px-0">
						<h1 class="text-[#023E8A] font-avara-bold-italic text-2xl leading-none">{$sidebarContent.title}</h1>
						<h1 class="text-[#023E8A] font-manifont-bold text-2xl leading-tight">{$sidebarContent.artist}</h1>
					</div>
				</div>
			{/if}
		</aside>
		{/if}

		<main class="transition-all duration-500 ease-in-out flex-1 min-w-0">
			{#key $page.url.pathname}
				<div in:fade={{ duration: 200 }} out:fade={{ duration: 150 }}>
					<slot />
				</div>
			{/key}
		</main>
	</div>
</div>