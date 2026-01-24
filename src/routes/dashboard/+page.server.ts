import { fail, redirect } from "@sveltejs/kit"

import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
    // Get the supabase client from the server hook
    const {session, user} = await safeGetSession();

    if (!session || !user) {
        throw redirect(303, "/login");
    }

    const { data, error } = await supabase
    .from('lyrics')
    .select('*')
    .eq('user_id', user.id);

    const username = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id);

    //console.log(username, ' is logged in');

    if (error) throw error;

    const songs: Array<{ id: string; title: string; artist: string; album_url: string; album_name: string }> = [
        { 
            id: "1", 
            title: "ZUSHI", 
            artist: "Dean Blunt",
            album_url: "/imgs/zushi.jpeg",
            album_name: "ZUSHI"
        },
        { 
            id: "2", 
            title: "Demons Sing Love Songs", 
            artist: "Unwound",
            album_url: "/imgs/unwound.webp",
            album_name: ""
        },
        { 
            id: "3", 
            title: "White Ferrari", 
            artist: "Frank Ocean",
            album_url: "/imgs/blonde.jpg",
            album_name: "Blonde"
        }
    ];

    return { lyrics: data, user, username, songs };
}

export const actions: Actions = {
    signout: async ({request, locals: { supabase }}) => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error(error);
            return fail(401, {error: error.message});
        }
        throw redirect(303, "/login");
    }
} satisfies Actions;