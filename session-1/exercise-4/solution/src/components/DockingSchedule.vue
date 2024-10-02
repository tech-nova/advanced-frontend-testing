<template>
  <div>
    <!-- Header section with title and button to schedule docking -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Docking Schedule</h1>
      <button
        @click="showModal = true"
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Schedule Docking
      </button>
    </div>
    <!-- Loading indicator -->
    <div v-if="dockingStore.loading" class="text-center">
      Loading...
    </div>
    <div v-else>
      <!-- Table displaying docking schedule -->
      <table class="min-w-full bg-white">
        <!-- Table header -->
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">Spacecraft</th>
            <th class="py-2 px-4 border-b">Captain</th>
            <th class="py-2 px-4 border-b">Docking Time</th>
            <th class="py-2 px-4 border-b">Docking Bay</th>
            <th class="py-2 px-4 border-b">Status</th>
            <th class="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Loop through dockingsWithCaptains to display each docking entry -->
          <tr
            v-for="docking in dockingsWithCaptains"
            :key="docking.id"
            class="text-center border-t"
          >
            <td class="py-2 px-4">
              {{ docking.spacecraftName }}
            </td>
            <td class="py-2 px-4">
              {{ docking.captainName }}
            </td>
            <td class="py-2 px-4">
              {{ formatDate(docking.dockingTime) }}
            </td>
            <td class="py-2 px-4">{{ docking.bayId }}</td>
            <td class="py-2 px-4">{{ docking.status }}</td>
            <td class="py-2 px-4">
              <!-- Action buttons for viewing scan or recording new scan -->
              <button
                v-if="docking.scan"
                @click="handleViewScan(docking.scan)"
                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
              >
                View Scan
              </button>
              <button
                v-if="docking.status === 'docked'"
                @click="openVideoScanModal(docking.id)"
                class="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
              >
                Record Scan
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Error message display -->
      <div
        v-if="dockingStore.error"
        class="text-red-500 mt-4"
      >
        {{ dockingStore.error.message }}
      </div>
    </div>
    <!-- Modal components for various actions -->
    <DockingForm
      :showModal="showModal"
      :spacecrafts="spacecrafts"
      @close="showModal = false"
      @schedule-docking="handleScheduleDocking"
    />
    <VideoScanModal
      :showModal="showVideoScanModal"
      @close="showVideoScanModal = false"
      @submit-scan="handleSubmitScan"
    />
    <VideoViewerModal
      :showModal="showVideoViewerModal"
      :scan="currentScan"
      @close="showVideoViewerModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ofetch } from 'ofetch';
import { useSpacecraft } from '@/composables/useSpacecraft';
import DockingForm from './DockingForm.vue';
import VideoScanModal from './VideoScanModal.vue';
import VideoViewerModal from './VideoViewerModal.vue';
import { useDockingStore } from '@/stores/dockingStore';
import type { Docking, Spacecraft } from '@/types';
import { DockingWithSpacecraft } from '@/types';

/**
Purpose: This component displays a docking schedule for spacecraft and allows users to manage dockings.
Usage: Include this component in a Vue application to show and interact with docking schedules.
Limitations: Relies on external composables and API calls for data fetching and management.
Edge cases: Handles loading states, errors, and potential missing data (e.g., unknown spacecraft or captain names).
*/

// Use the spacecraft composable to get spacecraft data
const {
  spacecrafts,
  loading: spacecraftLoading,
  error: spacecraftError,
} = useSpacecraft();

// Use the docking store
const dockingStore = useDockingStore();

// Reactive variables for controlling modal visibility
const showModal = ref(false);
const showVideoScanModal = ref(false);
const showVideoViewerModal = ref(false);

// Reactive variables for managing current scan and docking data
const currentScan = ref<Blob | null>(null);
const currentDockingId = ref<string | null>(null);

// Function to fetch dockings data from the API
const fetchDockings = async () => {
  try {
    dockingStore.setLoading(true);
    const data = await ofetch<DockingWithSpacecraft[]>(
      '/api/dockings'
    );
    dockingStore.setDockings(data);
  } catch (err) {
    dockingStore.setError(
      err instanceof Error
        ? err
        : new Error('An error occurred')
    );
  } finally {
    dockingStore.setLoading(false);
  }
};

// Function to schedule a new docking
const scheduleDocking = async (
  dockingData: Docking
): Promise<void> => {
  try {
    const newDocking = await ofetch<DockingWithSpacecraft>(
      '/api/dockings',
      {
        method: 'POST',
        body: dockingData,
      }
    );
    dockingStore.addDocking(newDocking);
  } catch (err) {
    const error =
      err instanceof Error
        ? err
        : new Error(
            'An error occurred while scheduling docking'
          );
    dockingStore.setError(error);
    throw error;
  }
};

/**
 * Add a scan to a docking entry in local state
 * Note: This method uses local state instead of API to avoid dealing with Blob objects
 * @param dockingId - The ID of the docking to update
 * @param scan - The scan Blob to add
 */
const addScanToDocking = async (
  dockingId: string,
  scan: Blob
): Promise<void> => {
  try {
    const updatedDocking = dockingStore.dockings.find(
      (d: DockingWithSpacecraft) => d.id === dockingId
    );
    if (updatedDocking) {
      updatedDocking.scan = scan;
      dockingStore.updateDocking(dockingId, updatedDocking);
    }
  } catch (err) {
    const error =
      err instanceof Error
        ? err
        : new Error('An error occurred while adding scan');
    dockingStore.setError(error);
    throw error;
  }
};

// Fetch dockings data when component is mounted
onMounted(() => {
  fetchDockings();
});

// Helper function to format ISO date strings into a more readable format
const formatDate = (isoString: string): string => {
  return new Date(isoString).toLocaleString();
};

// Handler for scheduling a new docking
const handleScheduleDocking = async (
  dockingData: Docking
): Promise<void> => {
  try {
    await scheduleDocking(dockingData);
    showModal.value = false; // Close the modal on successful scheduling
  } catch (error) {
    console.error('Failed to schedule docking:', error);
  }
};

// Handler for submitting a new scan
const handleSubmitScan = (scan: Blob) => {
  if (currentDockingId.value) {
    addScanToDocking(currentDockingId.value, scan);
    showVideoScanModal.value = false;
  }
};

// Handler for viewing an existing scan
const handleViewScan = (scan: Blob) => {
  currentScan.value = scan;
  showVideoViewerModal.value = true;
};

// Function to open video scan modal for a specific docking
const openVideoScanModal = (dockingId: string) => {
  currentDockingId.value = dockingId;
  showVideoScanModal.value = true;
};

// Computed property to combine docking data with corresponding spacecraft and captain names
const dockingsWithCaptains = computed(() => {
  if (dockingStore.loading || spacecraftLoading.value) {
    return []; // Return empty array if data is still loading
  }
  return dockingStore.dockings.map(
    (docking: DockingWithSpacecraft) => {
      const spacecraft = spacecrafts.value.find(
        (sc: Spacecraft) => sc.id === docking.spacecraftId
      );
      return {
        ...docking,
        spacecraftName: spacecraft
          ? spacecraft.name
          : 'Unknown',
        captainName: spacecraft
          ? spacecraft.captain
          : 'Unknown',
      };
    }
  );
});
</script>
