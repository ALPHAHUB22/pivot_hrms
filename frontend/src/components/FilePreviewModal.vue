<template>
	<ion-header>
		<ion-toolbar>
			<ion-title>{{ filename }} - File Preview</ion-title>
			<ion-buttons slot="end">
				<ion-button><a v-if="file.file_name" v-bind:href="file.file_url" :download="file.file_name">Download</a></ion-button>
				<ion-button @click="modalController.dismiss()">Close</ion-button>
			</ion-buttons>
		</ion-toolbar>
	</ion-header>
	<ion-content>
		<div class="bg-white h-full w-full overflow-auto touch-pinch-zoom">
			<div class="flex flex-row justify-center flex-wrap">
				<img :src="src" class="h-auto image-preview" />
				<!-- <iframe v-else :src="src" class="w-full image-preview"></iframe> -->
			</div>
		</div>
	</ion-content>
</template>

<script setup>
import { computed, onBeforeUnmount } from "vue"
import {
	IonHeader,
	IonToolbar,
	IonContent,
	IonButtons,
	IonTitle,
	IonButton,
	modalController,
} from "@ionic/vue"

const props = defineProps({
	file: {
		type: Object,
		required: true,
	},
})

const filename = computed(() => {
	return props.file.name
})

const src = computed(() => {
	return props.file.file_url
		? props.file.file_url
		: URL.createObjectURL(props.file)
})

const isImageFile = computed(() => {
	return /\.(gif|jpg|jpeg|tiff|png|svg)$/i.test(filename.value)
})

console.log(filename.value)
onBeforeUnmount(() => {
	URL.revokeObjectURL(src.value)
})
</script>

<style scoped>
.image-preview {
	image-orientation: from-image;
}
</style>
