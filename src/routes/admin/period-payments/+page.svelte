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
    import dayjs from "dayjs";
    import relativeTime from 'dayjs/plugin/relativeTime';
    import 'dayjs/locale/cs'



    onMount(() => {
        fetchData();
    });


    import {onMount} from "svelte";

    import {
        IconFileInvoice,
        IconTrash,
    } from "@tabler/icons-svelte";

    let openNewPeriodPaymentModal = false;
    let openDeletePeriodPaymentModal = false;
    let openDetailsPeriodPaymentModal = false;


    let dataPeriodPaymentModal = {};
    let data = {
        title: '',
    };


    let loadingPayments = true;
    let loadingPayers = true;

    let pagesinfo = {};

    let periodPayments = [];
    let payers = [];

    dayjs.locale('cs')
    dayjs.extend(relativeTime);

    async function fetchData(url = 'admin/period-payments') {
        loadingPayments = true;
        const response = await axios.get(url, {withCredentials: true})

        periodPayments = response.data.data;
        pagesinfo = response.data.links;
        loadingPayments = false;
    }

    async function fetchPeriodPaymentData(id) {
        const response = await axios.get(`admin/period-payments/${id}`, {withCredentials: true})
        data = response.data.data;
        openDetailsPeriodPaymentModal = true;
    }

    async function fetchPayers() {
        const response = await axios.get('admin/payers', {withCredentials: true})

        payers = response.data.data;
        openNewPeriodPaymentModal = true;
    }

    import DeletePeriodPaymentModal from "$lib/components/modals/DeletePeriodPaymentModal.svelte";
    import NewPeriodPayementModal from "$lib/components/modals/NewPeriodPayementModal.svelte";
    import DetailsPeriodPaymentModal from "$lib/components/modals/DetailsPeriodPaymentModal.svelte";

</script>
<Title title="Správa plateb"/>

<div class="p-4">
    {#if loadingPayments}
        <div class="text-center mt-5">
            <Spinner color="yellow"/>
        </div>
    {:else}
        <div class="pb-4 text-center">
            <Button class="duration-200" color="yellow" on:click={() => {payers = fetchPayers()}}>
                Vytvořit pravidelnou platbu
            </Button>
        </div>

        <Table shadow>
            <TableHead>
                <TableHeadCell>Název</TableHeadCell>
                <TableHeadCell>Cron</TableHeadCell>
                <TableHeadCell>Další</TableHeadCell>
                <TableHeadCell>Akce</TableHeadCell>
            </TableHead>
            <TableBody class="divide-y">
                {#each periodPayments as periodPayment}
                    <TableBodyRow>
                        <TableBodyCell class="font-bold">
                            <span>
                                {periodPayment.title}
                            </span>
                            {#if periodPayment.description}
                                <Tooltip>
                                    {periodPayment.description}
                                </Tooltip>
                            {/if}
                        </TableBodyCell>

                        <TableBodyCell>
                            <div class="flex space-x-4">
                                <span>
                                    {periodPayment.cronExpression}
                                </span>
                                <Tooltip>
                                    {#if periodPayment.lastRun == null}
                                        <span class="text-red-500">
                                            Nikdy nebyla spuštěna
                                        </span>
                                    {:else}
                                        {new Intl.DateTimeFormat('cs-CZ', {
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            second: 'numeric',
                                        }).format(new Date(periodPayment.lastRun * 1000))}
                                    {/if}
                                </Tooltip>
                            </div>
                        </TableBodyCell>

                        <TableBodyCell>
                            <span>
                                {dayjs(periodPayment.nextRun * 1000).fromNow()}
                            </span>
                            <Tooltip>
                                {new Intl.DateTimeFormat('cs-CZ', {
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    second: 'numeric',
                                }).format(new Date(periodPayment.nextRun * 1000))}
                            </Tooltip>

                        </TableBodyCell>

                        <TableBodyCell>
                            <ButtonGroup>
                                <Button color="yellow" on:click={() => {data = fetchPeriodPaymentData(periodPayment.id)}}>
                                    <IconFileInvoice/>
                                </Button>
                                <Button color="red" on:click={() => {
                                    dataPeriodPaymentModal = periodPayment;
                                    openDeletePeriodPaymentModal = true;
                                }}>
                                    <IconTrash/>
                                </Button>
                            </ButtonGroup>
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    {/if}
</div>

<NewPeriodPayementModal bind:open={openNewPeriodPaymentModal} refresh={fetchData}/>
<DetailsPeriodPaymentModal bind:open={openDetailsPeriodPaymentModal} data={data}/>
<DeletePeriodPaymentModal bind:open={openDeletePeriodPaymentModal} data={dataPeriodPaymentModal} refresh={fetchData}
                    bind:loading={loadingPayers}/>
