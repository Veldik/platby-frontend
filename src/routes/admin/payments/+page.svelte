<script>
    import Title from '$lib/components/title.svelte';
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Button,
        Spinner,
        Tooltip,
        ButtonGroup,
        Pagination,
        ArrowKeyLeft,
        ArrowKeyRight,
    } from 'flowbite-svelte';
    import axios from 'axios';

    // svelte get active url

    let pages = [
        { name: 6, href: '/components/pagination?page=6' },
        { name: 7, href: '/components/pagination?page=7' },
        { name: 8, href: '/components/pagination?page=8' },
        { name: 9, href: '/components/pagination?page=9' },
        { name: 10, href: '/components/pagination?page=10' },
    ];

    onMount(() => {
        fetchData();
    });

    const previous = () => {
        fetchData(pagesinfo.prev);
    };
    const next = () => {
        console.log(pagesinfo.next);
        fetchData(pagesinfo.next);
    };

    import { onMount } from 'svelte';

    import {
        IconTrash,
        IconFileInvoice,
        IconCheck,
        IconX,
        IconQuestionMark,
        IconMailForward,
    } from '@tabler/icons-svelte';

    let openNewPaymentModal = false;
    let openDeletePaymentModal = false;
    let openDetailsPaymentModal = false;

    let dataPaymentModal = {};

    let loadingPayments = true;
    let loadingPayers = true;

    let pagesinfo = {};

    let payments = [];
    let payers = {};

    async function fetchData(url = 'admin/payments') {
        loadingPayments = true;
        const response = await axios.get(url, { withCredentials: true });

        payments = response.data.data;
        pagesinfo = response.data.links;
        loadingPayments = false;
    }

    async function fetchPaymentData(id) {
        const response = await axios.get(`admin/payments/${id}`, {
            withCredentials: true,
        });
        dataPaymentModal = response.data.data;
        openDetailsPaymentModal = true;
    }

    async function fetchPayers() {
        const response = await axios.get('admin/payers', {
            withCredentials: true,
        });

        payers = response.data.data;
        openNewPaymentModal = true;
    }

    import EditPayerModal from '$lib/components/modals/EditPayerModal.svelte';
    import DeletePayerModal from '$lib/components/modals/DeletePayerModal.svelte';
    import Cookies from 'js-cookie';
    import { goto } from '$app/navigation';
    import NewPayerModal from '$lib/components/modals/NewPayerModal.svelte';
    import NewPayementModal from '$lib/components/modals/NewPayementModal.svelte';
    import DeletePaymentModal from '$lib/components/modals/DeletePaymentModal.svelte';
    import DetailsPaymentModal from '$lib/components/modals/DetailsPaymentModal.svelte';
</script>

<Title title="Správa plateb" />

<div class="p-4">
    {#if loadingPayments}
        <div class="mt-5 text-center">
            <Spinner color="yellow" />
        </div>
    {:else}
        <div class="pb-4 text-center">
            <Button
                class="duration-200"
                color="yellow"
                on:click={() => {
                    payers = fetchPayers();
                }}
            >
                Vytvořit platbu
            </Button>
        </div>

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
                                    <IconCheck
                                        class="mr-1 rounded-md bg-green-200"
                                    />
                                {:else if payment.status.paid.records === 0}
                                    <IconX class="mr-1 rounded-md bg-red-300" />
                                {:else}
                                    <IconQuestionMark
                                        class="mr-1 rounded-md bg-orange-200"
                                    />
                                {/if}
                                {new Intl.NumberFormat('cs-CZ', {
                                    style: 'currency',
                                    currency: 'CZK',
                                    minimumFractionDigits: 0,
                                }).format(payment.status.paid.amount)}
                                z
                                {new Intl.NumberFormat('cs-CZ', {
                                    style: 'currency',
                                    currency: 'CZK',
                                    minimumFractionDigits: 0,
                                }).format(payment.status.total.amount)}
                            </div>
                            <Tooltip
                                placement="left"
                                shadow="true"
                                color={payment.status.paid.records ===
                                payment.status.total.records
                                    ? 'green'
                                    : payment.status.paid.records === 0
                                      ? 'red'
                                      : 'yellow'}
                            >
                                {payment.status.paid.records} z {payment.status
                                    .total.records}
                            </Tooltip>
                        </TableBodyCell>

                        <TableBodyCell>
                            <ButtonGroup>
                                <Button
                                    color="yellow"
                                    on:click={() => {
                                        dataPaymentModal = fetchPaymentData(
                                            payment.id
                                        );
                                    }}
                                >
                                    <IconFileInvoice />
                                </Button>
                                <Button
                                    color="red"
                                    on:click={() => {
                                        dataPaymentModal = payment;
                                        openDeletePaymentModal = true;
                                    }}
                                >
                                    <IconTrash />
                                </Button>
                            </ButtonGroup>
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
        <br />
        <div class="text-center">
            <Button
                color="yellow"
                on:click={previous}
                disabled={!pagesinfo.prev}
            >
                <ArrowKeyLeft />
            </Button>
            <Button color="yellow" on:click={next} disabled={!pagesinfo.next}>
                <ArrowKeyRight />
            </Button>
        </div>
    {/if}
</div>

<DetailsPaymentModal
    bind:open={openDetailsPaymentModal}
    data={dataPaymentModal}
    refresh={fetchData}
    bind:loading={loadingPayers}
/>
<NewPayementModal
    bind:open={openNewPaymentModal}
    refresh={fetchData}
    bind:loading={loadingPayers}
/>
<DeletePaymentModal
    bind:open={openDeletePaymentModal}
    data={dataPaymentModal}
    refresh={fetchData}
    bind:loading={loadingPayers}
/>
