import { writable } from 'svelte/store';

export type SidebarContent = {
    imageSrc: string
    title: string
    artist: string
}

export const sidebarContent = writable<SidebarContent | null>(null);