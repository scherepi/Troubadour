<script lang="ts">
	import { onMount } from "svelte";
    import { fade } from "svelte/transition";

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

    @theme {
        --font-script: 'Schibsted Grotesk', serif;
        --font-serif: 'Crimson Pro', serif;
        --text-shadow-cyan-900: 0  35px 10px rgba(0, 255, 255, 0.5);
    }

    :global(html) {
        background-color: #cfcece;
        font-family: 'Crimson Pro', serif;
    }
    a {
        font-family: 'Times New Roman', serif;
    }
</style>
<h1 class="text-8xl font-bold text-gray-600 text-center -inset-y-3 mt-50 text-shadow-cyan-900/50 ">Troubadour</h1>
{#if fadeController}<h4 id="subtitle" class="text-2xl font-medium text-gray-500 text-center mt-2" transition:fade={{duration: 3000}}>Your music, annotated your way.</h4> {/if}
<div class="text-center bg-gray-800 p-4 shadow-lg rounded-2xl w-35 mt-6 ml-146 hover:bg-gray-700">
    <a href="/login" class="text-center text-gray-200 font-[Schibsted Grotesk] italic font-light p-4 m-4">Enter</a>
</div>