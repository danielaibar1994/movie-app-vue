<template>
    <!-- Companies -->
    <label>Companies:</label><br>
    <div v-if="!isLoadingCompanies && companiesList">
        <input type="text" name="" id="" placeholder="Agregar compañia" class="form-control"
            v-model.trim="companyInput">
        <ul class="dropdown-menu" v-bind:class="{ 'visible': isVisibleCompanyDropdown }">
            <li v-for="company of companiesFilteredList" :key="company.id">
                <a @click="addCompany(company.id)">
                    {{ company.name }}
                </a>
            </li>
        </ul>
    </div>

    <div class="tags-container">
        <button v-for="companyId of companiesMovieList" :key="companyId" type="button" class="btn btn-primary">
            {{ getCompanyName(companyId) }}
            <span class="badge badge-light" @click="deleteCompany(companyId)">&times;</span>
        </button>
    </div>
</template>
<script>
import { ref, computed } from 'vue';
import { useCompaniesStore } from '../stores/companies';
export default {
    props: ['companiesMovieList'],
    emits: ['addCompany', 'deleteCompany'],
    setup(props, { emit }) {
        const companiesStore = useCompaniesStore();
        const companyInput = ref("");

        const companiesList = computed(() => {
            return companiesStore.items
        });

        const isVisibleCompanyDropdown = computed(() => {
            return companyInput.value === "" ? false : true;
        });

        const isLoadingCompanies = computed(() => {
            return companiesStore.isLoading
        });

        const companiesFilteredList = computed(() => {
            return companiesStore.items.filter(company => {
                const searchTerm = companyInput.value.toLocaleLowerCase();
                const filteredString = searchTerm.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

                const firstNameTerm = company.name.toLocaleLowerCase();
                const filteredNameTerm = firstNameTerm.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

                return filteredNameTerm.includes(filteredString);
            })
        });

        function addCompany(companyId) {
            if (companyInput.value === "") {
                return;
            }

            emit('addCompany', companyId);
            companyInput.value = '';
        }

        function deleteCompany(companyId) {
            emit('deleteCompany', companyId);
        }

        const getCompanyName = companyId => {
            const index = companiesStore.findIndexById(companyId);
            if (index !== -1) {
                return companiesList.value[index].name;
            }

            return '(' + companyId + ')';
        }

        return {
            companyInput,
            companiesList,
            addCompany,
            deleteCompany,
            getCompanyName,
            isVisibleCompanyDropdown,
            isLoadingCompanies,
            companiesFilteredList
        }
    }
}
</script>
<style>
.tags-container {
    margin: 8px 0;
}
</style>