<template>
	<ion-page>
		<ListView
			doctype="Item"
			pageTitle="Item List"
			:tabButtons="TAB_BUTTONS"
			:fields="ITEM_FIELDS"
			:filterConfig="FILTER_CONFIG"
			:filter="props.filter"
		/>
	</ion-page>
</template>

<script setup>
import { IonPage } from "@ionic/vue"
import ListView from "@/components/ListView.vue"

const props = defineProps({
	filter: {
		type: String,
	}
})

const TAB_BUTTONS = ["Item Details"]
const ITEM_FIELDS = [
	"name",
	"item_code",
	"item_group",
	"stock_uom",
	"opening_stock",
	"custom_building",
	"custom_floor",
	"description"
]
const FILTER_CONFIG = [
	{
		fieldname: "item_group",
		fieldtype: "Link",
		label: "Item Group",
		options: "Item Group",
	},
	{
		fieldname: "custom_building",
		fieldtype: "Link",
		label: "Building",
		options: "Warehouse"
	}
]
</script>
