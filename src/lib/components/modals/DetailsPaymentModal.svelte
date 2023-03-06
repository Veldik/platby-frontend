<Modal title="Detail platby - {data.title}" lg bind:open={open} autoclose>
    {#if data.description}
        <p class="text-gray-500 dark:text-gray-400">{data.description}</p>
    {/if}
    <div class="flex justify-between items-center mb-4">
        <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Přehled jednotlivých plateb</h5>
    </div>
    <Listgroup items={data.paymentRecords} let:item class="border-0 dark:!bg-transparent">
        <div class="flex items-center space-x-4">
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {item.payer.firstName} {item.payer.lastName}
                </p>
                <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                    {#if item.paid_at !== null}
                        <div class="flex items-center text-green-400">
                            <IconCheck class="mr-2"/> {dayjs(item.paid_at).format('DD.MM.YYYY HH:mm')}
                        </div>
                    {:else}

                        <div class="flex items-center text-red-400">
                            <IconX class="mr-2"/>
                            Nezaplaceno
                        </div>
                    {/if}
                </p>
            </div>
            <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {item.amount} Kč
            </div>
        </div>
    </Listgroup>
</Modal>

<script>
    import {Button, Modal, Label, Input, Checkbox, Card, Listgroup} from 'flowbite-svelte'
    import {IconCheck, IconX} from "@tabler/icons-svelte";
    import dayjs from 'dayjs';

    export let open, data, refresh, loading;

</script>
