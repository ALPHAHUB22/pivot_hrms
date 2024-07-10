<template>
	<div class="flex flex-col gap-3 py-4">
		<label class="file-select">
			<h2 class="text-base font-semibold text-gray-800 pb-4">Attachments</h2>
			<div class="select-button cursor-pointer">
				<div
					class="flex flex-col w-full border shadow-sm items-center rounded p-3 gap-2"
				>
					<FeatherIcon name="upload" class="h-6 w-6 text-gray-700" />
					<span class="block text-sm font-normal leading-5 text-gray-700">
						Upload images or documents
					</span>
				</div>
				<input
					class="hidden"
					ref="input"
					type="file"
					multiple
					accept="*"
					@change="(e) => emit('handle-file-select', e)"
				/>
			</div>
		</label>

		<div v-if="modelValue.length" class="w-full">
			<ul class="w-full flex flex-row justify-evenly gap-5 gap-y-8 flex-wrap">
				<li
					class="basis-1/4"
					v-for="(file, index) in modelValue"
					:key="index"
				>
					<div class="gap-y-8">
						<div
							class="flex flex-row text-sm justify-end flex-wrap gap-1.5"
						>
							<a v-bind:href="file.file_url" :download="file.file_name">
								<FeatherIcon name="download" class="h-5 w-5 text-gray-700" />
							</a>
							<FeatherIcon
								name="x"
								class="h-5 w-5 cursor-pointer text-gray-700"
								@click="() => confirmDeleteAttachment(file)"
							/>
						</div>
						<span class="grow" @click="showFilePreview(file)">
							<img id="image" v-bind:src="file.file_url" alt="image" class="flex flex-row h-30 w-30 text-gray-500">
						</span>
					</div>
				</li>
			</ul>

			<Dialog v-model="showDialog">
				<template #body-title>
					<h2 class="text-lg font-bold">Delete Attachment</h2>
				</template>
				<template #body-content>
					<p>
						Are you sure you want to delete the attachment
						<span class="font-bold">{{ selectedFile.file_name }}</span>
						?
					</p>
				</template>
				<template #actions>
					<div class="flex flex-row gap-4">
						<Button
							variant="outline"
							class="py-5 w-full"
							@click="showDialog = false"
						>
							Cancel
						</Button>
						<Button
							variant="solid"
							theme="red"
							@click="handleFileDelete"
							class="py-5 w-full"
						>
							Delete
						</Button>
					</div>
				</template>
			</Dialog>

			<!-- File Preview Modal -->
			<ion-modal
				ref="modal"
				:is-open="showPreviewModal"
				@didDismiss="showPreviewModal = false"
			>
				<FilePreviewModal :file="selectedFile" />
			</ion-modal>
		</div>
	</div>
</template>

<script setup>
import { FeatherIcon, Dialog } from "frappe-ui"
import { ref } from "vue"
import { IonModal } from "@ionic/vue"

import FilePreviewModal from "@/components/FilePreviewModal.vue"

const props = defineProps({
	modelValue: {
		type: Object,
		required: true,
	},
})
let showDialog = ref(false)
let showPreviewModal = ref(false)
let selectedFile = ref({})

const emit = defineEmits(["handle-file-select", "handle-file-delete"])

function showFilePreview(fileObj) {
	selectedFile.value = fileObj
	showPreviewModal.value = true
}

function confirmDeleteAttachment(fileObj) {
	selectedFile.value = fileObj
	showDialog.value = true
}

function handleFileDelete() {
	emit("handle-file-delete", selectedFile.value)
	showDialog.value = false
}
</script>

<style scoped>
ion-modal {
	--height: 100%;
}
</style>
