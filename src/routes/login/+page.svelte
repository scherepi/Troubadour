<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
    import { enhance } from "$app/forms";
    import "../../avara/font.css";
    import "../../manifont/font.css";

    let { data } = $props();

    let email: string = $state("");
    let password: string = $state("");
    let fadeController: boolean = $state(false)
    $inspect(email).with(console.trace);
    $inspect(password).with(console.trace);
    $inspect(data).with(console.trace);
    onMount(() => {
        fadeController = true;
    })
</script>

<style lang="postcss">
   @reference "tailwindcss";

    :global(html) {
        background-color: #BDBDBD;
        overflow: hidden;
    }
    :global(body) {
        margin: 0;
    }
</style>

<div class="min-h-screen flex bg-[#BDBDBD] relative">
    <a href="/" class="fixed top-4 left-4 text-[#023E8A] font-manifont-book text-4xl hover:opacity-70 transition-opacity z-10">
        &lt;
    </a>
    <div class="w-1/4 flex flex-col justify-center items-center p-8 mr-8 pr-40 relative">
        {#if fadeController}
            <div class="text-left" transition:fade>
                <h1 class="text-6xl text-[#0277B6] font-avara-bold-italic mb-12">login</h1>
                
                <form method="POST" class="flex flex-col items-start space-y-8" use:enhance>
                    <div class="w-full max-w-xs">
                        <input 
                            type="email" 
                            id="email" 
                            bind:value={email} 
                            name="email" 
                            required
                            class="w-full bg-transparent border-none outline-none text-[#023E8A] font-manifont-book text-lg mb-2"
                            placeholder="email"
                        >
                        <div class="h-px bg-[#023E8A] w-full" style="width: 130%;"></div>

                    </div>
                    
                    <div class="w-full max-w-xs">
                        <input 
                            type="password" 
                            id="password" 
                            bind:value={password} 
                            name="password" 
                            required
                            class="w-full bg-transparent border-none outline-none text-[#023E8A] font-manifont-book text-lg mb-2"
                            placeholder="password"
                        >
                        <div class="h-px bg-[#023E8A] w-full" style="width: 130%;"></div>

                    </div>

                    

                    {#if (data as any)?.error}
                        <p class="text-[#023E8A] text-sm font-manifont-book mt-2">{(data as any).error}</p>
                    {/if}


                    <button type="submit" class="text-[#023E8A] font-manifont-book text-xl mt-8">
                        >>>
                    </button>
                </form>
            </div>
        {/if}
    </div>
        <div class="w-px my-5 bg-[#023E8A]"></div>
        <div class="w-3/4 flex items-center justify-start p-8 ">
        {#if fadeController}
            <div class="text-left" transition:fade>
                <h2 class="text-6xl text-[#023E8A] font-avara-bold-italic leading-tight">
                    <span class="block">RANDOMISED</span>
                    <span class="block">LYRICS</span>
                </h2>
            </div>
        {/if}
    </div>
</div>

<footer class="flex w-full fixed bottom-1 text-center justify-center items-center">
    <h6 class="italic font-manifont-book text-[#023E8A]">© joaquin schere, 2025</h6>
</footer>