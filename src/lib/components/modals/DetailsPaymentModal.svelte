<script>
    import {
        Button,
        Modal,
        Label,
        Input,
        Checkbox,
        Card,
        Listgroup,
    } from 'flowbite-svelte';
    import {
        IconCash,
        IconCheck,
        IconEdit,
        IconFileInvoice,
        IconMailForward,
        IconQuestionMark,
        IconSun,
        IconX,
        IconQrcode,
    } from '@tabler/icons-svelte';
    import dayjs from 'dayjs';
    import axios from 'axios';
    import toast from 'svelte-french-toast';
    import QRCodeModal from '$lib/components/modals/QRCodeModal.svelte';

    async function fetchPaymentQRCode(id) {
        const response = await axios.get(`admin/payment-record/${id}/qrcode`, {
            withCredentials: true,
        });
        qrCodeData = response.data.data;
        openQRCodeModal = true;
    }


    const pay = async (id) => {
        const response = await axios.post(`admin/payment-record/${id}/pay`, {
            withCredentials: true,
        });
        if (response.status === 200) {
            toast.success('Platba byla zaznamenána jako zaplacená');
        } else {
            toast.error('Platbu se nepodařilo zaznamenat jako zaplacenou');
        }
        await refresh();
        open = false;
    };

    let openQRCodeModal = false;
    let qrCodeData = null;

    export let open, data, refresh, loading;
</script>

<Modal title={data.title} lg bind:open autoclose>
    {#if data.description}
        <p class="text-gray-500 dark:text-gray-400">{data.description}</p>
    {/if}
    <div class="mb-4 flex items-center justify-between">
        <h5
            class="text-xl font-bold leading-none text-gray-900 dark:text-white"
        >
            Přehled jednotlivých plateb
        </h5>
    </div>

    {#if data.paymentRecords.length === 0}
        <p class="text-gray-700">Tato platba nemá žádné platiče. 😥</p>
    {:else}
        <Listgroup
            items={data.paymentRecords}
            let:item
            class="border-0 dark:!bg-transparent"
        >
            <div class="flex items-center space-x-4">
                <div class="min-w-0 flex-1">
                    <p
                        class="truncate text-sm font-medium text-gray-900 dark:text-white"
                    >
                        {item.payer.firstName}
                        {item.payer.lastName}
                    </p>
                    <p
                        class="truncate text-sm text-gray-500 dark:text-gray-400"
                    >
                        {#if item.paidAt !== null}
                            <div class="flex items-center text-green-400">
                                <IconCheck class="mr-2" />
                                {dayjs(item.paidAt).format('DD.MM.YYYY HH:mm')}
                            </div>
                        {:else}
                            <div class="flex items-center text-red-400">
                                <IconX class="mr-2" />
                                Nezaplaceno
                            </div>
                        {/if}
                    </p>
                </div>
                <div
                    class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
                >
                    {#if item.paidAt !== null}{:else}
                        <div>
                            <Button
                                class="border-0 !p-2"
                                on:click={() => {
                                    fetchPaymentQRCode(item.id);
                                }}
                                color="light"
                            >
                                <IconQrcode class="text-gray-300" />
                            </Button>
                            <Button
                                class="mr-1 border-0 !p-2"
                                on:click={() => {
                                    pay(item.id);
                                }}
                                color="light"
                            >
                                <IconCash class="text-green-500" />
                            </Button>
                        </div>
                    {/if}
                    {item.amount} Kč
                </div>
            </div>
        </Listgroup>
    {/if}
</Modal>

<QRCodeModal bind:open={openQRCodeModal} data={qrCodeData} {refresh} />
