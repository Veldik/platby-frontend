<Modal title={data.title} lg bind:open={open} autoclose>
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
                    {#if item.paidAt !== null}
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
                {#if item.paidAt !== null}

                {:else}
                    <div>
                        <Button class="!p-2 border-0"
                                on:click={() => {fetchPaymentQRCode(item.id)}}
                                color="light">
                            <IconQrcode class="text-gray-300"/>
                        </Button>
                        <Button class="!p-2 border-0"
                                on:click={() => {reSendMail(item.id)}}
                                color="light">
                            <IconMailForward class="text-blue-500"/>
                        </Button>
                        <Button class="!p-2 mr-1 border-0"
                                on:click={() => {pay(item.id)}}
                                color="light">
                            <IconCash class="text-green-500"/>
                        </Button>
                    </div>
                {/if}
                {item.amount} Kč
            </div>
        </div>
    </Listgroup>
</Modal>

<script>
    import {Button, Modal, Label, Input, Checkbox, Card, Listgroup} from 'flowbite-svelte'
    import {
        IconCash,
        IconCheck,
        IconEdit,
        IconFileInvoice, IconMailForward,
        IconQuestionMark,
        IconSun,
        IconX, IconQrcode
    } from "@tabler/icons-svelte";
    import dayjs from 'dayjs';
    import axios from "axios";
    import toast from "svelte-french-toast";
    import QRCodeModal from "$lib/components/modals/QRCodeModal.svelte";

    async function fetchPaymentQRCode(id) {
        const response = await axios.get(`admin/payment-record/${id}/qrcode`, {withCredentials: true})
        qrCodeData = response.data.data;
        openQRCodeModal = true;
    }

    const reSendMail = async (id) => {
        const response = await axios.post(`admin/payment-record/${id}/resend`, {withCredentials: true});
        if (response.status === 200) {
            toast.success('Email byl úspěšně odeslán')
        } else {
            toast.error('Email se nepodařilo odeslat');
        }
        await refresh();
        open = false;
    };

    const pay = async (id) => {
        const response = await axios.post(`admin/payment-record/${id}/pay`, {withCredentials: true});
        if (response.status === 200) {
            toast.success('Platba byla zaznamenána jako zaplacená')
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

<QRCodeModal bind:open={openQRCodeModal} data={qrCodeData} refresh={refresh}/>