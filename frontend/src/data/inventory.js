import { createResource } from "frappe-ui"
import { markRaw } from "vue"
import LeaveIcon from "@/components/icons/LeaveIcon.vue"
import dayjs from "@/utils/dayjs"

const transformData = (data) => {
	return data.map((item) => {
		item.doctype = "Inventory Log"
		return item
	})
}

export const itemList = createResource({
	url: "hrms.inventory.api.get_item_info",
	params: {
		limit: 10,
	},
	auto: true,
	transform(data) {
		return transformData(data)
	},
	// onSuccess() {
	// 	leaveBalance.reload()
	// },
})

export const buildingList = createResource({
	url: "hrms.inventory.api.get_warehouse_info",
	params: {
		limit: 3,
	},
	auto: true,
	transform(data) {
		let quickLinks = []
		for(let i=0; i<data.length; i++){
			let t = {
				icon: markRaw(LeaveIcon),
				title: data[i].custom_building,
				route: "InventoryLogBuildingListView",
			}
			quickLinks.push(t)
		}
		quickLinks = JSON.parse(JSON.stringify(quickLinks))
		return quickLinks
	}
})