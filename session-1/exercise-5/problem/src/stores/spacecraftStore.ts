import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSpacecraftStore = defineStore(
  'spacecraft',
  () => {
    const spacecrafts = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const setSpacecrafts = (data: any[]) => {
      spacecrafts.value = data;
    };

    const setLoading = (value: boolean) => {
      loading.value = value;
    };

    const setError = (err: any) => {
      error.value = err;
    };

    const addSpacecraft = (data: any) => {
      spacecrafts.value.push(data);
    };

    const updateSpacecraft = (id: any, data: any) => {
      const index = spacecrafts.value.findIndex(
        (sc) => sc.id === id
      );
      if (index !== -1) {
        spacecrafts.value[index] = data;
      }
    };

    return {
      spacecrafts,
      loading,
      error,
      setSpacecrafts,
      setLoading,
      setError,
      addSpacecraft,
      updateSpacecraft,
    };
  }
);
