<script>
    import Title from "$lib/components/title.svelte"
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Button, Spinner, Tooltip, ButtonGroup, Popover
    } from 'flowbite-svelte';
    import axios from "axios";

    import {onMount} from "svelte";

    import {
        IconX,
    } from "@tabler/icons-svelte";

    onMount(async () => {
        await fetchData();
    })

    let loadingPayers = true;
    let paymentRecords = [];

    let loadingQrCode = true;
    let qrcode = '';

    async function fetchData() {
        const response = await axios.get('payer/payments', {withCredentials: true})

        paymentRecords = response.data.data;
        loadingPayers = false;
    }

    async function getQrCode(id) {
        loadingQrCode = true
        qrcode = '';
        const response = await axios.get('payer/payment-record/' + id + '/qrcode', {}, {withCredentials: true})
        qrcode = response.data.data;
        loadingQrCode = false;
    }
</script>
<Title title="Správa plateb"/>


<div class="p-4">
    {#if loadingPayers}
        <div class="text-center mt-5">
            <Spinner color="yellow"/>
        </div>
    {:else}
        <Table shadow>
            <TableHead>
                <TableHeadCell>Název</TableHeadCell>
                <TableHeadCell>Částka</TableHeadCell>
                <TableHeadCell>Zaplaceno</TableHeadCell>
            </TableHead>
            <TableBody class="divide-y">
                {#each paymentRecords as paymentRecord}
                    <TableBodyRow>
                        <TableBodyCell class="font-bold">
                            <span>
                                {paymentRecord.payment.title}
                            </span>
                            {#if paymentRecord.payment.description}
                                <Tooltip>
                                    {paymentRecord.payment.description}
                                </Tooltip>
                            {/if}
                        </TableBodyCell>
                        <TableBodyCell>
                            {new Intl.NumberFormat('cs-CZ', {
                                style: 'currency',
                                currency: 'CZK'
                            }).format(paymentRecord.amount)}
                        </TableBodyCell>
                        <TableBodyCell>
                            {#if paymentRecord.paidAt}
                                <span>
                                {new Intl.DateTimeFormat('cs-CZ', {
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric'
                                }).format(new Date(paymentRecord.paidAt))}
                                </span>
                                <Tooltip>
                                    {new Intl.DateTimeFormat('cs-CZ', {
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric'
                                    }).format(new Date(paymentRecord.paidAt))}
                                </Tooltip>


                            {:else}
                                <button on:click={
                                    getQrCode(paymentRecord.id)
                                }

                                        id="pay" class="bg-amber-200 hover:bg-amber-300 text-black font-medium rounded-md px-3 py-2 text-sm duration-200">
                                    Zaplatit</button>
                                <Popover class="w-64 text-sm font-light " title="Zaplatit" triggeredBy="#pay" trigger="click">
                                    {#if loadingQrCode}
                                        <div class="text-center mt-5">
                                            <Spinner color="yellow"/>
                                        </div>
                                    {:else}
                                        <div class="flex flex-col items-center">
                                            <img src={qrcode} alt="QR Code"/>
                                            <p class="text-center">Zaplaťte prosím pomocí QR kódu</p>
                                        </div>
                                    {/if}
                                </Popover>

                            {/if}
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    {/if}
</div>