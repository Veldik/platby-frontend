<Modal title="QRCode pro zaplacení" bind:open={open} size="xs" class="w-full">
    <img src={data} alt="QRCode" class="w-full" />
</Modal>

<script>
    import {Modal} from 'flowbite-svelte'


    export let open, data, refresh, loading;

</script>
