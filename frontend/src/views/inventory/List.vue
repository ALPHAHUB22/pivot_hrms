<template>
	<ion-page>
		<ListView
			doctype="Inventory Log"
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
	"qty",
	"building",
	"floor",
	"manufacturer",
	"tag",
	"depth",
	"width",
	"diameter",
	"height",
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
		fieldname: "floor",
		fieldtype: "Link",
		label: "Floor",
		options: "Warehouse"
	}
]
</script>
