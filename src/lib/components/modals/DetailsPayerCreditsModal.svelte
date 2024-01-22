<script>
    import { Button, Modal, Listgroup } from 'flowbite-svelte';
    import {
        IconCashBanknote,
        IconTrash,
        IconUserPlus,
    } from '@tabler/icons-svelte';
    import AddPeriodPaymentPayerModal from '$lib/components/modals/AddPeriodPaymentPayerModal.svelte';
    import axios from 'axios';
    import NewCreditRecordModal from '$lib/components/modals/NewCreditRecordModal.svelte';

    let openCreditRecordModal = false;

    export let open, data, payer, refresh;

    async function openCreditEditModal() {
        openCreditRecordModal = true;
    }
</script>

<Modal title="Přehled pohybů kreditů" lg bind:open autoclose>
    {#if data.length === 0}
        <div class="mb-4 flex items-center justify-between">
            <p class="text-red-500">
                Tento platič neprovedl žádnou transakci pomocí kreditů
            </p>
        </div>
    {:else}
        <Listgroup items={data} let:item class="border-0 dark:!bg-transparent">
            <div class="flex items-center space-x-4">
                <div class="min-w-0 flex-1">
                    <p
                        class="truncate text-sm font-medium text-gray-900 dark:text-white"
                    >
                        {item.description}
                    </p>
                </div>

                <div
                    class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
                >
                    {item.amount} Kč
                </div>
            </div>
        </Listgroup>
    {/if}
    <Button
        color="green"
        on:click={() => {
            openCreditEditModal();
        }}
    >
        <IconCashBanknote class="-ml-1 mr-2 h-5 w-5" />
        Přidat pohyb kreditů
    </Button>
</Modal>

<NewCreditRecordModal bind:open={openCreditRecordModal} {payer} {refresh} />
