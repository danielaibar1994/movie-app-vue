import { defineStore, acceptHMRUpdate } from 'pinia';
// Import axios to make HTTP requests
import axios from "axios"
import type { Movie } from '@/models/movie.interface';

export type RootState = {
    items: Movie[];
    isLoadingMovies: boolean,
    isLoadingMovieDetail: boolean,
    isUpdatingMovie: boolean,
    isCreatingMovie: boolean,
    isDeletingMovie: boolean,
    movieItem: Movie | undefined,
};



export const useMoviesStore = defineStore({
    id: 'movies',
    state: () => ({
        items: [],
        movieItem: undefined,
        isLoadingMovies: false,
        isLoadingMovieDetail: false,
        isUpdatingMovie: false,
        isCreatingMovie: false,
        isDeletingMovie: false,
    } as RootState),
    getters: {
        /**
         * @returns {Array<Movie>}
         */
        getMovies: (state) => { return state.items },
        getMovieItem: (state) => { return state.movieItem },
    },
    actions: {

        // luego miramos el patron adaptado para vue
        // mas que nada consiste en que laas funciones no sean llamdas directamente desde este estor, sino que se encargue
        // un fichero intermedio, igual que genapi para así solo tener que modificar ese fichero 
        // y no todos los componentes que tiren de esa store

        async fetchMovies() {
            // API path
            const basePath = import.meta.env.VITE_BASE_URL + '/movies';
            try {
                this.isLoadingMovies = true;
                const data = await axios.get(basePath)
                this.items = data.data
                this.isLoadingMovies = false;
            }
            catch (error) {
                alert(error)
                console.log(error)
                this.isLoadingMovies = false;
            }
        },

        async getMovieDetail(movieId: number) {
            // API path
            const basePath = import.meta.env.VITE_BASE_URL + '/movies/' + movieId;
            this.movieItem = undefined;
            try {
                this.isLoadingMovieDetail = true;
                const data = await axios.get(basePath)
                this.movieItem = data.data
                this.isLoadingMovieDetail = false;
            }
            catch (error) {
                alert(error)
                console.log(error)
                this.isLoadingMovieDetail = false;
            }

        },

        async updateMovie(movieId: number, updatedMovie: Movie) {
            // API path
            const basePath = import.meta.env.VITE_BASE_URL + '/movies/' + movieId;
            this.isUpdatingMovie = true;

            try {
                const data = await axios.put(basePath, updatedMovie)
                this.movieItem = data.data

                // actualizamos la data de la lista
                const index = this.findIndexById(movieId);

                if (index !== -1) {
                    this.items[index] = data.data;
                }
                this.isUpdatingMovie = false;
            }
            catch (error) {
                alert(error)
                console.log(error)
                this.isUpdatingMovie = false;
            }

        },

        async createMovie(newMovie: Movie) {
            // API path
            const basePath = import.meta.env.VITE_BASE_URL + '/movies';
            this.isCreatingMovie = true;

            try {
                const data = await axios.post(basePath, newMovie)
                this.movieItem = data.data

                this.items.push(data.data);
                this.isCreatingMovie = false;
                return data.data.id;

            }
            catch (error) {
                alert(error)
                console.log(error)
                this.isCreatingMovie = false;
            }

        },

        async deleteMovie(movieId: number) {
            // API path
            const basePath = import.meta.env.VITE_BASE_URL + '/movies' + '/' + movieId;
            this.isDeletingMovie = true;

            try {
                const data = await axios.delete(basePath)

                const index = this.items.findIndex((movie) => { return movie.id === +movieId });
                if (index !== -1) {
                    this.items.splice(index, 1);
                }
                this.isDeletingMovie = false;

                return data;

            }
            catch (error) {
                alert(error)
                console.log(error)
                this.isDeletingMovie = false;
            }

        },

        editMovieParam(targetName: string, targetValue: any) {
            if (this.movieItem) {
                switch (targetName) {
                    case 'title':
                        this.movieItem.title = targetValue;
                        break;
                    case 'poster':
                        this.movieItem.poster = targetValue;
                        break;
                    case 'duration':
                        this.movieItem.duration = targetValue;
                        break;
                    case 'year':
                        this.movieItem.year = targetValue;
                        break;
                    case 'imdbRating':
                        this.movieItem.imdbRating = targetValue;
                        break;
                }
            }

        },

        /**
        * Add genre to the movie
        * @param {any} movie
        */
        addGenreMovie(category: string) {
            if (category === "") {
                return;
            }
            this.movieItem?.genre.push(category);
        },

        /**
        * Delete genre to the movie
        * @param {any} movie
        */
        deleteCategory(category: string) {
            const index = this.movieItem?.genre.indexOf(category);

            if (index && index !== -1) {
                this.movieItem?.genre.splice(index, 1);
            }
        },

        /**
         * Add actor to the movie
         * @param {number} actorId
         */
        addActor(actorId: number) {
            const index = this.movieItem?.actors ? this.movieItem.actors.findIndex((actor) => { return actor === +actorId }) : -1;

            if (this.movieItem && index === -1) {
                if (!this.movieItem?.actors) {
                    this.movieItem.actors = [];
                }
                this.movieItem?.actors.push(actorId);
            }
        },

        /**
        * Delete actor to the movie
        * @param {number} actorId
        */
        deleteActor(actorId: number) {
            const index = this.movieItem?.actors.findIndex((actor) => actor === +actorId);

            if (this.movieItem && index && index !== -1) {
                this.movieItem.actors.splice(index, 1);
            }
        },

        /**
        * Add company to the movie
        * @param {any} companyId
        */
        addCompany(companyId: number) {
            const index = this.movieItem?.companies ? this.movieItem.companies.findIndex((company) => { return company === +companyId }) : -1;

            if (this.movieItem && index === -1) {
                if (!this.movieItem?.companies) {
                    this.movieItem.companies = [];
                }
                this.movieItem?.companies.push(companyId);
            }
        },

        /**
        * Delete company to the movie
        * @param {any} companyId
        */
        deleteCompany(companyId: number) {
            const index = this.movieItem?.companies?.findIndex((actor) => actor === +companyId);

            if (this.movieItem && index && index !== -1) {
                this.movieItem.companies?.splice(index, 1);
            }
        },

        findIndexById(id: number) {
            return this.items.findIndex((item) => item.id === +id);
        },

    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useMoviesStore, import.meta.hot))
}
