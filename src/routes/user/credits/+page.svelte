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
    import {IconCash, IconSeparator} from "@tabler/icons-svelte";

    onMount(async () => {
        await fetchData();
    })

    let loadingCredits = true;
    let creditRecords = [];
    let creditQrCode = '';
    let creditAmount = 0;

    async function fetchData() {
        const response = await axios.get('payer/credits', {withCredentials: true})
        const payerResponse = await axios.get('payer', {withCredentials: true})
        const creditQrCodeResponse = await axios.get('payer/add-credits', {withCredentials: true})


        creditQrCode = creditQrCodeResponse.data.data;
        creditAmount = payerResponse.data.data.creditSum;
        creditRecords = response.data.data;
        loadingCredits = false;
    }

    let placement = 'bottom';

</script>
<Title title="Správa kreditů"/>


<div class="p-4">
    {#if loadingCredits}
        <div class="text-center mt-5">
            <Spinner color="yellow"/>
        </div>
    {:else}
        <div class="text-center mb-4">
            <button

                    id="pay" class="bg-amber-200 hover:bg-amber-300 text-black font-medium rounded-md px-3 py-2 text-sm duration-200">
                Přidat kredit</button>
            <Popover {placement} class="w-64 text-sm font-light" title="Zaplatit" triggeredBy="#pay" trigger="click" >
                <div class="flex flex-col items-center">
                    <img src={creditQrCode} alt="QR Code"/>
                    <p class="text-center">Zaplaťte prosím pomocí QR kódu</p>
                </div>
            </Popover>
            <IconCash class="inline-block ml-2"/> <span class="{creditAmount < 0 ? 'text-red-500' : ''}">
                                {new Intl.NumberFormat('cs-CZ', {
                                    style: 'currency',
                                    currency: 'CZK'
                                }).format(creditAmount)}
                            </span>
        </div>



        <Table shadow>
            <TableHead>
                <TableHeadCell>Název</TableHeadCell>
                <TableHeadCell class="text-right">Částka</TableHeadCell>
            </TableHead>
            <TableBody class="divide-y">
                {#each creditRecords as creditRecord}
                    <TableBodyRow>
                        <TableBodyCell class="font-bold">
                            <span>
                                {creditRecord.description}
                            </span>
                        </TableBodyCell>
                        <TableBodyCell class="text-right">
                            <span class="{creditRecord.amount < 0 ? 'text-red-500' : ''}">
                                {new Intl.NumberFormat('cs-CZ', {
                                    style: 'currency',
                                    currency: 'CZK'
                                }).format(creditRecord.amount)}
                            </span>
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    {/if}
</div>