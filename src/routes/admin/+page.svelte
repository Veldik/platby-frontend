<script>
    import Title from '$lib/components/title.svelte';
    import { Card, Listgroup, Avatar, Spinner, Tooltip } from 'flowbite-svelte';
    import axios from 'axios';

    import { onMount } from 'svelte';

    let stats, data;
    let loadingStats = true;
    onMount(async () => {
        const response = await axios.get('admin/stats', {
            withCredentials: true,
        });

        if (response.status === 200) {
            data = response.data.data;

            stats = [
                {
                    title: 'Platby',
                    description: 'Celkový počet plateb',
                    value: data.payments,
                    tooltip: `${data.total.records} platebních záznamů`,
                },
                {
                    title: 'Platiči',
                    description: 'Celkový počet platičů',
                    value: data.payers,
                },
                {
                    title: 'Zaplaceno',
                    description: 'Celkem bylo zaplaceno',
                    value: `${new Intl.NumberFormat('cs-CZ', {
                        style: 'currency',
                        currency: 'CZK',
                        minimumFractionDigits: 0,
                    }).format(data.paid.amount)}`,
                    tooltip: `${data.paid.records} plateb`,
                },
                {
                    title: 'Nezaplaceno',
                    description: 'Celkem nebylo zaplaceno',
                    value: `${new Intl.NumberFormat('cs-CZ', {
                        style: 'currency',
                        currency: 'CZK',
                        minimumFractionDigits: 0,
                    }).format(data.unpaid.amount)}`,
                    tooltip: `${data.unpaid.records} plateb`,
                },
                {
                    title: 'Uživatelé',
                    description: 'Celkový počet uživatelů',
                    value: data.users.total,
                    tooltip: `${data.users.admins} adminů a ${data.users.users} platičů`,
                },
                {
                    title: 'Kredity',
                    description: 'Celkový počet kreditů',
                    value: `${new Intl.NumberFormat('cs-CZ', {
                        style: 'currency',
                        currency: 'CZK',
                        minimumFractionDigits: 0,
                    }).format(data.credits.amount.total)}`,
                    tooltip: `${data.credits.records.total} pohybů`,
                },
            ];

            loadingStats = false;
        }
    });
</script>

<Title title="Administrace" />

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
