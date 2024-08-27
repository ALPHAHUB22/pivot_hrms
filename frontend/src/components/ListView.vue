<template>
	<ion-header class="ion-no-border">
		<div class="w-full sm:w-96">
			<div
				class="flex flex-row bg-white shadow-sm py-4 px-3 items-center justify-between border-b"
			>
				<div class="flex flex-row items-center">
					<Button
						variant="ghost"
						class="!pl-0 hover:bg-white"
						@click="router.back()"
					>
						<FeatherIcon name="chevron-left" class="h-5 w-5" />
					</Button>
					<h2 class="text-xl font-semibold text-gray-900">{{ pageTitle }}</h2>
				</div>

				<div class="flex flex-row gap-2">
					<Button
						id="show-filter-modal"
						icon="filter"
						variant="subtle"
						:class="[
							areFiltersApplied
								? '!border !border-gray-800 !bg-white !text-gray-900 !font-semibold'
								: '',
						]"
					/>
					<router-link :to="{ name: formViewRoute }" v-slot="{ navigate }">
						<Button variant="solid" class="mr-2" @click="navigate">
							<template #prefix>
								<FeatherIcon name="plus" class="w-4" />
							</template>
							New
						</Button>
					</router-link>
				</div>
			</div>
		</div>
	</ion-header>

	<ion-content>
		<ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
			<ion-refresher-content></ion-refresher-content>
		</ion-refresher>

		<div
			class="flex flex-col items-center mb-7 p-4 h-full w-full sm:w-96 overflow-y-auto"
			ref="scrollContainer"
			@scroll="() => handleScroll()"
		>
		<div 
			class="flex flex-row w-full"
		>
			<div v-for="(field, index) in filterSchema" class="grow ms-1 pl-1">
				<strong class="grow ms-1 pl-1">{{ field.label }}</strong>
				<div v-for="(test_field, test_index) in filter_values.data">
					<Autocomplete 
						v-if="test_field.fieldname === field.fieldname"
						:key="index"
						:placeholder="`Choose ${field.label}`"
						v-model="specificItem[field.fieldname]"
						:options="test_field.values"
					/>
				</div>
			<hr>
			</div>
		</div>
			<div class="w-full mt-1">
				<Pagination
					:doctype="'Inventory Log'"
					:filters="appliedFilters"
				/>
				
			</div>
		</div>

		<CustomIonModal trigger="show-filter-modal">
			<!-- Filter Action Sheet -->
			<template #actionSheet>
				<ListFiltersActionSheet
					:filterConfig="filterConfig"
					@applyFilters="applyFilters"
					@clearFilters="clearFilters"
					v-model:filters="filterMap"
				/>
			</template>
		</CustomIonModal>
	</ion-content>
</template>

<script setup>
import { useRouter } from "vue-router"
import { inject, ref, markRaw, watch, computed, reactive, onMounted } from "vue"
import {
	modalController,
	IonHeader,
	IonContent,
	IonRefresher,
	IonRefresherContent,
} from "@ionic/vue"

import {
	FeatherIcon,
	createResource,
	LoadingIndicator,
	debounce,
	Autocomplete
} from "frappe-ui"

import Pagination from "@/components/Pagination.vue"
import ListFiltersActionSheet from "@/components/ListFiltersActionSheet.vue"
import CustomIonModal from "@/components/CustomIonModal.vue"

import useWorkflow from "@/composables/workflow"
import { useListUpdate } from "@/composables/realtime"
import ExistingItem from "./ExistingItem.vue"

const props = defineProps({
	doctype: {
		type: String,
		required: true,
	},
	fields: {
		type: Array,
		required: true,
	},
	groupBy: {
		type: String,
		required: false,
	},
	filterConfig: {
		type: Array,
		required: true,
	},
	tabButtons: {
		type: Array,
		required: true,
	},
	pageTitle: {
		type: String,
		required: true,
	},
	filter: {
		type: String,
	}
})

const listItemComponent = {
	"Inventory Log": markRaw(ExistingItem)
}
const router = useRouter()
const socket = inject("$socket")
const employee = inject("$employee")
const filterMap = reactive({})
const activeTab = ref(props.tabButtons[0])
const areFiltersApplied = ref(false)
const appliedFilters = ref([])
const workflowStateField = ref(null)

