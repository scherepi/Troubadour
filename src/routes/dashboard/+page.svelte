<script lang="ts">
	import { onMount } from "svelte";
    import AlbumTile from "$lib/components/AlbumTile.svelte";
    import TopBar from "$lib/components/TopBar.svelte";
    import "../../avara/font.css";
    import "../../manifont/font.css";
    
    let data = $props();
    let username = $derived(data.data.username.data[0].username);
    let userEmail = $derived(data.data.user?.email);
    let songs = $derived(data.data.songs ?? []);
    let searchQuery: string = $state("");
    let filteredSongs = $derived(
        searchQuery.trim()
            ? songs.filter((s: any) => {
                const q = searchQuery.toLowerCase();
                return (
                    (s.title && s.title.toLowerCase().includes(q)) ||
                    (s.artist && s.artist.toLowerCase().includes(q)) ||
                    (s.album_name && s.album_name.toLowerCase().includes(q))
                );
            })
            : songs
    );

    $effect(() => {
        if (userEmail) {
            console.log("User loaded: ", userEmail);
        }
    })
    // on mount, fetch data from hook database request
    onMount(() => {
        console.log("Mounted");
        console.log(userEmail);
    })
    $inspect(data);
    $inspect(username);
</script>

<style lang="postcss">
   @reference "tailwindcss";

    :global(html) {
        background-color: #BDBDBD;
        overflow-x: hidden;
    }
    :global(body) {
        margin: 0;
        overflow-x: hidden;
    }
</style>

<TopBar username={username}/>

<div class="min-h-screen w-full bg-[#BDBDBD] pt-12">
    <div class="mt-8 bg-[#BDBDBD] border-t-2 border-x-2 border-b-2 border-[#023E8A] min-h-[calc(100vh-120px)] p-4">
        <div class="w-full flex items-center justify-center mb-6">
            <input 
                type="text" 
                class="text-[#0277B6] underline font-manifont-book text-2xl flex items-center gap-3 outline-none " 
                placeholder="search by song or artist"
                bind:value={searchQuery}
            />
            <span class="border-2 border-[#0277B6] text-[#0277B6] leading-none px-0.5 text-2xl ml-2">↗</span>
        </div>

        {#if searchQuery.trim().length > 0}
            <div class="flex flex-col items-center">
                {#if filteredSongs.length > 0}
                    <div class="space-y-8">
                        {#each filteredSongs as song}
                            <a href="/lyrics/{song.id}" class="flex items-center gap-6">
                                <img src={song.album_url || "/missing_album_src.png"} alt="The album cover for {song.album_name}" class="w-28 h-28 object-cover border border-[#023E8A]">
                                <div class="flex flex-col">
                                    <h3 class="text-[#023E8A] font-manifont-bold italic underline-offset-3 underline text-xl">{song.title}</h3>
                                    <p class="text-[#023E8A] font-manifont-book italic">{song.artist}</p>
                                </div>
                            </a>
                        {/each}
                    </div>
                {:else}
                    <p class="text-[#023E8A] font-manifont-book">No results</p>
                {/if}
            </div>
        {:else}
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {#each songs as song}
                    <AlbumTile 
                        title={song.title}
                        artist={song.artist}
                        album_url={song.album_url}
                        album_name={song.album_name}
                        id={song.id}
                    />
                {/each}
            </div>
        {/if}
    </div>
</div>

<footer class="flex w-full fixed bottom-1 text-center justify-center items-center">
    <h6 class="italic font-manifont-book text-[#023E8A]">© joaquin schere, 2025</h6>
</footer>