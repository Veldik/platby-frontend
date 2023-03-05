<Modal bind:open={open} autoclose>
    <div class="flex items-center">
        <IconTrash class="mr-2"/>
        <h2 class="text-2xl font-bold text-dark py-3">Odstranění platiče</h2>

    </div>
    <div class="text-center">

        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Jsi si jistý, že chceš odstranit <b>{data.title}</b> ze seznamu plateb?</h3>
        <Button on:click={removePayment} color="red" class="mr-2">Ano, odstranit</Button>
        <Button color='alternative'>Zrušit</Button>
    </div>
</Modal>

<script>
    import {Button, Modal, Label, Input, Checkbox} from 'flowbite-svelte'

    import axios from "axios";
    import {IconTrash} from "@tabler/icons-svelte";

    export let open, data, refresh, loading;
    const removePayment = async () => {
        loading = true
        await axios.delete(`payments/${data.id}`)
        await refresh();
        open = false;
        loading = false;
    };

</script>
