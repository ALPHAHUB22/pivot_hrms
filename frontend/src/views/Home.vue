<template>
	<BaseLayout>
		<template #body>
			<div class="flex flex-col items-center my-7 p-4 gap-7">
				<CheckInPanel />
				<QuickLinks :items="quickLinks" title="Quick Links" />
				<!-- <BuildingQuickLinks :items="buildingList.data" title="Recent Warehouses" /> -->
				<!-- <RequestPanel /> -->
			</div>
		</template>
	</BaseLayout>
</template>

<script setup>
import { markRaw } from "vue"
import CheckInPanel from "@/components/CheckInPanel.vue"
import QuickLinks from "@/components/QuickLinks.vue"
import BuildingQuickLinks from "@/components/BuildingQuickLinks.vue"
import BaseLayout from "@/components/BaseLayout.vue"
import RequestPanel from "@/components/RequestPanel.vue"
import LeaveIcon from "@/components/icons/LeaveIcon.vue"
import ExpenseIcon from "@/components/icons/ExpenseIcon.vue"
import EmployeeAdvanceIcon from "@/components/icons/EmployeeAdvanceIcon.vue"
import SalaryIcon from "@/components/icons/SalaryIcon.vue"
import { buildingList } from "@/data/inventory"

var quickLinks = [
	{
		icon: markRaw(EmployeeAdvanceIcon),
		title: "+ Add Item",
		route: "InventoryLogFormView",
	},	
	{
		icon: markRaw(LeaveIcon),
		title: "View Items",
		route: "InventoryLogListView",
	}
]
</script>
