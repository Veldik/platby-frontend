<script>
    import Title from "$lib/components/title.svelte"
    import Icon from "$lib/components/icon.svelte"
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

    import {IconTrash, IconEdit, IconFileInvoice, IconCheck, IconX, IconQuestionMark} from "@tabler/icons-svelte";

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
        const response = await axios.get('payers', {withCredentials: true})

        payers = response.data.data;
        loadingPayers = false;
    }


    import EditPayerModal from '$lib/components/modals/EditPayerModal.svelte'
    import DeletePayerModal from "$lib/components/modals/DeletePayerModal.svelte";
    import NewPayerModal from "$lib/components/modals/NewPayerModal.svelte";
</script>
<Title title="Správa platičů"/>

<ButtonGroup class="m-5">
    <Button gradient shadow="green" color="green" on:click={() => {openNewPayerModal = true}}>
        Přidat platiče
    </Button>
</ButtonGroup>


<div class="p-4">
    {#if loadingPayers}
        <div class="text-center mt-5">
            <Spinner color="green"/>
        </div>
    {:else}
        <Table shadow>
            <TableHead>
                <TableHeadCell>Jméno</TableHeadCell>
                <TableHeadCell>Zaplaceno</TableHeadCell>
                <TableHeadCell>Akce</TableHeadCell>
            </TableHead>
            <TableBody class="divide-y">

                {#each payers as payer}
                    <TableBodyRow>
                        <TableBodyCell class="font-bold"><a href="mailto:{payer.email}" target="_blank">{payer.firstName} {payer.lastName}</a>
                            <Tooltip>
                                {payer.email}
                            </Tooltip>
                        </TableBodyCell>
                        <TableBodyCell>
                            <div class="flex space-x-4">
                                {#if payer.status.paid.records === payer.status.total.records}
                                    <IconCheck class="bg-emerald-400 rounded-md mr-1"/>
                                {:else if payer.status.paid.records === 0}
                                    <IconX class="bg-red-500 rounded-md mr-1"/>
                                {:else}
                                    <IconQuestionMark class="bg-orange-500 rounded-md mr-1"/>

                                {/if}
                                {payer.status.paid.amount} Kč z {payer.status.total.amount} Kč
                            </div>
                            <Tooltip placement="left" shadow="true"
                                     color={payer.status.paid.records === payer.status.total.records ? "green" : (payer.status.paid.records === 0 ? "red" : "yellow")}>
                                {payer.status.paid.records} z {payer.status.total.records}
                            </Tooltip>
                        </TableBodyCell>
                        <TableBodyCell>
                            <div class="flex flex-wrap items-center gap-2">
                                <Button class="!p-2"
                                        on:click={() => {dataPayerModal = payer; openEditPayerModal = true}}
                                        color="light">
                                    <IconEdit class="text-amber-500"/>
                                </Button>
                                <Button class="!p-2" on:click={() => openDeletePayerModal = {opened: true, data: payer}}
                                        color="light">
                                    <IconTrash class="text-red-500"/>
                                </Button>
                            </div>
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    {/if}
</div>

<NewPayerModal bind:open={openNewPayerModal} refresh={fetchData} bind:loading={loadingPayers}/>
<EditPayerModal bind:open={openEditPayerModal} bind:data={dataPayerModal} refresh={fetchData}
                bind:loading={loadingPayers}/>
<DeletePayerModal bind:modaldata={openDeletePayerModal} refresh={fetchData} bind:loading={loadingPayers}/>
