<script>
    import Title from "$lib/components/title.svelte"
    import axios from "axios";


    import {onMount} from "svelte";

    let message = ''
    onMount(async () => {
        const response = await axios.get('user', {withCredentials: true})

        if (response.status === 200) {
            message = `Hi ${response.data.name}`;
        }
    })

</script>
<Title title="Administrace" />

<h1 class="text-3xl font-bold underline">
    {message}
</h1>

