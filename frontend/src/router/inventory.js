const routes = [
	{
		name: "InventoryLogFormView",
		path: "/inventory/new",
		component: () => import("@/views/inventory/Form.vue"),
	},
	{
		name: "InventoryLogListView",
		path: "/items/",
		component: () => import("@/views/inventory/List.vue"),
	},
	{
		name: "InventoryLogBuildingListView",
		path: "/items/building/:filter",
		props: true,
		component: () => import("@/views/inventory/List.vue"),
	},
	{
		name: "InventoryLogDetailView",
		path: "/items/:id",
		props: true,
		component: () => import("@/views/inventory/Form.vue"),
	},
]

export default routes
