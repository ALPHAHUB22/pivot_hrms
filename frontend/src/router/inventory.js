const routes = [
	{
		name: "ItemFormView",
		path: "/inventory/new",
		component: () => import("@/views/inventory/Form.vue"),
	},
	{
		name: "ItemListView",
		path: "/items",
		component: () => import("@/views/inventory/List.vue"),
	},
	{
		name: "ItemDetailView",
		path: "/items/:id",
		props: true,
		component: () => import("@/views/inventory/Form.vue"),
	},
]

export default routes
