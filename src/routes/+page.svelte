<script lang="ts">
	import { onMount } from "svelte";
    import "../avara/font.css";
    import "../manifont/font.css";

    console.log("Troubadour v1.0.0, started up");
    let fadeController: boolean = $state(false);
    onMount(() => {
        fadeController = true;
    })
</script>

<style lang="postcss">
    @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,200..900;1,200..900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:ital,wght@0,400..900;1,400..900&display=swap');
    @reference "tailwindcss";

    :global(html) {
        background-color: #BDBDBD;
    }
</style>

<div class="min-h-screen flex flex-col items-center justify-center bg-[#BDBDBD]">
    <h1 class="text-8xl text-[#023E8A] font-avara-bold-italic mb-4">troubadour</h1>
    {#if fadeController}
        <h4 class="text-2xl text-[#0277B6] font-avara-bold mb-8">
            your music, annotated your way.
        </h4>
    {/if}
    
    <div class="flex space-x-8">
        <a href="/login" class="text-[#0277B6] font-manifont-book text-xl underline hover:text-[#023E8A] transition-colors">login</a>
        <a href="/signup" class="text-[#0277B6] font-manifont-book text-xl underline hover:text-[#023E8A] transition-colors">signup</a>
    </div>
</div>