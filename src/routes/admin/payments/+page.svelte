<script>
    import Title from "$lib/components/title.svelte"
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

    import {IconTrash, IconFileInvoice, IconCheck, IconX, IconQuestionMark} from "@tabler/icons-svelte";

    let openNewPaymentModal = false;
    let openDeletePaymentModal = false;
    let openDetailsPaymentModal = false;

    onMount(async () => {
        await fetchData();
    })

    let dataPaymentModal = {};

    let loadingPayers = true;

    let payments = [];

    async function fetchData() {
        const response = await axios.get('payments', {withCredentials: true})

        payments = response.data.data;
        loadingPayers = false;
    }


    import EditPayerModal from '$lib/components/modals/EditPayerModal.svelte'
    import DeletePayerModal from "$lib/components/modals/DeletePayerModal.svelte";
    import Cookies from "js-cookie";
    import {goto} from "$app/navigation";
    import NewPayerModal from "$lib/components/modals/NewPayerModal.svelte";
    import NewPayementModal from "$lib/components/modals/NewPayementModal.svelte";
    import DeletePaymentModal from "$lib/components/modals/DeletePaymentModal.svelte";
    import DetailsPaymentModal from "$lib/components/modals/DetailsPaymentModal.svelte";
</script>
<Title title="Správa plateb"/>

<ButtonGroup class="m-5 justify-between">
    <Button gradient shadow="green" color="green" on:click={() => {openNewPaymentModal = true}}>
        Vytvořit platbu
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
                <TableHeadCell>Název</TableHeadCell>
                <TableHeadCell>Zaplaceno</TableHeadCell>
                <TableHeadCell>Akce</TableHeadCell>
            </TableHead>
            <TableBody class="divide-y">

                {#each payments as payment}
                    <TableBodyRow>
                        <TableBodyCell class="font-bold">
                            <span>
                                {payment.title}
                            </span>
                            {#if payment.description}
                                <Tooltip>
                                    {payment.description}
                                </Tooltip>
                            {/if}
                        </TableBodyCell>
                        <TableBodyCell>
                            <div class="flex space-x-4">
                                {#if payment.status.paid.records === payment.status.total.records}
                                    <IconCheck class="bg-emerald-400 rounded-md mr-1"/>
                                {:else if payment.status.paid.records === 0}
                                    <IconX class="bg-red-500 rounded-md mr-1"/>
                                {:else}
                                    <IconQuestionMark class="bg-orange-500 rounded-md mr-1"/>

                                {/if}
                                {payment.status.paid.amount} Kč z {payment.status.total.amount} Kč
                            </div>
                            <Tooltip placement="left" shadow="true"
                                     color={payment.status.paid.records === payment.status.total.records ? "green" : (payment.status.paid.records === 0 ? "red" : "yellow")}>
                                {payment.status.paid.records} z {payment.status.total.records}
                            </Tooltip>
                        </TableBodyCell>

                        <TableBodyCell>
                            <div class="flex flex-wrap items-center gap-2">
                                <Button class="!p-2"
                                        on:click={() => {dataPaymentModal = payment; openDetailsPaymentModal = true}}
                                        color="light">
                                    <IconFileInvoice class="text-amber-500"/>
                                </Button>
                                <Button class="!p-2"
                                        on:click={() => {dataPaymentModal = payment; openDeletePaymentModal = true}}
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

<DetailsPaymentModal bind:open={openDetailsPaymentModal} data={dataPaymentModal} refresh={fetchData}
                     bind:loading={loadingPayers}/>
<NewPayementModal bind:open={openNewPaymentModal} refresh={fetchData} bind:loading={loadingPayers}/>
<DeletePaymentModal bind:open={openDeletePaymentModal} data={dataPaymentModal} refresh={fetchData}
                    bind:loading={loadingPayers}/>
