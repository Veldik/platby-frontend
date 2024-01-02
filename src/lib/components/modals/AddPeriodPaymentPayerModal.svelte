<Modal title="Přidání platiče do pravidelné platby" bind:open={open} size="xs" class="w-full">
    <form class="flex flex-col space-y-6" on:submit|preventDefault={postPayment}>
        <Label class="space-y-2">
            <span>Výběr platiče</span>
            <Select items={payers} bind:value={payer} placeholder="Vyber platiče"></Select>
        </Label>
        <Label class="space-y-2">
            <span>Částka</span>
            <NumberInput bind:value={amount} placeholder="Částka" min="0" max="1000000" step="1" />
        </Label>

        <Button color="yellow" disabled={!payer || !amount} type="submit">
            <IconCash class="mr-1"/>
            Přidat pravidelného platiče
        </Button>
    </form>
</Modal>

<script>
    import {Button, Modal, Label, Select, ButtonGroup, InputAddon, NumberInput, Checkbox, Input} from 'flowbite-svelte'
    import {IconX, IconCash} from "@tabler/icons-svelte";
    import axios from "axios";
    import {onMount} from "svelte";
    import toast from "svelte-french-toast";

    export let open, refresh, loading, payers, periodPaymentId;
    let payer = "";
    let amount = 0;
    let disabledSubmit = false;

    const postPayment = async (e) => {
        e.preventDefault();

        loading = true

        disabledSubmit = true;
        await axios.post(`admin/period-payment/${periodPaymentId}/add-payer`, JSON.stringify({
            "payerId": payer,
            "amount": amount,
        }))
        payers = [];
        payer = null;
        amount = 0;
        open = false;
        loading = false;
        disabledSubmit = false;
        await refresh();
    };


</script>
