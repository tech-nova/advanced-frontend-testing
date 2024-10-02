import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Docking } from '@/types';

export const useDockingStore = defineStore(
  'docking',
  () => {
    const dockings = ref<Docking[]>([]);
    const loading = ref(false);
    const error = ref<Error | null>(null);

    const setDockings = (newDockings: Docking[]) => {
      dockings.value = newDockings;
    };

    const addDocking = (newDocking: Docking) => {
      dockings.value.push(newDocking);
    };

    const updateDocking = (
      id: string,
      updatedDocking: Docking
    ) => {
      const index = dockings.value.findIndex(
        (dk: Docking) => dk.id === id
      );
      if (index !== -1) {
        dockings.value[index] = updatedDocking;
      }
    };

    const setLoading = (isLoading: boolean) => {
      loading.value = isLoading;
    };

    const setError = (err: Error | null) => {
      error.value = err;
    };

    return {
      dockings,
      loading,
      error,
      setDockings,
      addDocking,
      updateDocking,
      setLoading,
      setError,
    };
  }
);
