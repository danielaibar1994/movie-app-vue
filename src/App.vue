<script>
import { RouterLink, RouterView } from 'vue-router'
import Alert from '@/components/AlertComponent.vue'
import { onMounted } from 'vue'
import { useMoviesStore } from './stores/movies'

export default {
  components: { Alert, RouterLink, RouterView },
  setup() {
    const moviesStore = useMoviesStore();

    onMounted(async () => {
      moviesStore.fetchMovies();
    })
  }
}
</script>

<template>
  <div id="nav">
    <RouterLink class="link" to="/movies">Movies</RouterLink> |
    <RouterLink class="link" to="/actors">Actors</RouterLink> |
    <RouterLink class="link" to="/companies">Companies</RouterLink>
  </div>
  <RouterView />
  <Alert />
</template>

<style >
#nav {
  padding: 16px;
}

.link {
  color: greenyellow;
}
</style>
