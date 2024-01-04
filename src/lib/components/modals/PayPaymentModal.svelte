<Modal title="Zaplacení {paydata.payment.title}" bind:open={open} size="xs" class="w-full">
    <div>
        <div class="grid grid-cols-1 sm:grid-cols-2 items-center justify-center">
            <div>
                <img src={paydata.qrcode} alt="QR code" class="w-full">
                <div class="text-center">
                    <p class="text-gray-600 text-sm">Částka <b>{new Intl.NumberFormat('cs-CZ', {
                        style: 'currency',
                        currency: 'CZK'
                    }).format(paydata.amount)}</b></p>
                </div>
            </div>

            <div class="pt-4">
                <div class="text-center">
                    <p class="text-gray-700 font-bold text-sm pb-4">Platba pomocí kreditů</p>
                    <p class="text-gray-500 text-xs pb-4">Máš na účtu {
                            new Intl.NumberFormat('cs-CZ', {
                            style: 'currency',
                            currency: 'CZK',
                            minimumFractionDigits: 2
                        }).format(0)
                    }</p>

                    <p class="text-gray-600 text-sm">
                        <Button color="yellow" disabled={true}>
                            <IconCash class="mr-1"/>
                            Zaplatit
                        </Button>
                        <Tooltip>
                            Tato funkce není dostupná
                        </Tooltip>

                    </p>
                </div>
            </div>
        </div>
    </div>
</Modal>

<script>
    import {Button, Modal, Popover, Tooltip} from 'flowbite-svelte'
    import {IconCash, IconEdit} from "@tabler/icons-svelte";


    export let open, paydata, refresh, loading;

</script>
