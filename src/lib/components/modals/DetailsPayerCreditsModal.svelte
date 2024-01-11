<Modal title="Přehled pohybů kreditů" lg bind:open={open} autoclose>
    {#if data.length === 0}
        <div class="flex justify-between items-center mb-4">
            <p class="text-red-500">Tento platič neprovedl žádnou transakci pomocí kreditů</p>
        </div>
    {:else}
    <Listgroup items={data} let:item class="border-0 dark:!bg-transparent">
        <div class="flex items-center space-x-4">
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {item.description}
                </p>
            </div>
            <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {item.amount} Kč
            </div>
        </div>
    </Listgroup>
    {/if}
</Modal>

<script>
    import {Button, Modal, Listgroup} from 'flowbite-svelte'
    import {
        IconTrash, IconUserPlus
    } from "@tabler/icons-svelte";
    import AddPeriodPaymentPayerModal from "$lib/components/modals/AddPeriodPaymentPayerModal.svelte";

    let openAddPeriodPaymentPayerModal = false;

    export let open, data, refresh;

</script>