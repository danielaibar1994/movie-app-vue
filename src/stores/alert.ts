import { defineStore } from 'pinia';

export type RootState = {
    alert: any | null;
};

export const useAlertStore = defineStore({
    id: 'alert',
    state: () => ({
        alert: null
    } as RootState),
    actions: {
        success(message: any) {
            this.alert = { message, type: 'alert-success' };
        },
        error(message: any) {
            this.alert = { message, type: 'alert-danger' };
        },
        clear() {
            this.alert = null;
        }
    }
});
