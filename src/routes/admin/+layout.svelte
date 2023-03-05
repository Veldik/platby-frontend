<script>
    import '$lib/interceptors/axios'
    import {clickOutside} from "$lib/click-outside.js";

    import Title from "$lib/components/title.svelte"
    import {IconUser, IconMoon, IconSun} from "@tabler/icons-svelte";
    import {onMount} from "svelte";
    import Cookies from "js-cookie";
    import axios from "axios";
    import {goto} from "$app/navigation";
    import {DarkMode} from "flowbite-svelte";

    onMount(async () => {
        if (Cookies.get('token')) {
            const response = await axios.get('user', {withCredentials: true})

            if (response.status !== 200) {
                Cookies.delete('token')
                await goto('/')
            }
        } else {
            await goto('/');
        }
    })

    const navigation = [
        {
            "title": "Domů",
            "path": "/admin"
        },
        {
            "title": "Platby",
            "path": "/admin/payments"
        },
        {
            "title": "Platiči",
            "path": "/admin/payers"
        },
    ]

    let showUserMenu, showMobileMenu = false;

</script>

<Title title="Administrace"/>

<div data-theme="emerald" class="min-h-screen">
    <nav class="bg-emerald-800">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div class="relative flex h-16 items-center justify-between">
                <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    <!-- Mobile menu button-->
                    <button on:click="{() => showMobileMenu = !showMobileMenu}" type="button"
                            class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-emerald-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            aria-controls="mobile-menu" aria-expanded="false">
                        <span class="sr-only">Open main menu</span>
                        {#if !showMobileMenu}
                            <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor"
                                 aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                            </svg>
                        {:else }
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor"
                                 aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        {/if}
                    </button>
                </div>
                <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div class="flex flex-shrink-0 items-center">
                        <img class="block h-8 w-auto"
                             src="/images/logo/logo@2x.png" alt="Your Company">
                    </div>
                    <div class="hidden sm:ml-6 sm:block">
                        <div class="flex space-x-4">

                            {#each navigation as {title, path}}
                                <a href="{path}"
                                   class="text-gray-300 bg-emerald-900 hover:bg-emerald-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                   aria-current="page">{title}</a>
                            {/each}
                        </div>
                    </div>
                </div>
                <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                    <!-- Profile dropdown -->
                    <div class="relative ml-3">

                        <div class="flex flex-wrap items-center gap-2">
                            <button on:click={() => (showUserMenu = true)} type="button"
                                    class="flex rounded-full bg-emerald-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                    id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                <span class="sr-only">Open user menu</span>
                                <IconUser
                                        class="rounded-full bg-emerald-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"/>
                                <!--<img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
                                -->
                            </button>
                            <DarkMode btnClass="flex rounded-full bg-emerald-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                            >
                                <svelte:fragment slot="lightIcon">
                                    <IconSun class="rounded-full bg-emerald-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"/>
                                </svelte:fragment>
                                <svelte:fragment slot="darkIcon">
                                    <IconMoon class="rounded-full bg-emerald-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"/>
                                </svelte:fragment>
                            </DarkMode>
                        </div>
                        {#if showUserMenu}
                            <div use:clickOutside on:outclick={() => (showUserMenu = false)}
                                 class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                 role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button"
                                 tabindex="-1">
                                <a href="/logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                   role="menuitem" tabindex="-1" id="user-menu-item-2">Odhlásit se</a>
                            </div>
                        {/if}

                    </div>
                </div>
            </div>
        </div>

        {#if showMobileMenu}
            <div class="sm:hidden" id="mobile-menu">
                <div class="space-y-1 px-2 pt-2 pb-3">
                    {#each navigation as {title, path}}
                        <a href="{path}"
                           class="text-gray-300 hover:bg-emerald-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                           aria-current="page">{title}</a>
                    {/each}
                </div>
            </div>
        {/if}
    </nav>

    <div>

        <slot/>

    </div>

    <footer
            class="bg-neutral-200 sticky top-[100vh] text-center dark:bg-neutral-700 lg:text-left">
        <div class="p-4 text-center text-neutral-700 dark:text-neutral-200">
            Veldovy platby, vytvořil
            <a
                    class="text-neutral-800 dark:text-neutral-400"
                    href="https://thevelda.eu/"
                    target="_blank"
            >Velda</a
            >
        </div>
    </footer>
</div>

<style>
    .backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.50)
    }
</style>
