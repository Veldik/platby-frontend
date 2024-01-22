<script>
    import Title from '$lib/components/title.svelte';
    import { Card, Listgroup, Avatar, Spinner, Tooltip } from 'flowbite-svelte';
    import axios from 'axios';

    import { onMount } from 'svelte';

    let stats, data;
    let loadingStats = true;
    onMount(async () => {
        const response = await axios.get('payer', { withCredentials: true });

        if (response.status === 200) {
            data = response.data.data.status;
            console.log(response.data);

            stats = [
                {
                    title: 'Zaplaceno',
                    description: 'Celkem jsi zaplatil',
                    value: `${data.paid.amount} Kč`,
                    tooltip: `${data.paid.records} plateb`,
                },
                {
                    title: 'Nezaplaceno',
                    description: 'Celkem ti zbývá zaplatit',
                    value: `${data.unpaid.amount} Kč`,
                    tooltip: `${data.unpaid.records} plateb`,
                },
            ];

            loadingStats = false;
        }
    });
</script>

<Title title="Uživatelské rozhraní" />

{#if loadingStats}
    <div class="mt-5 text-center">
        <Spinner color="yellow" />
    </div>
{:else}
    <Card padding="xl" size="md" class="m-8">
        <div class="mb-4 flex text-center">
            <h5
                class="text-xl font-bold leading-none text-gray-900 dark:text-white"
            >
                Statistiky
            </h5>
        </div>
        <Listgroup items={stats} let:item class="border-0 dark:!bg-transparent">
            <div class="flex items-center space-x-4">
                <div class="min-w-0 flex-1">
                    <p
                        class="truncate text-sm font-medium text-gray-900 dark:text-white"
                    >
                        {item.title}
                    </p>
                    <p
                        class="truncate text-sm text-gray-500 dark:text-gray-400"
                    >
                        {item.description}
                    </p>
                </div>
                <div
                    class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
                >
                    {item.value}
                </div>
                {#if item.tooltip}
                    <Tooltip>
                        {item.tooltip}
                    </Tooltip>
                {/if}
            </div>
        </Listgroup>
    </Card>
{/if}
