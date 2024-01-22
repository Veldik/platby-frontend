<script>
    import '$lib/app.css';
    import '$lib/interceptors/axios';
    import Title from '$lib/components/title.svelte';
    import { Toaster } from 'svelte-french-toast';
</script>

<Title title="Stránka" />

<slot />
<Toaster />
