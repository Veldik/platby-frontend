<Modal bind:open={modaldata.opened} autoclose>
    <div class="flex items-center">
        <IconTrash class="mr-2"/>
        <h2 class="text-2xl font-bold text-dark py-3">Odstranění platiče</h2>

    </div>
    <div class="text-center">

        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Jsi si jistý, že chceš odstranit <b>{modaldata.data.firstName} {modaldata.data.lastName}</b> ze seznamu platičů?</h3>
        <p class="text-sm mb-5">
            Tato akce smaže všechny platební záznamy, kredity a propojení s pravidelnými platby tohoto platiče.
        </p>
        <Button on:click={removePayer} color="red" class="mr-2">Ano, odstranit</Button>
        <Button color='alternative'>Zrušit</Button>
    </div>
</Modal>

<script>
    import { Button, Modal } from 'flowbite-svelte'
    import {IconTrash} from "@tabler/icons-svelte";
    import axios from "axios";
    export let modaldata, refresh, loading;

    const removePayer = async () => {
        loading = true
        await axios.delete(`admin/payers/${modaldata.data.id}`)
        await refresh();
        loading = false;
    };

</script>
