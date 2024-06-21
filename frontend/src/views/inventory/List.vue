<template>
	<ion-page>
		<ListView
			doctype="Item"
			pageTitle="Item List"
			:tabButtons="TAB_BUTTONS"
			:fields="LEAVE_FIELDS"
			:filterConfig="FILTER_CONFIG"
		/>
	</ion-page>
</template>

<script setup>
import { IonPage } from "@ionic/vue"
import ListView from "@/components/ListView.vue"

const TAB_BUTTONS = ["Item Details"]
const LEAVE_FIELDS = [
	"name",
	"item_code",
	"item_group",
	"stock_uom",
	"opening_stock",
]
const FILTER_CONFIG = [
	{
		fieldname: "item_group",
		fieldtype: "Link",
		label: "Item Group",
		options: "Item Group",
	}
]
</script>
