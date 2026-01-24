
<script lang="ts">
    import "../../avara/font.css";
    import "../../manifont/font.css";

    let { title, artist, album_url = "/missing_album_src", album_name="Unknown album", id} : {title: string, artist: string, album_url?: string, album_name?: string, id: string} = $props();
    let maxLength = 30;
    if (title.length > maxLength) { title = title.substring(0, title.indexOf(" ", maxLength)) + "..."}

</script>


<a href="/lyrics/{id}">
    <div id="main" class="w-50 p-1 m-8">
        <img src={album_url} alt="The album cover for {album_name}" class="w-full h-40 object-cover mb-2">        
        <div class="block">
            <h4 id="title" class=" text-lg text-[#023E8A] font-manifont-bold font-semibold underline-offset-5 underline">{title}</h4>
            <p id="artist" class=" text-md text-[#023E8A] font-manifont-book">{artist}</p>
        </div>
    </div>
</a>