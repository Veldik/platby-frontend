<script>
    import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';
    import { IconEdit } from '@tabler/icons-svelte';
    import axios from 'axios';

    export let open, data, refresh, loading;
    const editPayer = async (e) => {
        const data = new FormData(e.target);
        let json = {};

        for (let [key, value] of data.entries()) {
            json[key] = value;
        }

        loading = true;
        await axios.put(`admin/payers/${json.id}`, JSON.stringify(json));
        await refresh();
        open = false;
        loading = false;
    };
</script>

<Modal title="Úprava platiče" bind:open size="xs" class="w-full">
    <form class="flex flex-col space-y-6" on:submit|preventDefault={editPayer}>
        <Input type="hidden" name="id" bind:value={data.id} />
        <Label class="space-y-2">
            <span>Jméno</span>
            <Input
                type="text"
                name="firstName"
                placeholder="Josef"
                bind:value={data.firstName}
                required
            />
        </Label>
        <Label class="space-y-2">
            <span>Příjmení</span>
            <Input
                type="text"
                name="lastName"
                placeholder="Tesař"
                bind:value={data.lastName}
                required
            />
        </Label>
        <Label class="space-y-2">
            <span>Email</span>
            <Input
                type="email"
                name="email"
                placeholder="josef@tesar.cz"
                bind:value={data.email}
                required
            />
        </Label>
        <Button
            color="yellow"
            type="submit"
            disabled={!data.firstName || !data.lastName || !data.email}
        >
            <IconEdit class="mr-1" />
            Upravit platiče
        </Button>
    </form>
</Modal>