// infinite scroll
const scrollContainer = ref(null)
const hasNextPage = ref(true)
const listOptions = ref({
	doctype: props.doctype,
	fields: props.fields,
	group_by: props.groupBy,
	order_by: `\`tab${props.doctype}\`.modified desc`,
	page_length: 50,
})

// computed properties
const isTeamRequest = computed(() => {
	return activeTab.value === props.tabButtons[1]
})

const formViewRoute = computed(() => {
	return `${props.doctype.replace(/\s+/g, "")}FormView`
})

const detailViewRoute = computed(() => {
	return "InventoryLogDetailView"
})

const defaultFilters = computed(() => {
	const filters = []
	return filters
})

// resources
const documents = createResource({
	url: "pivot.api.get",
	onSuccess: (data) => {
		if (data.values?.length < listOptions.value.page_length) {
			hasNextPage.value = false
		}
	},
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

		let pagedData
		if (!documents.params.start || documents.params.start === 0) {
			pagedData = docs
		} else {
			pagedData = documents.data.concat(docs)
		}

		return pagedData
	},
})

const filterSchema = [
	{
		label: 'Item',
		fieldname: 'item_name',
		fieldtype: 'Link',
		options: 'Item',
		filterfieldname: "item_name"
	},
	{
		label: 'Building',
		fieldname: 'building',
		fieldtype: 'Link',
		options: 'Warehouse'
	}
]

const specificItem = ref({});

const filter_values = createResource({
	url: 'hrms.inventory.api.get_filter_values',
	params: {
		filterSchema: filterSchema
	},
	auto: true
})

watch(
	() => specificItem.value,
	(value) => {
		filterSchema.forEach((val) =>{
			if (value[val.fieldname]){
				filterMap[val.fieldname] = {
					condition: "=",
					value: value[val.fieldname].value,
				}
			}
			else{
				delete filterMap[val.fieldname]
			}
		})
		applyFilters()
	},
	{ deep: true }
)

// helper functions
function initializeFilters() {
	props.filterConfig.forEach((filter) => {
		filterMap[filter.fieldname] = {
			condition: "=",
			value: null,
		}
	})
	if (props.filter){
		appliedFilters.value = [[props.doctype, 'floor', '=', props.filter]]
		filterMap.floor.value = props.filter
	}
	else{
		appliedFilters.value = []
	}
}
initializeFilters()

function prepareFilters() {
	let condition = ""
	let value = ""
	appliedFilters.value = []

	for (const fieldname in filterMap) {
		condition = filterMap[fieldname].condition
		// accessing .value because autocomplete returns an object instead of value
		if (typeof condition === "object" && condition !== null) {
			condition = condition.value
		}

		value = filterMap[fieldname].value
		if (condition && value)
			appliedFilters.value.push([props.doctype, fieldname, condition, value])
	}
}

function applyFilters() {
	prepareFilters()
	fetchDocumentList()
	modalController.dismiss()
	areFiltersApplied.value = appliedFilters.value.length ? true : false
}

function clearFilters() {
	initializeFilters()
	fetchDocumentList()
	modalController.dismiss()
	areFiltersApplied.value = false
}

function fetchDocumentList(start = 0) {
	if (start === 0) {
		hasNextPage.value = true
	}

	const filters = [[props.doctype, "docstatus", "!=", "2"]]
	filters.push(...defaultFilters.value)

	if (appliedFilters.value) filters.push(...appliedFilters.value)

	if (workflowStateField.value) {
		listOptions.value.fields.push(workflowStateField.value)
	}

	documents.submit({
		...listOptions.value,
		start: start || 0,
		filters: filters,
	})
}

const handleScroll = debounce(() => {
	if (!hasNextPage.value) return

	const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
	const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100

	if (scrollPercentage >= 90) {
		const start = documents.params.start + listOptions.value.page_length
		fetchDocumentList(start)
	}
}, 500)

const handleRefresh = (event) => {
	setTimeout(() => {
		fetchDocumentList()
		event.target.complete()
	}, 500)
}

watch(
	() => activeTab.value,
	(_value) => {
		fetchDocumentList()
	}
)

onMounted(async () => {
	const workflow = useWorkflow(props.doctype)
	await workflow.workflowDoc.promise
	workflowStateField.value = workflow.getWorkflowStateField()
	fetchDocumentList()

	useListUpdate(socket, props.doctype, () => fetchDocumentList())
})
</script>
