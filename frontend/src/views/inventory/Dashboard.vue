<template>
	<BaseLayout pageTitle="Inventory">
		<template #body>
            <div class="flex flex-col gap-7 mt-5 px-4 w-full">
                <div class="text-lg text-gray-800 font-bold">TurboTracker</div>

            </div>
			<div class="flex flex-col items-center mb-7 py-4">

				<div class="flex flex-col gap-7 px-4 w-full">
					<router-link
						:to="{ name: 'InventoryLogFormView' }"
						v-slot="{ navigate }"
					>
						<Button
							@click="navigate"
							variant="solid"
							class="py-5 text-base w-full"
						>
							+ Add / Update an Item
						</Button>
					</router-link>
					<div>
						<div class="text-lg text-gray-800 font-bold">Recent Items</div>
						<RequestList
							:component="markRaw(ExistingItem)"
							:items="itemList.data"
							:addListButton="true"
							listButtonRoute="InventoryLogListView"
						/>
					</div>
                    <!-- <div>
						<div class="text-lg text-gray-800 font-bold">Recent Items</div>
						<RequestList
							:component="markRaw(LeaveRequestItem)"
							:items="myLeaves.data"
							:addListButton="true"
							listButtonRoute="LeaveApplicationListView"
						/>
					</div> -->
				</div>
			</div>
		</template>
	</BaseLayout>
</template>

<script setup>
import { markRaw } from "vue"

import BaseLayout from "@/components/BaseLayout.vue"
import RequestList from "@/components/RequestList.vue"
import ExistingItem from "@/components/ExistingItem.vue"
import Holidays from "@/components/Holidays.vue"

import { itemList } from "@/data/inventory"
</script>
