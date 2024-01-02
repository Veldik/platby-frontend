<Modal title="Přehled pravidelné platby" lg bind:open={open} autoclose>
    <div class="flex mb-4">
        <table>
            <tr>
                <td class="pr-4">Název:</td>
                <td>{data.title}</td>
            </tr>
            <tr>
                <td class="pr-4">Zobrazovaný název:</td>
                <td>{data.displayTitle}</td>
            </tr>
            {#if data.description}
                <tr>
                    <td class="pr-4">Popis:</td>
                    <td>{data.description}</td>
                </tr>
                <tr>
                    <td class="pr-4">Zobrazovaný popis:</td>
                    <td>{data.displayDescription}</td>
                </tr>
            {/if}
            <tr>
                <td class="pr-4">Poslední spuštění:</td>
                <td>
                    {#if data.lastRun === null}
                        <span class="text-red-500">Nikdy</span>
                    {:else}
                        {new Intl.DateTimeFormat('cs-CZ', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric'
                        }).format(new Date(data.lastRun * 1000))}
                    {/if}
                </td>
            </tr>
            <tr>
                <td class="pr-4">Další spuštění:</td>
                <td>
                    {#if data.nextRun === null}
                        <span class="text-red-500">Nikdy</span>
                    {:else}
                        {new Intl.DateTimeFormat('cs-CZ', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric'
                        }).format(new Date(data.nextRun * 1000))}
                    {/if}
                </td>
            </tr>
            <tr>
                <td class="pr-4">Cron:</td>
                <td>{data.cronExpression}</td>
            </tr>
        </table>


    </div>
    <div class="flex justify-between items-center mb-4">
        <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Přehled jednotlivých pravidelných
            platičů</h5>
    </div>
    <Listgroup items={data.periodPayers} let:item class="border-0 dark:!bg-transparent">
        <div class="flex items-center space-x-4">
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {item.payer.firstName} {item.payer.lastName}
                </p>
            </div>
            <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                <Button class="!p-2 mr-1 border-0"
                        on:click={() => {deletePeriodPayer(item.id)}}
                        color="light">
                    <IconTrash class="text-red-400"/>
                </Button>
                {item.amount} Kč
            </div>
        </div>
    </Listgroup>
    <div class="flex justify-between items-center mb-4">
        <Button color="green" on:click={() => {addPeriodPayer()}}>
            <IconUserPlus/> &nbsp; Přidat pravidelného platiče
        </Button>
    </div>
</Modal>

<script>
    import {Button, Modal, Listgroup} from 'flowbite-svelte'
    import {
        IconTrash, IconUserPlus
    } from "@tabler/icons-svelte";
    import dayjs from 'dayjs';
    import axios from "axios";
    import toast from "svelte-french-toast";
    import AddPeriodPaymentPayerModal from "$lib/components/modals/AddPeriodPaymentPayerModal.svelte";

    let openAddPeriodPaymentPayerModal = false;
    let payers = [];

    const deletePeriodPayer = async (id) => {
        const response = await axios.delete(`admin/period-payment-payer/${id}`, {withCredentials: true});
        if (response.status === 200) {
            toast.success('Pravidelný platič byl úspěšně smazán')
        } else {
            toast.error('Při mazání pravidelného platiče došlo k chybě');
        }
        open = false;
    };

    async function addPeriodPayer() {
        const response = await axios.get('admin/payers', {withCredentials: true})

        payers = response.data.data;

        data.periodPayers.forEach((periodPayer) => {
            payers = payers.filter((p) => p.id !== periodPayer.payer.id);
        });

        payers = payers.map((p) => {
            return {
                value: p.id,
                name: p.fullName
            }
        });
        console.log(payers)

        openAddPeriodPaymentPayerModal = true;
    }

    export let open, data, refresh, loading;

</script>

<AddPeriodPaymentPayerModal bind:open={openAddPeriodPaymentPayerModal} payers={payers} periodPaymentId={data.id}/>