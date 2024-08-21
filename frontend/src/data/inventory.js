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
	url: "pivot.api.get",
	params: {
		limit: 25,
	},
	auto: true,
	transform(data) {
		data = data[0]
		if (data.length === 0) {
			return []
		}

		// convert keys and values arrays to docs object
		const fields = data["keys"]
		const values = data["values"]
		const docs = values.map((value) => {
			const doc = {}
			fields.forEach((field, index) => {
				doc[field] = value[index]
			})
			return doc
		})
		return docs
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
				title: data[i].floor,
				route: "InventoryLogBuildingListView",
			}
			quickLinks.push(t)
		}
		quickLinks = JSON.parse(JSON.stringify(quickLinks))
		return quickLinks
	}
})