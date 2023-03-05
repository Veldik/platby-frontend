<script>
    import Title from '$lib/components/title.svelte';
    import Error from '$lib/components/error.svelte'

    import {goto} from '$app/navigation';
    import {IconLock} from "@tabler/icons-svelte";

    import axios from 'axios';
    import Cookies from "js-cookie";
    import {onMount} from "svelte";

    let email = '', password = '', errorMessage = '';

    onMount(async () => {
        if (Cookies.get('token')) {
            const response = await axios.get('user', {withCredentials: true})

            if (response.status === 200) {
                goto('/admin')
            }
        }
    })

    $: submit = async () => {
        axios.post(`login`, {
            email, password
        }, {withCredentials: true}).then(response => {
                if (response.status === 200) {
                    Cookies.set('token', response.data.token)

                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

                    goto('/admin')
                } else {
                    console.log()
                    errorMessage = 'Nastala nečekaná chyba. Kontaktuj Veldu'
                }
            }
        ).catch(error => {
            console.log(error)
        })
    }
</script>
<Title title="Přihlášení"/>

<div class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
        <div>
            <img class="mx-auto h-24 w-auto" src='/images/logo/logo@2x.png' alt="Veldovo platby">
            <h2 class="mt-6 text-center text-xl font-bold tracking-tight text-gray-900">Přihlášení do systému Veldovo
                platby</h2>
        </div>
        <form on:submit|preventDefault={submit} class="mt-8 space-y-6">
            <input type="hidden" name="remember" value="true">
            <div class="-space-y-px rounded-md shadow-sm">
                <div>
                    <label for="email-address" class="sr-only">Mailová adresa</label>
                    <input bind:value={email} id="email-address" name="email" type="email" autocomplete="email" required
                           class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                           placeholder="jmeno@domena.cz">
                </div>
                <div>
                    <label for="password" class="sr-only">Heslo</label>
                    <input bind:value={password} id="password" name="password" type="password"
                           autocomplete="current-password" required
                           class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                           placeholder="TajnéHeslo">
                </div>
            </div>
            {#if errorMessage}
                <Error message={errorMessage}></Error>
            {/if}

            <div>
                <button type="submit"
                        class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <IconLock class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true"/>

          </span>
                    Přihlásit se
                </button>
            </div>
        </form>
    </div>
</div>
