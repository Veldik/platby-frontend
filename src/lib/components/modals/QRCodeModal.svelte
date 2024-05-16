<script>
    import { Modal } from 'flowbite-svelte';

    export let open, data, refresh, loading;
</script>

<Modal title="QR kód pro zaplacení" bind:open size="xs" class="w-full">
    <img src={data.qrcode} alt="QR kód" class="w-full" />
    <p class="text-center text-sm">
        Číslo účtu <b>{data.accountNumber}</b> <br />
        {#if data.variableSymbol}
            Variabilní symbol <b>{data.variableSymbol}</b> <br />
        {/if}
        {#if data.specificSymbol}
            Specifický symbol <b>{data.specificSymbol}</b> <br />
        {/if}

        Částka
        <b>
            {new Intl.NumberFormat('cs-CZ', {
                style: 'currency',
                currency: 'CZK',
                minimumFractionDigits: 0,
            }).format(data.amount)}</b>
    </p>
</Modal>
