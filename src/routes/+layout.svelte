<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import "../app.css";
	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'

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
</script>

<svelte:head>
	<title>Troubadour</title>
</svelte:head>

<div class="container" style="padding: 50px 0 100px 0">
	<slot />
</div>