<template>
    <div v-if="isLoadingMovieDetail || isDeletingMovie" class="loading-container">
        <RingLoaderComponent />
    </div>

    <div v-if="(!isLoadingMovieDetail && movieItem) && !isDeletingMovie">
        <div class="card" style="width: 60vw; margin: 0 auto;">
            <img class="card-img-top" v-bind:src="movieItem.poster" alt="{{movieItem.title}}">
            <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <div class="tags-container" style="margin: 8px 0;">
                    <button v-for="genre of movieItem.genre" :key="genre" type="button" class="btn btn-primary">
                        {{ genre }}
                    </button>
                </div>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <h5>Actores: </h5>
                    <p v-for="actor of movieItem.actors" :key="actor.id">{{ getActorName(actor) }}</p>
                </li>
                <li class="list-group-item">
                    <h5>Compañia: </h5>
                    <p v-for="company of movieItem.companies" :key="company.id">{{ getCompanyName(company) }}</p>
                </li>

            </ul>
            <div class="card-body">
                <router-link class="btn btn-primary" :to="{ path: `/movies/edit/${movieItem.id}` }">
                    Editar
                </router-link>
                <button class="btn btn-danger" @click="doDelete(movieItem.id)">Delete</button>

            </div>
        </div>
    </div>
    <ConfirmDialogue ref="confirmDialogue" />
</template>
<script>
import { onMounted, computed, ref } from 'vue'
import { useMoviesStore } from '../stores/movies'
import { useActorsStore } from '../stores/actors';
import { useAlertStore } from '../stores/alert';
import { useCompaniesStore } from '../stores/companies';
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import RingLoaderComponent from '@/components/loaders/RingLoaderComponent.vue'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'


export default {
    components: { RingLoaderComponent, ConfirmDialogue },
    methods: {
        // async doDelete() {
        //     const ok = await this.$refs.confirmDialogue.show({
        //         title: 'Delete Movie',
        //         message: 'Are you sure you want to delete this movie? It cannot be undone.',
        //         okButton: 'Delete',
        //     })
        //     // If you throw an error, the method will terminate here unless you surround it wil try/catch
        //     if (ok) {
        //         // alert('You have successfully delete this movie.')
        //     } else {
        //         // alert('You chose not to delete this page. Doing nothing now.')
        //     }
        // },
    },
    setup() {
        const route = useRoute();
        const router = useRouter()
        const moviesStore = useMoviesStore();
        const actorsStore = useActorsStore();
        const companiesStore = useCompaniesStore();

        const confirmDialogue = ref(null);

        // For not lost reactivity
        const { movieItem, isLoadingMovieDetail, isDeletingMovie } = storeToRefs(moviesStore);
        const { items } = storeToRefs(companiesStore);

        const actorsItems = computed(() => {
            return actorsStore.items
        });

        const getCompanyName = companyId => {
            const index = companiesStore.findIndexById(companyId);
            if (index !== -1) {
                return items.value[index].name;
            }
            return '(' + companyId + ')';
        }

        const getActorName = actorId => {
            const index = actorsStore.findIndexById(actorId);
            if (index !== -1) {
                return actorsItems.value[index].first_name + ' ' + actorsItems.value[index].last_name;
            }
            return '(' + actorId + ')';
        }

        async function doDelete(movieId) {
            const ok = await confirmDialogue.value.show({
                title: 'Delete Movie',
                message: 'Are you sure you want to delete this movie? It cannot be undone.',
                okButton: 'Delete',
            })
            // If you throw an error, the method will terminate here unless you surround it wil try/catch
            if (ok) {
                const alertStore = useAlertStore();
                try {
                    await moviesStore.deleteMovie(movieId);
                    alertStore.success('Movie Creation successful');
                    router.push({ path: `/movies` });
                } catch (error) {
                    alertStore.error(error);
                }
            }
        }



        // antes de que se haya montado va a ejecutar una accion
        onMounted(async () => {
            const id = route.params.id;
            moviesStore.getMovieDetail(id);
            actorsStore.fetchData();
            companiesStore.fetchData();
        })

        return { movieItem, isLoadingMovieDetail, isDeletingMovie, getCompanyName, getActorName, doDelete, confirmDialogue }
    }

}
</script>
<style>
</style>