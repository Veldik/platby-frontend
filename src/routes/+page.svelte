<script>
    import Title from '$lib/components/title.svelte';

    import axios from 'axios';
    import Cookies from 'js-cookie';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let email = '',
        password = '',
        errorMessage = '';

    onMount(async () => {
        if (Cookies.get('token')) {
            const response = await axios.get('user', { withCredentials: true });

            if (response.status === 200) {
                console.log(response.data);
                if (response.data.role === 'admin') {
                    goto('/admin');
                } else if (response.data.role === 'user') {
                    goto('/user');
                }
            }
        }
    });

    $: submit = async () => {
        axios
            .post(
                `login`,
                {
                    email,
                    password,
                },
                { withCredentials: true }
            )
            .then((response) => {
                if (response.status === 200) {
                    Cookies.set('token', response.data.token);

                    axios.defaults.headers.common['Authorization'] =
                        `Bearer ${response.data.token}`;

                    if (response.data.user.role === 'admin') {
                        goto('/admin');
                    } else if (response.data.user.role === 'user') {
                        goto('/user');
                    }
                } else {
                    errorMessage = 'Přihlášení se nezdařilo.';
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
</script>

<Title title="Domů" />

<main
    class="flex min-h-screen flex-col items-center justify-between p-8 md:p-16 lg:p-32"
>
    <div class="flex flex-col items-center justify-center">
        <div class="container">
            <img
                class="mx-auto h-24 w-auto"
                src="/images/logo/logo-white.png"
                alt="Veldovo platby"
            />
        </div>
    </div>
    <div class="w-full sm:w-96">
        <form on:submit|preventDefault={submit} class="flex flex-col">
            <div class="flex flex-col pb-2">
                <label for="email" class="text-dark font-bold">E-mail</label>
                <input
                    bind:value={email}
                    type="email"
                    name="email"
                    id="email"
                    class="input rounded focus:border-green-400 focus:ring-green-400"
                    placeholder="E-mail"
                    required
                    autocomplete="username"
                />
            </div>
            <div class="flex flex-col">
                <label for="password" class="text-dark font-bold">Heslo</label>
                <input
                    bind:value={password}
                    type="password"
                    name="password"
                    id="password"
                    class="input rounded focus:border-green-400 focus:ring-green-400"
                    placeholder="Heslo"
                    required
                    autocomplete="current-password"
                />
            </div>
            <div class="pb-2 text-sm text-gray-500 hover:underline">
                <a href="/auth/forgot-password">
                    registrovat se / obnovit heslo
                </a>
            </div>

            {#if errorMessage}
                <div class="pb-2 text-sm text-red-500">
                    {errorMessage}
                </div>
            {/if}

            <div class="flex flex-col items-center justify-center">
                <button
                    type="submit"
                    class="transform rounded bg-black px-3 py-2 text-white duration-200 hover:bg-gray-900"
                    >Přihlásit se
                </button>
            </div>
        </form>
    </div>
    <div class="flex flex-col items-center justify-center">
        <p>
            Vytvořil <a
                href="https://thevelda.eu"
                target="_blank"
                class="text-dark font-bold hover:underline">Velda</a
            >
        </p>
        <p class="text-center">
            Projekt je open-source dostupný na <a
                href="https://github.com/veldik/platby"
                target="_blank"
                class="hover:underline">Githubu</a
            >.
        </p>
    </div>
</main>
