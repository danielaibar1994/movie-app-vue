<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <h6>Edit Movie</h6>
            </div>
            <div class="card-body">
                <VeeForm :validation-schema="schema" @submit="onSubmit">
                    <div v-if="isLoadingMovieDetail">
                        <div class="text-center">
                            <div class="spinner-border text-primary" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <br>
                            Loading Movie Detail
                        </div>
                    </div>
                    <div v-if="movieItem && !isLoadingMovieDetail">
                        <div class="form-group row">
                            <div class="col-6 my-1">
                                <label>Title:</label>
                                <Field id="title" name="title" type="text" class="form-control" :value="movieItem.title"
                                    @input="updateProductInputAction" />
                                <ErrorMessage name="title" class="text-capitalize text-danger" />
                            </div>
                            <div class="col-6">
                                <label>Poster:</label>
                                <Field name="poster" type="text" class="form-control" :value="movieItem.poster"
                                    @input="updateProductInputAction" />
                                <ErrorMessage name="poster" class="text-capitalize text-danger" />
                            </div>
                        </div>

                        <div class="form-group row my-1">
                            <div class="col-12">
                                <!-- genre -->
                                <GenreSelectorComponent :genresList="movieItem.genre" @addCategory="addCategory"
                                    @deleteCategory="deleteCategory" />
                            </div>

                            <div class="col-12">
                                <label>Year:</label>
                                <Field name="year" type="number" class="form-control" :value="movieItem.year"
                                    @input="updateProductInputAction" />
                                <ErrorMessage name="year" class="text-capitalize text-danger" />
                            </div>
                            <div class="col-12">
                                <label>Duration:</label>
                                <Field name="duration" type="number" class="form-control" :value="movieItem.duration"
                                    @input="updateProductInputAction" />
                                <ErrorMessage name="duration" class="text-capitalize text-danger" />
                            </div>

                            <div class="col-12">
                                <label>imdbRating:</label>
                                <Field name="imdbRating" type="number" min="0" max="10" class="form-control"
                                    :value="movieItem.imdbRating" @input="updateProductInputAction" />
                                <ErrorMessage name="imdbRating" class="text-capitalize text-danger" />
                            </div>

                            <div class="col-12">
                                <!-- Actors -->
                                <ActorsSelectorComponent :actorsMovieList="movieItem.actors" @addActor="addActor"
                                    @deleteActor="deleteActor" />
                            </div>
                            <div class="col-12">
                                <!-- Companies -->
                                <CompaniesSelectorComponent :companiesMovieList="movieItem.companies"
                                    @addCompany="addCompany" @deleteCompany="deleteCompany" />
                            </div>
                        </div>
                        <div class="form-group my-3">
                            <router-link :to="{ path: `/movies/${movieItem.id}` }" class="btn btn-secondary mr-2">
                                Cancelar
                            </router-link>
                            <button v-if="!isUpdatingMovie" type="submit" class="btn btn-primary mx-2"> Guardar
                            </button>
                            <button v-if="isUpdatingMovie" class="btn btn-primary" type="button" disabled>
                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                Saving...
                            </button>
                        </div>
                    </div>
                </VeeForm>
            </div>
        </div>
    </div>
</template>
<script>
import { onMounted } from 'vue';
import { useMoviesStore } from '../stores/movies';
import { useAlertStore } from '../stores/alert';
import { useActorsStore } from '../stores/actors';
import { useCompaniesStore } from '../stores/companies';
import { useRoute } from 'vue-router';
import { Field, Form as VeeForm, ErrorMessage } from "vee-validate";
import * as Yup from 'yup';
import { storeToRefs } from 'pinia'

// Components
import GenreSelectorComponent from "./GenreSelectorComponent.vue";
import ActorsSelectorComponent from "./ActorsSelectorComponent.vue";
import CompaniesSelectorComponent from "./CompaniesSelectorComponent.vue";


export default {

    components: {
        Field,
        VeeForm,
        ErrorMessage,
        GenreSelectorComponent,
        ActorsSelectorComponent,
        CompaniesSelectorComponent
    },

    setup() {
        const route = useRoute();
        const moviesStore = useMoviesStore();
        const actorsStore = useActorsStore();
        const companiesStore = useCompaniesStore();

        // For not lost reactivity
        const { movieItem, isLoadingMovieDetail, isUpdatingMovie } = storeToRefs(moviesStore);

        // Define a validation schema
        const schema = Yup.object({
            title: Yup.string().required().min(5),
            poster: Yup.string().required(),
            year: Yup.number().required(),
            duration: Yup.number().required(),
            imdbRating: Yup.number().required(),
        });

        const updateProductInputAction = e => {
            movieItem.value[e.target.name] = e.target.value;
        };

        async function onSubmit(values) {

            const alertStore = useAlertStore();
            try {
                await moviesStore.updateMovie(movieItem.value.id, { ...movieItem.value });
                // await router.push('/account/login');
                alertStore.success('Movie Edition successful');
            } catch (error) {
                alertStore.error(error);
            }
        }

        // Genre Operations
        const addCategory = category => {
            moviesStore.addGenreMovie(category);
        };

        const deleteCategory = category => {
            moviesStore.deleteCategory(category);
        }

        // Actors  Operations
        const addActor = actorId => {
            moviesStore.addActor(actorId);
        }

        const deleteActor = actorId => {
            moviesStore.deleteActor(actorId);
        }

        // Companies  Operations
        const addCompany = companyId => {
            moviesStore.addCompany(companyId);
        }

        const deleteCompany = companyId => {
            moviesStore.deleteCompany(companyId);
        }


        // antes de que se haya montado va a ejecutar una accion
        onMounted(async () => {
            const id = route.params.id;
            moviesStore.getMovieDetail(id);
            actorsStore.fetchData();
            companiesStore.fetchData();
        })

        return {
            movieItem,
            isLoadingMovieDetail,
            isUpdatingMovie,
            schema,
            updateProductInputAction,
            onSubmit,
            addCategory,
            deleteCategory,
            addActor,
            deleteActor,
            deleteCompany,
            addCompany
        }
    }

}
</script>
<style scoped>
.card {
    color: black;
}

.btn.btn-primary {
    margin-right: 8px;
}

.badge {
    margin-left: 8px;
}

.visible {
    display: block;
}

.dropdown-menu {
    max-height: 200px;
    overflow-x: auto;
}

.dropdown-menu li {
    padding: 0 8px;
    cursor: pointer;
}

.dropdown-menu li:hover {
    background-color: lightgray;
}
</style>