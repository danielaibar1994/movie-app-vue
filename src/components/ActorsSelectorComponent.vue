<template>
    <!-- Actors -->
    <label>Actors:</label><br>
    <div v-if="!isLoadingActors && actorsList">
        <input type="text" name="" id="" placeholder="ingrese dato" v-model.trim="actorInput" class="form-control">
        <ul class="dropdown-menu" v-bind:class="{ 'visible': isVisibleActorDropdown }">
            <li v-for="actor of actorsFilteredList" :key="actor.id">
                <a @click="addActor(actor.id)">
                    {{ actor.first_name + ' ' + actor.last_name }}
                </a>
            </li>
        </ul>
    </div>

    <div class="tags-container">
        <button v-for="actorId of actorsMovieList" :key="actorId" type="button" class="btn btn-primary">
            {{ getActorName(actorId) }} <span class="badge badge-light" @click="deleteActor(actorId)">&times;</span>
        </button>
    </div>
</template>
<script>
import { ref, computed } from 'vue';
import { useActorsStore } from '../stores/actors';
export default {
    props: ['actorsMovieList'],
    emits: ['addActor', 'deleteActor'],
    setup(props, { emit }) {
        const actorsStore = useActorsStore();
        const actorInput = ref("");

        const actorsList = computed(() => {
            return actorsStore.items
        });

        const isVisibleActorDropdown = computed(() => {
            return actorInput.value === "" ? false : true;
        });

        const isLoadingActors = computed(() => {
            return actorsStore.isLoading
        });

        const actorsFilteredList = computed(() => {
            return actorsStore.items.filter(actor => {
                const searchTerm = actorInput.value.toLocaleLowerCase();
                const filteredString = searchTerm.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

                const firstNameTerm = actor.first_name.toLocaleLowerCase();
                const filteredFirstNameTerm = firstNameTerm.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

                const lastNameTerm = actor.last_name.toLocaleLowerCase();
                const filteredLastNameTerm = lastNameTerm.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

                return filteredFirstNameTerm.includes(filteredString) || filteredLastNameTerm.includes(filteredString);
            })
        });

        function addActor(actorId) {
            if (actorInput.value === "") {
                return;
            }

            emit('addActor', actorId);
            actorInput.value = '';
        }

        function deleteActor(actorId) {
            emit('deleteActor', actorId);
        }

        // Actors
        const getActorName = actorId => {
            const index = actorsStore.findIndexById(actorId);
            if (index !== -1) {
                return actorsList.value[index].first_name + ' ' + actorsList.value[index].last_name;
            }

            return '(' + actorId + ')';
        }

        return {
            actorInput,
            actorsList,
            addActor,
            deleteActor,
            getActorName,
            isVisibleActorDropdown,
            isLoadingActors,
            actorsFilteredList
        }

    }

}
</script>
<style>
.tags-container {
    margin: 8px 0;
}
</style>