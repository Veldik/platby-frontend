<script>
    import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';

    import axios from 'axios';
    import { IconTrash } from '@tabler/icons-svelte';

    export let open, data, refresh, loading;
    const removePayment = async () => {
        loading = true;
        await axios.delete(`admin/period-payments/${data.id}`);
        open = false;
        loading = false;
        await refresh();
    };
</script>

<Modal bind:open autoclose>
    <div class="flex items-center">
        <IconTrash class="mr-2" />
        <h2 class="text-dark py-3 text-2xl font-bold">Odstranění platby</h2>
    </div>
    <div class="text-center">
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Jsi si jistý, že chceš odstranit <b>{data.title}</b> ze seznamu pravidelných
            plateb?
        </h3>
        <Button on:click={removePayment} color="red" class="mr-2"
            >Ano, odstranit</Button
        >
        <Button color="alternative">Zrušit</Button>
    </div>
</Modal>
