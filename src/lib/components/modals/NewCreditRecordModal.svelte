<script>
    import {
        Button,
        Modal,
        Label,
        Select,
        ButtonGroup,
        InputAddon,
        NumberInput,
        Checkbox,
        Input,
    } from 'flowbite-svelte';
    import { IconCash } from '@tabler/icons-svelte';
    import axios from 'axios';
    import { onMount } from 'svelte';
    -50;

    export let open, payer, refresh, loading;

    let description = '';
    let amount = '';
    let disabledSubmit = false;

    //function refreshSelectmenuPayers() {
    //    selectmenuPayers = [];
    //    payers.forEach(payer => {
    //        if (!selectedPayers.includes(payer.id)) {
    //            selectmenuPayers.push({value: payer.id, name: `${payer.firstName} ${payer.lastName}`})
    //        }
    //    })
    //}

    const postCreditRecord = async (e) => {
        loading = true;

        disabledSubmit = true;
        console.log(payer);
        await axios.post(
            `admin/payers/${payer}/credits`,
            JSON.stringify({
                description: description,
                amount: amount,
            })
        );

        description = '';
        amount = '';
        open = false;
        loading = false;
        disabledSubmit = false;
        await refresh();
    };
</script>

<Modal title="Přidání pohybu kreditů" bind:open size="xs" class="w-full">
    <form
        class="flex flex-col space-y-6"
        on:submit|preventDefault={postCreditRecord}
    >
        <Label class="space-y-2">
            <span>Popis</span>
            <ButtonGroup class="w-full">
                <Input
                    type="text"
                    placeholder="Vložení v hotovosti"
                    bind:value={description}
                />
            </ButtonGroup>
        </Label>
        <Label class="space-y-2">
            <span>Částka</span>
            <!-- info o tom, že lze odebrat pomocí - -->
            <span class="text-xs text-gray-500">
                Lze odebrat pomocí záporné hodnoty
            </span>

            <ButtonGroup class="w-full">
                <Input
                    type="number"
                    step="0.01"
                    placeholder="-25"
                    bind:value={amount}
                />
            </ButtonGroup>
        </Label>

        <Button
            color={amount > 0 ? 'green' : 'red'}
            disabled={!description || !amount || disabledSubmit}
            type="submit"
        >
            <IconCash class="mr-1" />
            {#if amount > 0}
                Přidat
            {:else}
                Odebrat
            {/if} kredity
        </Button>
    </form>
</Modal>
