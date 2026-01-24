<script lang="ts">
    import { onMount } from "svelte";
    import Markdown from "@magidoc/plugin-svelte-marked";
    import TopBar from "$lib/components/TopBar.svelte";
    import "../../../avara/font.css";
    import "../../../manifont/font.css";
	import Button from "$lib/components/Button.svelte";
    import Footer from "$lib/components/Footer.svelte";
    let props = $props();
    let { lyrics, annotations, user, username } = props.data;
    let mounted: boolean = $state(false);
    let editing: boolean = $state(false);

    let highlightedContent: string = $state("");
    let highlightStartIndex: number | undefined = $state(0);
    let highlightEndIndex: number | undefined = $state(0);

    let activeAnnotation = $state("");

    let source = $state("Hi! Start highlighting to make annotations, or *click* an existing one. P.S: Annotations support ***Markdown!***");

    let rightPanelVisible: boolean = $state(false);

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
                const injectionString = `<span class="annotated-text cursor-pointer" data-ann="${ann.id}" data-start-index="${ann.start_index}" data-end-index="${ann.end_index}">${lyrics.slice(ann.start_index, ann.end_index)}</span>`
                result += injectionString;

                lastIndex = ann.end_index;
            });

            // Add remaining text
            result += lyrics.slice(lastIndex);

            console.log(result);
            return result;
        }

        //lyricBody = renderAnnotatedLyrics(lyrics[0].body.replace(/\r\n/g, '\n'), annotations);

        document.addEventListener("selectionchange", () => {
            const selection = window.getSelection();
            const container = document.getElementById('lyric-container');
            const rightContainer = document.getElementById('annotation-container');
            if (selection && rightContainer && selection.anchorNode && rightContainer.contains(selection.anchorNode)) {
                return;
            }
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
                rightPanelVisible = editing;
            } else {
                highlightedContent = "";
                if (!activeAnnotation && !editing) rightPanelVisible = false;
            }
        });

        const handleGlobalClick = (e: MouseEvent) => handleAnnotationClick(e);
        document.addEventListener('click', handleGlobalClick);
        return () => {
            document.removeEventListener('click', handleGlobalClick);
        }
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
    @reference "tailwindcss";

    :global(html) {
        background-color: #BDBDBD;
        overflow-x: hidden;
    }
    :global(body) {
        margin: 0;
        overflow-x: hidden;
    }

    #lyric-container, #annotation-container {
        scrollbar-width: none;
    }

    :global(.annotated-text) {
        background-color: #023E8A;
        color: #BDBDBD;
        padding: 2px 4px;
        position: relative;
    }
    :global(.annotated-text::after) {
        position: absolute;
        top: -8px;
        right: -8px;
        font-size: 12px;
        background: #023E8A;
        color: #BDBDBD;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>

<TopBar username={username?.data?.[0]?.username ?? user?.email ?? ''} />

<div class="min-h-screen w-full bg-[#BDBDBD] pt-16">
    <div class="mt-4 bg-[#BDBDBD] p-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 justify-center items-start">
            <aside class="hidden lg:flex flex-col items-center space-y-4">
                <div class="relative mt-20">
                    <img 
                        src="/imgs/talkiewalkie.jpg" 
                        alt="Album preview"
                        class="w-64 h-64 object-cover border-2 border-[#023E8A] mt-4"
                    />
                </div>
                <div class="text-right space-y-1 px-0">
                    <h1 class="text-[#023E8A] font-avara-bold-italic text-2xl leading-none">Cherry Blossom Girl</h1>
                    <h1 class="text-[#023E8A] font-manifont-bold text-2xl leading-tight">AIR</h1>
                </div>
            </aside>

            <div id="lyric-container" aria-label="lyrics" role="region" class="text-left border-2 border-[#023E8A] bg-[#BDBDBD] overflow-y-scroll text-xl min-h-[30rem] max-h-[35rem] p-6">
                <pre class="font-manifont-bold text-[#023E8A] text-lg leading-none">{@html lyricBody}</pre>
            </div>

            {#if rightPanelVisible}
                <div id="annotation-container" class=" bg-[#BDBDBD] text-xl p-4 relative flex justify-center">
                    {#if !editing}
                        <div class="w-full max-w-[620px] mt-20">
                            <div class="border-2 border-[#023E8A] p-4 max-h-[10rem]">
                                <div class="text-[#023E8A] font-manifont-book leading-relaxed">
                                    <Markdown {source} />
                                </div>
                            </div>
                            <p class="text-[#023E8A] font-manifont-book italic text-sm mt-2 ml-1">review mode</p>
                        </div>
                    {:else}
                        <form action="?/annotate" method="POST" class="w-full max-w-[500px] mt-30">
                            <label for="annotation-body" class="block text-[#023E8A] font-manifont-bold mb-2">add your annotation:</label>
                            <textarea bind:value={activeAnnotation} name="annotation" placeholder="this section makes me feel..." id="annotation-body" required class="w-full border-2 border-[#023E8A] p-2 font-manifont-book text-[#023E8A] h-40" rows=10 ></textarea>
                            <input type="hidden" bind:value={highlightStartIndex} name="start_index">
                            <input type="hidden" bind:value={highlightEndIndex} name="end_index">
                            <input type="hidden" value={lyrics && lyrics.length > 0 ? lyrics[0].id : 'demo'} name="song_id">
                            <p class="text-[#023E8A] font-manifont-book italic text-sm mt-2 ml-1">edit mode</p>
                            <div class="flex gap-3 justify-end mt-0">
                                <Button text="cancel" callBackFunction={() => { activeAnnotation = ''; rightPanelVisible = false; }} />
                                <Button text="save" callBackFunction={""} />
                            </div>
                        </form>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
    <Footer />
</div>

<!--<p class="fixed bottom-0.5 left-1/2 -translate-x-1/2">Selected: {highlightedContent}</p> -->