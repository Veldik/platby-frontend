<script>
    import Title from '$lib/components/title.svelte';
    import { goto } from '$app/navigation';
    import Cookies from "js-cookie";
    import {onMount} from "svelte";

    onMount(async () => {
        Cookies.remove('token')
        await goto('/')
    })
</script>

<Title title="Odhlášení"/>

<style lang="postcss">
    :global(html) {
        background-color: theme(colors.gray.100);
    }
</style>
