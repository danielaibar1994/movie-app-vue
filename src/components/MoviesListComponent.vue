<template >
    <div class="container movies-container">
        <div v-if="isLoadingMovies" class="loading-container">
            <RingLoaderComponent />
        </div>
        <div class="row movies-row" v-if="!isLoadingMovies">
            <div v-for="movie of items" :key="movie.id" class="card">
                <img class="card-img-top" :src="movie.poster ? movie.poster : '/images/not_found.png'"
                    v-bind:alt="movie.title" @error="imgPlaceholder">
                <div class="card-body">
                    <h5 class="card-title">{{ movie.title }}</h5>
                    <router-link class="btn btn-primary" :to="{ path: `/movies/${movie.id}` }">
                        View
                    </router-link>
                </div>
            </div>
        </div>
    </div>

    <!-- New movie button -->
    <router-link class="float" :to="{ path: `/movies/create` }">
        <i class="my-float"> &plus;</i>
    </router-link>

</template>
<script>
import { useMoviesStore } from '../stores/movies'
import { storeToRefs } from 'pinia'
import RingLoaderComponent from '@/components/loaders/RingLoaderComponent.vue'
export default {

    components: { RingLoaderComponent },
    setup() {
        const moviesStore = useMoviesStore();
        const { items, isLoadingMovies } = storeToRefs(moviesStore);

        const imgPlaceholder = (e) => {
            e.target.src = "/images/not_found.png"
        }

        // if you want that when navigate to /movies reload the movies store, 
        // you need to add onMounted here
        return { items, isLoadingMovies, imgPlaceholder }
    }
}
</script>
<style>
.card {
    color: black;
    width: 18rem;
    margin: 8px;
}

.card-img-top {
    aspect-ratio: 9/10;
    object-fit: cover;
}

.loading-container {
    margin: 0 auto;
    width: fit-content;
    text-align: center;
    position: absolute;
    top: 35vh;
    right: calc(50vw - 20px);
}


.float {
    position: fixed;
    width: 60px;
    height: 60px;
    bottom: 40px;
    right: 40px;
    background-color: #0C9;
    color: #FFF;
    border-radius: 50px;
    text-align: center;
    box-shadow: 2px 2px 3px #999;
}

.my-float {
    margin-top: 22px;
    text-decoration: none;
    cursor: pointer;
    font-size: 34px;
    text-underline-offset: unset;
    color: white;
    font-style: inherit;
}

.my-float:hover {
    text-decoration: none;
}

a.float:hover {
    text-decoration: none;
}

.movies-row {
    justify-content: space-between;
    padding: 16px;
}

.movies-container {
    width: 100%;
    padding: 16px;
    max-width: 100%;
}
</style>