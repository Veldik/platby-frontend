<script>
    import { Button, Modal, Popover, Tooltip } from 'flowbite-svelte';
    import { IconCash, IconEdit } from '@tabler/icons-svelte';
    import axios from 'axios';

    export let open, paydata, refresh, loading;

    const pay = async () => {
        await axios.post(`payer/payment-record/${paydata.id}/pay`);
        await refresh();
        open = false;
    };
</script>

<Modal
    title="Zaplacení {paydata.payment.title}"
    bind:open
    size="xs"
    class="w-full">
    <div>
        <div
            class="grid grid-cols-1 items-center justify-center sm:grid-cols-2">
            <div>
                <img
                    src={paydata.paymentRecord.qrcode}
                    alt="QR kód"
                    class="w-full" />
                <div class="text-center">
                    {#if paydata.paymentRecord.specificSymbol}
                        <p class="text-sm text-gray-600">
                            Specifický symbol <b
                                >{paydata.paymentRecord.specificSymbol}</b>
                        </p>
                    {/if}
                    <p class="text-sm text-gray-600">
                        Částka <b
                            >{new Intl.NumberFormat('cs-CZ', {
                                style: 'currency',
                                currency: 'CZK',
                            }).format(paydata.amount)}</b>
                    </p>
                </div>
            </div>

            <div class="pt-4">
                <div class="text-center">
                    <p class="pb-1 text-sm font-bold text-gray-700">
                        Údaje pro platbu
                    </p>
                    <p class="text-sm text-gray-600">
                        Číslo účtu <b>{paydata.paymentRecord.accountNumber}</b>
                    </p>
                    <p class="pb-4 text-sm text-gray-600">
                        Variabilní symbol <b
                            >{paydata.paymentRecord.variableSymbol}</b>
                    </p>
                    <p class="pb-1 text-sm font-bold text-gray-700">
                        Platba pomocí kreditů
                    </p>
                    <p class="pb-4 text-xs text-gray-500">
                        Máš na účtu {new Intl.NumberFormat('cs-CZ', {
                            style: 'currency',
                            currency: 'CZK',
                            minimumFractionDigits: 2,
                        }).format(paydata.credits)}
                    </p>

                    <p class="text-sm text-gray-600">
                        {#if paydata.credits >= paydata.amount}
                            <Button color="yellow" on:click={() => pay()}>
                                <IconCash class="mr-1" />
                                Zaplatit
                            </Button>
                        {:else}
                            <Button color="yellow" disabled={true}>
                                <IconCash class="mr-1" />
                                Zaplatit
                            </Button>
                            <Tooltip>Nemáš dostatek kreditů</Tooltip>
                        {/if}
                    </p>
                </div>
            </div>
        </div>
    </div>
</Modal>
