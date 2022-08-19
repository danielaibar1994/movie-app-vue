// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia';
// Import axios to make HTTP requests
import axios from "axios"
import type { Actor } from '@/models/actor.interface';

export type RootState = {
    items: Actor[];
    isLoading: boolean,
    isLoadingDetail: boolean,
    isUpdating: boolean,
    item: | undefined,
};

export const useActorsStore = defineStore({
    id: 'actors',
    state: () => ({
        items: [],
        item: undefined,
        isLoading: false,
        isLoadingDetail: false,
        isUpdating: false
    } as RootState),
    getters: {
        /**
         * @returns {Array<>}
         */
        get: (state) => { return state.items },
    },
    actions: {

        async fetchData() {
            // API path
            const basePath = import.meta.env.VITE_BASE_URL + '/actors';
            try {
                this.isLoading = true;
                const data = await axios.get(basePath)
                this.items = data.data
                this.isLoading = false;
            }
            catch (error) {
                alert(error)
                console.log(error)
                this.isLoading = false;
            }
        },

        async getDetail(Id: number) {
            // API path
            const basePath = import.meta.env.VITE_BASE_URL + '/actors/' + Id;
            this.item = undefined;
            try {
                this.isLoadingDetail = true;
                const data = await axios.get(basePath)
                this.item = data.data
                this.isLoadingDetail = false;
            }
            catch (error) {
                alert(error)
                console.log(error)
                this.isLoadingDetail = false;
            }
        },

        async update(Id: number, updated: number) {
            // API path
            const basePath = import.meta.env.VITE_BASE_URL + '//' + Id;
            this.isUpdating = true;

            try {
                const data = await axios.put(basePath, updated)
                this.item = data.data

                // actualizamos la data de la lista
                const index = this.findIndexById(Id);

                if (index !== -1) {
                    this.items[index] = data.data;
                }
                this.isUpdating = false;
            }
            catch (error) {
                alert(error)
                console.log(error)
                this.isUpdating = false;
            }
        },

        findIndexById(id: number) {
            return this.items.findIndex((item) => item.id === +id);
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useActorsStore, import.meta.hot))
}
