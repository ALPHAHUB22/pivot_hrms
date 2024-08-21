<template>
    <div class="hello">
        <div class="text-right text-sm font-normal pr-2 pt-2  pb-0">{{this.current_records}} of {{ total }}</div>
        <div
            class="flex flex-col bg-white rounded mt-5"
            v-if="!documents.loading && documents.data?.length"
        >
            <div
                class="p-3.5 items-center justify-between border-b cursor-pointer"
                v-for="link in documents.data"
                :key="link.name"
            >
            
                <router-link
                    :to="{ name: detailViewRoute, params: { id: link.name } }"
                    v-slot="{ navigate }"
                >
                    <component
                        :is="listItemComponent[doctype]"
                        :doc="link"
                        @click="navigate"
                    />
                </router-link>
            </div>
        </div>
        <EmptyState
            :message="`No Inventory's found`"
            v-else-if="!documents.loading"
        />
    </div>
    <vue3-tailwind-pagination
        :total="total"
        :per_page="perPage"
        :active_color="'text-black'"
        :active_background="'bg-gray-700'"
        :current_page="currentPage"
        @change="pageChange($event)"/>

</template>

<script>
// import VueTailwindPagination from '@ocrv/vue-tailwind-pagination'
import {Vue3TailwindPagination} from "vue-3-tailwind-css-pagination";
import { createResource } from "frappe-ui"
import { markRaw } from "vue"
import ExistingItem from "./ExistingItem.vue"

export default {
    props: {
        doctype:String,
        filters: Array
    },
    components:{
        Vue3TailwindPagination
    },
    data(){
        this.perPage = 10
        this.current_records = this.perPage
        return {
            currentPage:1,
            total: 50,
            documents: []
        }
    },
    methods:{
        pageChange(pageNumber){
            if (this.perPage*pageNumber < this.total){
                this.current_records = this.perPage*pageNumber
            }
            else{
                this.current_records = this.total
            }
            this.currentPage = pageNumber;
            this.limit_start = this.perPage * (pageNumber - 1)
            this.getData()
        },

        async getData(){
            var response = createResource({
                url: "pivot.api.get",
                auto:true,
                params: {
                    limit_start:this.limit_start,
                    page_length:this.perPage,
                    filters: this.filters
                },
                onSuccess: (data) => {
                    this.total = data[1]
                },
                transform(data) {
                    data = data[0]
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
                }
            })
            this.documents = response
        }
    },
    mounted(){
        this.detailViewRoute = "InventoryLogDetailView"
        this.listItemComponent = {
            "Inventory Log": markRaw(ExistingItem)
        }
        this.currentPage = 1
        this.limit_start = 1
        this.getData()
        this.$watch('filters', function() {
            this.limit_start = 0
            this.getData()
        })
    }
}
</script>