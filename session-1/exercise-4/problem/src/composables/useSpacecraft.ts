import { onMounted, computed, ComputedRef } from 'vue';
import { useSpacecraftStore } from '@/stores/spacecraftStore';
import { apiService } from '@/services/apiService';
import { Spacecraft } from '@/types';

/**
 * Composable function for managing spacecraft data and operations.
 * This function encapsulates the logic for fetching, adding, and updating spacecraft,
 * as well as managing loading and error states.
 */
export const useSpacecraft = () => {
  // Initialize the spacecraft store
  const store = useSpacecraftStore();

  // Fetch spacecraft data when the component is mounted
  onMounted(async () => {
    store.setLoading(true);
    try {
      const spacecrafts: Spacecraft[] =
        await apiService.getSpacecraft();
      store.setSpacecrafts(spacecrafts);
    } catch (err: unknown) {
      store.setError(err as Error);
    } finally {
      store.setLoading(false);
    }
  });

  // Computed properties for reactive access to store state
  const spacecrafts = computed<Spacecraft[]>(
    () => store.spacecrafts
  );
  const loading = computed<boolean>(() => store.loading);
  const error = computed<Error | null>(() => store.error);

  /**
   * Adds a new spacecraft to the store and API.
   * @param {Omit<Spacecraft, 'id'>} data - The spacecraft data to be added.
   */
  const addSpacecraft = async (
    data: Omit<Spacecraft, 'id'>
  ): Promise<void> => {
    store.setLoading(true);
    try {
      const newSpacecraft: Spacecraft =
        await apiService.addSpacecraft(data);
      store.addSpacecraft(newSpacecraft);
    } catch (err: unknown) {
      store.setError(err as Error);
    } finally {
      store.setLoading(false);
    }
  };

  /**
   * Updates an existing spacecraft in the store and API.
   * @param {string} id - The ID of the spacecraft to update.
   * @param {Partial<Omit<Spacecraft, 'id'>>} data - The updated spacecraft data.
   */
  const updateSpacecraft = async (
    id: string,
    data: Partial<Omit<Spacecraft, 'id'>>
  ): Promise<void> => {
    store.setLoading(true);
    try {
      const updatedSpacecraft: Spacecraft =
        await apiService.updateSpacecraft(id, data);
      store.updateSpacecraft(id, updatedSpacecraft);
    } catch (err: unknown) {
      store.setError(err as Error);
    } finally {
      store.setLoading(false);
    }
  };

  // Return an object with reactive properties and methods for component usage
  return {
    spacecrafts,
    loading,
    error,
    addSpacecraft,
    updateSpacecraft,
  };
};
