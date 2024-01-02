<script>
    import Title from "$lib/components/title.svelte"
    import {Card, Listgroup, Avatar, Spinner, Tooltip} from "flowbite-svelte";
    import axios from "axios";


    import {onMount} from "svelte";

    let stats, data;
    let loadingStats = true;
    onMount(async () => {
        const response = await axios.get('admin/stats', {withCredentials: true})

        if (response.status === 200) {
            data = response.data.data;

            stats = [
                {
                    "title": "Platby",
                    "description": "Celkový počet plateb",
                    "value": data.payments
                },
                {
                    "title": "Platiči",
                    "description": "Celkový počet platičů",
                    "value": data.payers
                },
                {
                    "title": "Zaplaceno",
                    "description": "Celkem bylo zaplaceno",
                    "value": `${data.paid.amount} Kč`,
                    "tooltip": `${data.paid.records} plateb`
                },
                {
                    "title": "Nezaplaceno",
                    "description": "Celkem nebylo zaplaceno",
                    "value": `${data.unpaid.amount} Kč`,
                    "tooltip": `${data.unpaid.records} plateb`
                },
                {
                    "title": "Uživatelé",
                    "description": "Celkový počet uživatelů",
                    "value": data.users.total,
                    "tooltip": `${data.users.admins} adminů a ${data.users.users} platičů`
                },
                {
                    "title": "Kredity",
                    "description": "Celkový počet kreditů",
                    "value": `${new Intl.NumberFormat('cs-CZ', {
                            style: 'currency',
                            currency: 'CZK',
                            minimumFractionDigits: 0,
                        }).format(data.credits.amount.total)}`,
                    "tooltip": `${data.credits.records.total} pohybů`
                }
            ]

            loadingStats = false;
        }
    })

</script>

<Title title="Administrace"/>

{#if loadingStats}
    <div class="text-center mt-5">
        <Spinner color="yellow"/>
    </div>
{:else}
    <Card padding="xl" size="md" class="m-8">
        <div class="flex text-center mb-4">
            <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Statistiky</h5>
        </div>
        <Listgroup items={stats} let:item class="border-0 dark:!bg-transparent">
            <div class="flex items-center space-x-4">
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {item.title}
                    </p>
                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                        {item.description}
                    </p>
                </div>
                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
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

