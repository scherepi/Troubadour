<script lang="ts">
    import { fade, fly, blur } from "svelte/transition";
    import { enhance } from "$app/forms";
    import { onMount } from "svelte";
    import Markdown from "@magidoc/plugin-svelte-marked";

    let props = $props();
    let { lyrics, annotations, user, username } = props.data;
    let mounted: boolean = $state(false);
    let editing: boolean = $state(false);

    let lyricBody: string = $state(lyrics[0].body.replace(/\r\n/g, '\n'));

    let highlightedContent: string = $state("");
    let highlightStartIndex: number | undefined = $state(0);
    let highlightEndIndex: number | undefined = $state(0);

    let activeAnnotation = $state("");

    let source = $state("Hi! Start highlighting to make annotations, or *click* an existing one. P.S: Annotations support ***Markdown!***");

    type Annotation = {id: number, song_id: string, body: string, start_index: number, end_index: number, user_id: string}

    function getSelectionIndices(container: HTMLElement): [number, number] {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return [0, 0];
        const range = selection.getRangeAt(0);

        let preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(container);

        // Set end to anchor
        preCaretRange.setEnd(range.startContainer, range.startOffset);
        const start = preCaretRange.toString().length;

        // Set end to focus
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        const end = preCaretRange.toString().length;

        return [Math.min(start, end), Math.max(start, end)];
    }

    onMount(() => {
        // Place all the annotations where they need to be.
        
        function renderAnnotatedLyrics(lyrics: string, annotations: Annotation[]) {
            let result = "";
            let lastIndex = 0;

            // Sort annotations by start_index
            const sorted = [...annotations].sort((a, b) => a.start_index - b.start_index);


            sorted.forEach((ann) => {
                // Add text before annotation
                result += lyrics.slice(lastIndex, ann.start_index);

                // Add annotated span
                const injectionString = `<span class="bg-blue-100 cursor-pointer" data-ann="${ann.id}" data-start-index="${ann.start_index}" data-end-index="${ann.end_index}">${lyrics.slice(ann.start_index, ann.end_index)}</span>`
                result += injectionString;

                lastIndex = ann.end_index;
            });

            // Add remaining text
            result += lyrics.slice(lastIndex);

            console.log(result);
            return result;
        }

        lyricBody = renderAnnotatedLyrics(lyrics[0].body.replace(/\r\n/g, '\n'), annotations);

        document.addEventListener("selectionchange", () => {
            const selection = window.getSelection();
            const container = document.getElementById('lyric-container');
            if (
                selection &&
                selection.anchorNode &&
                selection.focusNode &&
                container &&
                container.contains(selection.anchorNode) &&
                container.contains(selection.focusNode)
            ) {
                highlightedContent = selection.toString() ?? "";
                const [start, end] = getSelectionIndices(container);
                highlightStartIndex = start;
                highlightEndIndex = end;
                editing = highlightedContent.length > 0;
            } else {
                highlightedContent = "";
            }
        });
        mounted = true;
    })

    function handleAnnotationClick(event: MouseEvent) {
        const target = event?.target as HTMLElement;
        if (target.tagName === "SPAN" && target.dataset.ann) {
            source = annotations.find( ( a: Annotation ) => a.id == Number(target.dataset.ann)).body ?? "";
        }
    }
    $inspect(lyrics, annotations, user, username);
</script>

<style lang="postcss">
    #lyric-container, #annotation-container {
        scrollbar-width: none;
    }
</style>

<header class="fixed top-2 left-0 w-full z-10">
    {#if mounted}<a href="/dashboard"><h4 id="return" class="text-xl fixed left-1/10 top-5.5 italic text-cyan-950" transition:blur={{duration: 5000}}>back to dashboard</h4></a>{/if}
    <h3 id="title" class="text-3xl self-center text-gray-600 text-shadow-cyan-900/50 font-bold text-center mt-2 font-[Crimson_Pro]" transition:blur>Troubadour</h3>
    <h4 id="username" class="text-2xl fixed right-1/7 top-5.5 text-cyan-950 font-[Schibsted_Grotesk] font-extrabold italic text-shadow-white text-shadow-lg/70 text-shadow">{username.data[0].username}</h4>
    <form action="?/signout" method="POST" use:enhance>
        <input id="signout" type="submit" class="fixed text-xl right-5 top-3 text-cyan-800 border-2 border-rose-700 rounded-2xl p-3 italic font-medium bg-white" value="Sign-out">
    </form>
</header>

<div id="lyric-container" role="generic" class="fixed left-2 w-11/24 h-120 border-black border-2 rounded-xl top-20 bg-white overflow-y-scroll text-xl" onclick={() => {
    // if mouse-click without selection, switch to review mode
    if (window.getSelection()?.toString().length == 0) { editing = false; }
}}>
    <pre class="font-[Crimson_Pro] mt-3 text-lg/10 text-center" onclick={handleAnnotationClick}>{@html lyricBody}</pre> <!-- WARNING: This has the potential for XSS attacks. This needs to be addressed. But right now, I can't think of a way this can be exploited against another person - you can only access your own annotations, because of RLS.-->
</div>

<div id="annotation-container" class="fixed right-2 w-11/24 h-120 border-black/70 border-2 top-20 bg-amber-50 overflow-y-scroll text-2xl">
    {#if !editing}
    <Markdown {source} />
    {:else}
    <form action="?/annotate" method="POST">
    <textarea bind:value={activeAnnotation} name="annotation" placeholder="I really like how Michael Gira..." id="annotation-body" required class="w-full" rows=13 ></textarea>
    <input type="hidden" bind:value={highlightStartIndex} name="start_index">
    <input type="hidden" bind:value={highlightEndIndex} name="end_index">
    <input type="hidden" value={lyrics[0].id} name="song_id">
    <input type="submit" class="bg-green-300 border-2 border-green-400 inline-block rounded-full w-20 font-[Schibsted_Grotesk] absolute bottom-10 left-1/2 -translate-x-1/2 italic font-light" value="Save">
    </form>
    {/if}
    <h4 class="absolute left-1/2 {editing ? "text-amber-500" : "text-blue-500"} -translate-x-1/2 bottom-0 font-light font-[Crimson_Pro]">{editing ? 'Edit Mode' : 'Review Mode'}</h4>
</div>

<!--<p class="fixed bottom-0.5 left-1/2 -translate-x-1/2">Selected: {highlightedContent}</p> -->