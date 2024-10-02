import { onMounted, computed, ComputedRef } from 'vue';
import { useDockingStore } from '@/stores/dockingStore';
import type { Docking } from '@/types'; // Import the Docking type

// Composable function for managing docking operations
export const useDocking = () => {
  // Initialize the docking store
  const store = useDockingStore();

  // Fetch dockings when the component is mounted
  onMounted(() => {
    store.fetchDockings();
  });

  // Computed properties for reactive access to store state
  const dockings = computed<Docking[]>(
    () => store.dockings
  );
  const loading = computed<boolean>(() => store.loading);
  const error = computed<string | null>(() => store.error);

  // Function to schedule a new docking
  const scheduleDocking = (data: Docking): Promise<void> =>
    store.scheduleDocking(data);

  // Function to update an existing docking
  const updateDocking = (
    id: string,
    data: Partial<Docking>
  ): Promise<void> => store.updateDocking(id, data);

  // Function to add a scan to a docking event
  const addScanToDocking = async (
    dockingId: string,
    scan: Blob
  ): Promise<void> => {
    try {
      // We'll bypass the store and API here and directly update the dockings array
      // because otherwise we have to deal with the Blob object, which is a bunch
      // of work and not really what we want to do here.
      const docking = store.dockings.find(
        (dk: Docking) => dk.id === dockingId
      );
      if (docking) {
        docking.scan = scan;
        console.log('docking', docking);
      }
    } catch (error) {
      console.error(
        'Failed to add scan to docking:',
        error
      );
    }
  };

  // Return an object with reactive properties and methods for docking operations
  return {
    dockings,
    loading,
    error,
    scheduleDocking,
    updateDocking,
    addScanToDocking,
  };
};
