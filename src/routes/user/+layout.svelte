<script>
    import '$lib/interceptors/axios';

    import Title from '$lib/components/title.svelte';
    import { onMount } from 'svelte';
    import Cookies from 'js-cookie';
    import axios from 'axios';
    import { goto } from '$app/navigation';

    onMount(async () => {
        if (Cookies.get('token')) {
            const response = await axios.get('user', { withCredentials: true });

            if (response.status !== 200) {
                Cookies.delete('token');
                await goto('/');
            }

            if (response.data.role === 'admin') {
                await goto('/admin');
            }
        } else {
            await goto('/');
        }
    });

    const navigation = [
        {
            title: 'Domů',
            path: '/user',
        },
        {
            title: 'Platby',
            path: '/user/payments',
        },
        {
            title: 'Kredity',
            path: '/user/credits',
        },
    ];

    let showUserMenu,
        showMobileMenu = false;
</script>

<Title title="Uživatelské rozhraní" />

<div class="min-h-screen">
    <nav class="border-b-2 bg-white">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div class="relative flex h-16 items-center justify-between">
                <div
                    class="absolute inset-y-0 left-0 flex items-center sm:hidden"
                >
                    <!-- Mobile menu button-->
                    <button
                        on:click={() => (showMobileMenu = !showMobileMenu)}
                        type="button"
                        class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 duration-200 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        aria-controls="mobile-menu"
                        aria-expanded="false"
                    >
                        <span class="sr-only">Open main menu</span>
                        {#if !showMobileMenu}
                            <svg
                                class="block h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                ></path>
                            </svg>
                        {:else}
                            <svg
                                class="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        {/if}
                    </button>
                </div>
                <div
                    class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"
                >
                    <div class="flex flex-shrink-0 items-center">
                        <img
                            class="block h-8 w-auto"
                            src="/images/logo/logo-white.png"
                            alt="Logo"
                        />
                    </div>
                    <div class="hidden sm:ml-6 sm:block">
                        <div class="flex space-x-4">
                            {#each navigation as { title, path }}
                                <a
                                    href={path}
                                    class="rounded-md bg-amber-200 px-3 py-2 text-sm font-medium text-black duration-200 hover:bg-amber-300"
                                    aria-current="page"
                                >
                                    {title}
                                </a>
                            {/each}
                        </div>
                    </div>
                </div>
                <div
                    class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
                >
                    <!-- Profile dropdown -->
                    <div class="relative ml-3">
                        <a
                            href="/auth/logout"
                            class="rounded-md bg-amber-200 px-3 py-2 text-sm font-medium text-black duration-200 hover:bg-amber-300"
                        >
                            Odhlásit se
                        </a>
                    </div>
                </div>
            </div>
        </div>

        {#if showMobileMenu}
            <div class="sm:hidden" id="mobile-menu">
                <div class="space-y-1 px-2 pt-2 pb-3">
                    {#each navigation as { title, path }}
                        <a
                            href={path}
                            class="block rounded-md px-3 py-2 text-base font-medium text-black duration-200 hover:bg-amber-300"
                            aria-current="page"
                        >
                            {title}
                        </a>
                    {/each}
                </div>
            </div>
        {/if}
    </nav>

    <div>
        <slot />
    </div>

    <footer class="sticky top-[100vh] border-t text-center lg:text-left">
        <div class="p-4 text-center">
            Vytvořil
            <a
                class="font-bold hover:underline"
                href="https://thevelda.eu/"
                target="_blank"
            >
                Velda
            </a>
        </div>
    </footer>
</div>
