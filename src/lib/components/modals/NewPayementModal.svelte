<Modal title="Vytvoření platby" bind:open={open} size="xs" class="w-full">
    <form class="flex flex-col space-y-6" on:submit|preventDefault={postPayment}>
        <Label class="space-y-2">
            <span>Název</span>
            <ButtonGroup class="w-full">
                <Input type="text" placeholder="Kulečník" bind:value={title} required/>
            </ButtonGroup>
        </Label>
        <Label class="space-y-2">
            <span>Popis</span>
            <ButtonGroup class="w-full">
                <Input type="text" placeholder="Hospůdka U Tří koní" bind:value={description}/>
            </ButtonGroup>
        </Label>

        <Label class="space-y-2">
            <span>Celková částka</span>
            <ButtonGroup class="w-full">
                <NumberInput placeholder="1350" bind:value={totalAmount} required/>
                <InputAddon>Kč</InputAddon>
            </ButtonGroup>
            <Checkbox color="yellow" bind:checked={amIPayer}>Platím taky</Checkbox>
        </Label>

        <Label class="space-y-2">
            <span>Výběr příjemců</span>
            <Select items={selectmenuPayers} bind:value={selected} placeholder="Vyber platiče"
                    on:change="{() => {selectmenuPayers = selectmenuPayers.filter(item => item['value'] !== selected); selectedPayers = [...selectedPayers, selected]; selected = ''}}"></Select>
        </Label>

        <div class="">
            {#each payers.filter(item => selectedPayers.includes(item.id)) as payer}
                <ButtonGroup class="w-full pb-1">
                    <Button on:click="{ () => {console.log(`${payer.id} ${payer.firstName} ${payer.lastName}`); selectedPayers = selectedPayers.filter(item => item !== payer.id); selectmenuPayers = [...selectmenuPayers, {value: payer.id, name: `${payer.firstName} ${payer.lastName}`}]}}"
                            color="red">
                        <IconX/>
                    </Button>
                    <InputAddon class="w-full">{payer.firstName} {payer.lastName}</InputAddon>
                    <NumberInput class="w-16 border-0" value={ Math.ceil(totalAmount / (selectedPayers.length + (amIPayer ? 1 : 0)))}
                                 id={payer.id} required/>
                    <InputAddon>Kč</InputAddon>
                </ButtonGroup>
            {/each}
        </div>

        <Button color="yellow" disabled={selectedPayers.length === 0 || !title || disabledSubmit} type="submit">
            <IconCash class="mr-1"/>
            Vytvořit platbu
        </Button>
    </form>
</Modal>

<script>
    import {Button, Modal, Label, Select, ButtonGroup, InputAddon, NumberInput, Checkbox, Input} from 'flowbite-svelte'
    import {IconX, IconCash} from "@tabler/icons-svelte";
    import axios from "axios";
    import {onMount} from "svelte";

    export let open, refresh, loading;
    let data = {}
    let payers = [];
    let selectedPayers = [];
    let selectmenuPayers = [];
    let selected;
    let totalAmount;
    let amIPayer = true;
    let title, description = "";
    let disabledSubmit = false;

    onMount(async () => {
        const payersResponse = await axios.get('admin/payers', {withCredentials: true});

        if (payersResponse.status === 200) {
            payersResponse.data.data.forEach(payer => {
                payers.push(payer);
                selectmenuPayers.push({value: payer.id, name: `${payer.firstName} ${payer.lastName}`})
            })
        }
    })

    function refreshSelectmenuPayers() {
        selectmenuPayers = [];
        payers.forEach(payer => {
            if (!selectedPayers.includes(payer.id)) {
                selectmenuPayers.push({value: payer.id, name: `${payer.firstName} ${payer.lastName}`})
            }
        })
    }

    const postPayment = async (e) => {

        const data = new FormData(e.target)
        let json = {};

        for (let [key, value] of data.entries()) {
            json[key] = value;
        }


        loading = true

        let postPayers = [];
        selectedPayers.forEach(selectedPayer => {
            postPayers.push({
                "id": selectedPayer,
                "amount": document.getElementById(selectedPayer).value
            })
        })

        disabledSubmit = true;
        await axios.post(`admin/payments`, JSON.stringify({
            "title": title,
            "description": description,
            "payers": postPayers
        }))
        selectedPayers = [];
        selectmenuPayers = [];
        selected = [];
        totalAmount = null;
        amIPayer = true;
        title = "";
        description = "";
        open = false;
        loading = false;
        disabledSubmit = false;
        refreshSelectmenuPayers();
        await refresh();
    };

</script>
