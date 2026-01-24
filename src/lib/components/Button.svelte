<script lang="ts">
    let {text, callBackFunction, color = "#023E8A"}: {text: string, callBackFunction?: any, color?: string} = $props();
</script>

<button type="button" class="bg-[{color}] text-[#bdbdbd] font-manifont-book text-sm md:text-lg text-center flex items-center justify-center py-1 md:py-1 leading-none md:leading-none px-2 md:px-2" onclick={callBackFunction}>
    {text}
</button>