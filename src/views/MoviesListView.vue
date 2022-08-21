<template>
    <main>
        <h1 class="movies-header">Movies Pages</h1>
        <MoviesListComponent />
    </main>
</template>

<script setup>
import MoviesListComponent from '@/components/MoviesListComponent.vue';
</script>

<style>
.movies-header {
    padding: 0 24px;
}
</style>