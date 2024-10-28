import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '@/services/apiService';
import type { Docking } from '@/types';

export const useDockingStore = defineStore(
  'docking',
  () => {
    const dockings = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const fetchDockings = async () => {
      loading.value = true;
      try {
        const response: Docking[] =
          await apiService.getDockings();
        dockings.value = response;
      } catch (err) {
        error.value = new Error('Error fetching dockings');
      } finally {
        loading.value = false;
      }
    };

    const scheduleDocking = async (data) => {
      loading.value = true;
      try {
        const newDocking = await apiService.scheduleDocking(
          data
        );
        dockings.value.push(newDocking);
      } catch (err) {
        error.value = new Error('Error scheduling docking');
      } finally {
        loading.value = false;
      }
    };

    const updateDocking = async (id, data) => {
      loading.value = true;
      try {
        const updatedDocking =
          await apiService.updateDocking(id, data);
        const index = dockings.value.findIndex(
          (dk) => dk.id === id
        );
        if (index !== -1) {
          dockings.value[index] = updatedDocking;
        }
      } catch (err) {
        error.value = new Error('Error updating docking');
      } finally {
        loading.value = false;
      }
    };

    return {
      dockings,
      loading,
      error,
      fetchDockings,
      scheduleDocking,
      updateDocking,
    };
  }
);
