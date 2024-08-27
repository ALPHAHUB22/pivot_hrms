import { createRouter, createWebHistory } from "@ionic/vue-router"

import TabbedView from "@/views/TabbedView.vue"
import inventoryItems from "./inventory"

const routes = [
	{
		path: "/",
		redirect: "/home",
	},
	{
		path: "/",
		component: TabbedView,
		children: [
			{
				path: "",
				redirect: "/home",
			},
			{
				path: "/home",
				name: "Home",
				component: () => import("@/views/Home.vue"),
			},
			{
				path: "/dashboard/inventory",
				name: "InventoryLogDashboard",
				component: () => import("@/views/inventory/List.vue"),
			},
		],
	},
	{
		path: "/login",
		name: "Login",
		component: () => import("@/views/Login.vue"),
	},
	{
		path: "/profile",
		name: "Profile",
		component: () => import("@/views/Profile.vue"),
	},
	{
		path: "/notifications",
		name: "Notifications",
		component: () => import("@/views/Notifications.vue"),
	},
	{
		path: "/settings",
		name: "Settings",
		component: () => import("@/views/AppSettings.vue"),
	},
	{
		path: "/invalid-employee",
		name: "InvalidEmployee",
		component: () => import("@/views/InvalidEmployee.vue"),
	},
	...inventoryItems
]

const router = createRouter({
	history: createWebHistory("/hrms"),
	routes,
})

export default router
