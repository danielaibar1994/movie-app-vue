<template>
    <label>
        Genre
    </label><br>
    <input type="text" name="" id="" placeholder="ingrese dato" v-model.trim="genreInput" class="form-control"
        v-on:keydown.enter.prevent='addCategory'>

    <div class="tags-container">
        <button v-for="genre of props.genresList" :key="genre" type="button" class="btn btn-primary">
            {{ genre }} <span class="badge badge-light" @click="deleteCategory(genre)">&times;</span>
        </button>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{ genresList: string[] }>();
const emits = defineEmits<{
    (event: 'addCategory', value: string): void,
    (event: 'deleteCategory', value: string): void
}>();
const genreInput = ref("");

function addCategory() {
    if (genreInput.value === "") {
        return;
    }

    emits('addCategory', genreInput.value);
    genreInput.value = '';
}

function deleteCategory(genre: string) {
    emits('deleteCategory', genre);
}
</script>

<!-- OTHER METHOD -->
<!-- <script>
import { ref } from 'vue';
export default {
    props: ['genresList'],
    emits: ['addCategory', 'deleteCategory'],
    setup(props, { emit }) {
      ...

        return {
            genreInput,
            addCategory,
            deleteCategory
        }
    }
}
</script> -->

<style>
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

.tags-container {
    margin: 8px 0;
}
</style>