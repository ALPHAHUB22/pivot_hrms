<template>
	<ion-page>
		<ion-content :fullscreen="true">
			<FormView
				v-if="formFields.data"
				doctype="Inventory Log"
				v-model="inventoryLog"
				:isSubmittable="false"
				:fields="formFields.data"
				:id="props.id"
				:showAttachmentView="true"
			/>
		</ion-content>
	</ion-page>
</template>

<script setup>
import { IonPage, IonContent } from "@ionic/vue"
import { createResource } from "frappe-ui"
import { ref, watch, inject } from "vue"

import FormView from "@/components/FormView.vue"

const dayjs = inject("$dayjs")
const employee = inject("$employee")
const today = dayjs().format("YYYY-MM-DD")

const props = defineProps({
	id: {
		type: String,
		required: false,
	},
})

// reactive object to store form data
const inventoryLog = ref({})

// get form fields
const formFields = createResource({
	url: "hrms.inventory.api.get_doctype_fields",
	params: { 
        doctype: "Inventory Log", 
        field_list: [
			"item_code", "item_name", "uom", "item_group", "qty", "building", "floor", 
			"depth", "width", "height", "diameter", "description", "tag", 
			"manufacturer", "finish_specification", "comments"
		]
    },
	transform(data) {
		let fields = getFilteredFields(data)

		return fields.map((field) => {

			const data = JSON.parse(sessionStorage.getItem('item_info'));
			var item_group, building, floor, manufacturer = ""
			if (data){
				item_group = data.item_group
				building = data.building
				floor =  data.floor
				manufacturer = data.manufacturer
			}
			if (field.fieldname === "item_group") field.default = item_group
			if (field.fieldname === "building") field.default = building
			if (field.fieldname === "floor") field.default = floor
			if (field.fieldname === "manufacturer") field.default = manufacturer
			return field
		})
	},
	// onSuccess(_data) {
	// 	leaveApprovalDetails.reload()
	// 	leaveTypes.reload()
	// },
})
formFields.reload()

function getFilteredFields(fields) {
	// reduce noise from the form view by excluding unnecessary fields
	// ex: employee and other details can be fetched from the session user
	const excludeFields = [
		"naming_series",
		"sb_other_details",
		"salary_slip",
		"letter_head",
	]

	return fields.filter((field) => !excludeFields.includes(field.fieldname))
}

const inventoryInfo = createResource({
	url: "pivot.api.get_inventory_info",
	params: {
		item: inventoryLog.value.item_code
	},
	onSuccess(data) {
		inventoryLog.value.item_name = data.item_name
		inventoryLog.value.uom = data.stock_uom
		inventoryLog.value.item_group = data.item_group
		inventoryLog.value.width = data.custom_width
		inventoryLog.value.height = data.custom_height
		inventoryLog.value.depth = data.custom_depth
		inventoryLog.value.diameter = data.custom_diameter
		inventoryLog.value.tag = data.custom_tag
		inventoryLog.value.manufacturer = data.custom_manufacturer
		inventoryLog.value.finish_specification = data.custom_finish_spec
		inventoryLog.value.description = data.custom_description
		inventoryLog.value.comments = data.custom_comments
		// setLeaveTypes(data)
	}
})

watch(
	() => inventoryLog.value.item_code,
	(item_code) => {
		if (item_code) {
			inventoryInfo.fetch({
				item: item_code,
			})
			if (inventoryLog.value.floor){
				stockBalance.fetch({
				item_code: inventoryLog.value.item_code,
				floor: inventoryLog.value.floor
			})
			}
		}
		else {
			inventoryLog.value.item_name = ""
			inventoryLog.value.width = ""
			inventoryLog.value.height = ""
			inventoryLog.value.depth = ""
			inventoryLog.value.diameter = ""
			inventoryLog.value.tag = ""
			inventoryLog.value.finish_specification = ""
			inventoryLog.value.description = ""
			inventoryLog.value.comments = ""
		}
	}
)

watch(
	() => inventoryLog.value.floor,
	(floor) => {
		if (floor) {
			stockBalance.fetch({
				item_code: inventoryLog.value.item_code,
				floor: inventoryLog.value.floor
			})
		}
	}
)

const stockBalance = createResource({
	url: "pivot.api.get_item_stock",
	params: {
		item_code: inventoryLog.value.item_code,
		floor: inventoryLog.value.floor,
	},
	onSuccess(data) {
		inventoryLog.value.qty = data
	}
})

</script>
