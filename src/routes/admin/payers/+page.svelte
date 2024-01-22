<script>
    import Title from "$lib/components/title.svelte"
    import Icon from "$lib/components/icon.svelte"
    import { copy } from 'svelte-copy';

    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Button, Spinner, Tooltip, ButtonGroup
    } from 'flowbite-svelte';
    import axios from "axios";

    import {onMount} from "svelte";

    import {
        IconTrash,
        IconEdit,
        IconFileInvoice,
        IconCheck,
        IconX,
        IconQuestionMark,
        IconCash
    } from "@tabler/icons-svelte";

    let openDetailsPayerCreditsModal = false;
    let openEditPayerModal = false;
    let openNewPayerModal = false;
    let openDeletePayerModal = {opened: false, data: {}};

    onMount(async () => {
        await fetchData();
    })

    let loadingPayers = true;
    let dataPayerModal = {
        id: 0,
        firstName: "",
        lastName: "",
        email: ""
    };
    let payers = [];

    async function fetchData() {
        const response = await axios.get('admin/payers', {withCredentials: true})

        payers = response.data.data;
        loadingPayers = false;
    }

    let dataCredits = {};

    async function fetchCredits(id) {
        const response = await axios.get('admin/payers/' + id + '/credits', {withCredentials: true})

        dataCredits = response.data.data;
        openDetailsPayerCreditsModal = true;
    }


    import EditPayerModal from '$lib/components/modals/EditPayerModal.svelte'
    import DeletePayerModal from "$lib/components/modals/DeletePayerModal.svelte";
    import NewPayerModal from "$lib/components/modals/NewPayerModal.svelte";
    import DetailsPayerCreditsModal from "$lib/components/modals/DetailsPayerCreditsModal.svelte";
    import toast from "svelte-french-toast";
</script>
<Title title="Správa platičů"/>

<div class="p-4">
    {#if loadingPayers}
        <div class="text-center mt-5">
            <Spinner color="yellow"/>
        </div>
    {:else}
        <div class="pb-4 text-center">
            <Button class="duration-200" color="yellow" on:click={() => {openNewPayerModal = true}}>
                Přidat platiče
            </Button>
        </div>
        <Table shadow>
            <TableHead>
                <TableHeadCell>Jméno</TableHeadCell>
                <TableHeadCell>Zaplaceno</TableHeadCell>
                <TableHeadCell>Kredit</TableHeadCell>
                <TableHeadCell>Akce</TableHeadCell>
            </TableHead>
            <TableBody class="divide-y">

                {#each payers as payer}
                    <TableBodyRow>
                        <TableBodyCell class="font-bold">
                            <span use:copy={payer.email} on:svelte-copy={(event) => toast.success(`E-mailová adresa byla zkopírována.`)}>
                                {payer.firstName} {payer.lastName}
                            </span>
                            <Tooltip>
                                {payer.email}
                            </Tooltip>
                        </TableBodyCell>
                        <TableBodyCell>
                            <div class="flex space-x-4">
                                {#if payer.status.paid.records === payer.status.total.records}
                                    <IconCheck class="bg-green-200 rounded-md mr-1"/>
                                {:else if payer.status.paid.records === 0}
                                    <IconX class="bg-red-300 rounded-md mr-1"/>
                                {:else}
                                    <IconQuestionMark class="bg-orange-200 rounded-md mr-1"/>
                                {/if}
                                {new Intl.NumberFormat('cs-CZ', {
                                    style: 'currency',
                                    currency: 'CZK',
                                    minimumFractionDigits: 0,
                                }).format(payer.status.paid.amount)}
                                z
                                {new Intl.NumberFormat('cs-CZ', {
                                    style: 'currency',
                                    currency: 'CZK',
                                    minimumFractionDigits: 0,
                                }).format(payer.status.total.amount)}
                            </div>
                            <Tooltip placement="left" shadow="true"
                                     color={payer.status.paid.records === payer.status.total.records ? "green" : (payer.status.paid.records === 0 ? "red" : "yellow")}>
                                {payer.status.paid.records} z {payer.status.total.records}
                            </Tooltip>
                        </TableBodyCell>
                        <TableBodyCell>
                            {new Intl.NumberFormat('cs-CZ', {
                                style: 'currency',
                                currency: 'CZK',
                                minimumFractionDigits: 0,
                            }).format(payer.creditSum)}
                        </TableBodyCell>
                        <TableBodyCell>
                            <ButtonGroup>
                                <Button color="green" on:click={() => {fetchCredits(payer.id)}}>
                                    <IconCash/>
                                </Button>
                                <Tooltip>
                                    Zobrazit kredity platiče
                                </Tooltip>
                                <Button color="yellow" on:click={() => {dataPayerModal = payer; openEditPayerModal = true}}>
                                    <IconEdit/>
                                </Button>
                                <Tooltip>
                                    Upravit platiče
                                </Tooltip>
                                <Button color="red" on:click={() => openDeletePayerModal = {opened: true, data: payer}}>
                                    <IconTrash/>
                                </Button>
                                <Tooltip>
                                    Smazat platiče
                                </Tooltip>
                            </ButtonGroup>
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    {/if}
</div>

<DetailsPayerCreditsModal bind:open={openDetailsPayerCreditsModal} bind:data={dataCredits} refresh={fetchData}/>
<NewPayerModal bind:open={openNewPayerModal} refresh={fetchData} bind:loading={loadingPayers}/>
<EditPayerModal bind:open={openEditPayerModal} bind:data={dataPayerModal} refresh={fetchData}
                bind:loading={loadingPayers}/>
<DeletePayerModal bind:modaldata={openDeletePayerModal} refresh={fetchData} bind:loading={loadingPayers}/>
