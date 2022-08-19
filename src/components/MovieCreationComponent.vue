<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <h6>Create Movie</h6>
            </div>
            <div class="card-body">
                <VeeForm :validation-schema="schema" @submit="onSubmit">
                    <div>
                        <div class="form-group row">
                            <div class="col-6 my-1">
                                <label>Title:</label>
                                <Field id="title" name="title" type="text" class="form-control" :value="title"
                                    @input="updateProductInputAction" />
                                <ErrorMessage name="title" class="text-capitalize text-danger" />
                            </div>
                            <div class="col-6">
                                <label>Poster:</label>
                                <Field name="poster" type="text" class="form-control" :value="poster"
                                    @input="updateProductInputAction" />
                                <ErrorMessage name="poster" class="text-capitalize text-danger" />
                            </div>
                        </div>

                        <div class="form-group row my-1">
                            <div class="col-12">
                                <!-- genre -->
                                <GenreSelectorComponent :genresList="genreData" @addCategory="addCategory"
                                    @deleteCategory="deleteCategory" />
                            </div>

                            <div class="col-12">
                                <label>Year:</label>
                                <Field name="year" type="number" class="form-control" :value="year"
                                    @input="updateProductInputAction" />
                                <ErrorMessage name="year" class="text-capitalize text-danger" />
                            </div>
                            <div class="col-12">
                                <label>Duration:</label>
                                <Field name="duration" type="number" class="form-control" :value="duration"
                                    @input="updateProductInputAction" />
                                <ErrorMessage name="duration" class="text-capitalize text-danger" />
                            </div>

                            <div class="col-12">
                                <label>imdbRating:</label>
                                <Field name="imdbRating" type="number" min="0" max="10" class="form-control"
                                    :value="imdbRating" @input="updateProductInputAction" />
                                <ErrorMessage name="imdbRating" class="text-capitalize text-danger" />
                            </div>

                            <div class="col-12">
                                <!-- Actors -->
                                <ActorsSelectorComponent :actorsMovieList="actorsData" @addActor="addActor"
                                    @deleteActor="deleteActor" />
                            </div>
                            <div class="col-12">
                                <!-- Companies -->
                                <CompaniesSelectorComponent :companiesMovieList="companiesData" @addCompany="addCompany"
                                    @deleteCompany="deleteCompany" />
                            </div>
                        </div>
                        <div class="form-group my-3">
                            <router-link :to="{ path: `/movies` }" class="btn btn-secondary mr-2">
                                Cancelar
                            </router-link>
                            <button v-if="!isCreatingMovie" type="submit" class="btn btn-primary mx-2"> Guardar
                            </button>
                            <button v-if="isCreatingMovie" class="btn btn-primary" type="button" disabled>
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
import { computed, onMounted, ref } from 'vue';
import { useMoviesStore } from '../stores/movies';
import { useAlertStore } from '../stores/alert';
import { useActorsStore } from '../stores/actors';
import { useCompaniesStore } from '../stores/companies';
import { useRouter } from 'vue-router';
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
        const router = useRouter()
        const moviesStore = useMoviesStore();
        const actorsStore = useActorsStore();
        const companiesStore = useCompaniesStore();
        const { isCreatingMovie } = storeToRefs(moviesStore);

        const title = ref('');
        const poster = ref('');
        const genre = ref([]);
        const year = ref(1900);
        const duration = ref(60);
        const imdbRating = ref(1);
        const actors = ref([]);
        const companies = ref([]);

        // no reactive if not computed
        const genreData = computed(() => {
            return genre.value
        });
        const actorsData = computed(() => {
            return actors.value
        });
        const companiesData = computed(() => {
            return companies.value
        });


        // Define a validation schema
        const schema = Yup.object({
            title: Yup.string().required().min(5),
            poster: Yup.string().required(),
            year: Yup.number().required(),
            duration: Yup.number().required(),
            imdbRating: Yup.number().required(),
        });

        const updateProductInputAction = e => {
            // movieItem.value[e.target.name] = e.target.value;
            switch (e.target.name) {
                case 'title':
                    title.value = e.target.value;
                    break;
                case 'poster':
                    poster.value = e.target.value;
                    break;
                case 'duration':
                    duration.value = e.target.value;
                    break;
                case 'year':
                    year.value = e.target.value;
                    break;
                case 'imdbRating':
                    imdbRating.value = e.target.value;
                    break;
            }
        };

        async function onSubmit(values) {

            const newMovie = {
                title: title.value,
                poster: poster.value,
                genre: genre.value,
                year: year.value,
                duration: duration.value,
                imdbRating: imdbRating.value,
                actors: actors.value,
                companies: companies.value,
            }

            const alertStore = useAlertStore();
            try {
                const newId = await moviesStore.createMovie({ ...newMovie });
                router.push({ path: `/movies/${newId}` });
                alertStore.success('Movie Creation successful');
            } catch (error) {
                alertStore.error(error);
            }
        }



        // Genre Operations
        const addCategory = category => {
            if (category === "") {
                return;
            }
            genre.value.push(category);
        };

        const deleteCategory = category => {
            genre.value.filter(item => item !== category);
        }

        // Actors  Operations
        const addActor = actorId => {
            const index = actors.value.findIndex((actor) => { return actor === +actorId });

            if (index === -1) {
                if (!actors.value) {
                    actors.value = [];
                }
                actors.value.push(actorId);
            }
        }

        const deleteActor = actorId => {
            const index = actors.value.findIndex((actor) => actor === +actorId);

            if (index !== -1) {
                actors.value.splice(index, 1);
            }

        }

        // Companies  Operations
        const addCompany = companyId => {
            const index = companies.value.findIndex((company) => { return company === +companyId });

            if (index === -1) {
                if (!companies.value) {
                    companies.value = [];
                }
                companies.value.push(companyId);
            }
        }

        const deleteCompany = companyId => {
            const index = companies.value.findIndex((company) => company === +companyId);
            if (index !== -1) {
                companies.value.splice(index, 1);
            }
        }


        // antes de que se haya montado va a ejecutar una accion
        onMounted(async () => {
            actorsStore.fetchData();
            companiesStore.fetchData();
        })

        return {
            title,
            poster,
            genre,
            year,
            duration,
            imdbRating,
            actors,
            companies,
            genreData,
            actorsData,
            companiesData,
            schema,
            updateProductInputAction,
            onSubmit,
            addCategory,
            deleteCategory,
            addActor,
            deleteActor,
            deleteCompany,
            addCompany,
            isCreatingMovie
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