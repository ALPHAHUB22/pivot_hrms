import { createResource } from "frappe-ui"

import dayjs from "@/utils/dayjs"

const transformLeaveData = (data) => {
	return data.map((item) => {
		item.doctype = "Item"
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
		return transformLeaveData(data)
	},
	// onSuccess() {
	// 	leaveBalance.reload()
	// },
})