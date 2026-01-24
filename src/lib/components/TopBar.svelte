<script lang="ts">
    import { enhance } from '$app/forms';
    let { username } = $props();
    import "../../avara/font.css";
    import "../../manifont/font.css";
</script>

<header class="fixed top-0 left-0 right-0 w-full z-10 bg-[#BDBDBD] px-4 py-4 mt-2">
    <div class="flex items-center justify-between relative">
        <button class="text-[#023E8A] text-2xl" onclick={() => {
            window.location.href = '/dashboard';
        }}>
            ←
        </button>
        
        <h1 class="text-3xl md:text-4xl text-[#023E8A] font-avara-bold-italic absolute left-1/2 transform -translate-x-1/2">troubadour</h1>
        
        <div class="flex items-center space-x-2 md:space-x-4">
            <span class="text-[#023E8A] font-manifont-book text-sm md:text-lg">{username}</span>
            <form action="?/signout" method="POST" use:enhance>
                <button 
                    type="submit" 
                    class="bg-[#023E8A] text-[#bdbdbd] font-manifont-book text-sm md:text-lg text-center flex items-center justify-center py-1 md:py-1 leading-none md:leading-none px:2 md:px-2 ml-12 mr-4"
                >
                    logout
                </button>
            </form>
        </div>
    </div>
</header>