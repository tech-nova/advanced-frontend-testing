<template>
  <div
    class="bg-space-deep-blue bg-opacity-90 text-space-starlight-white p-6 rounded-lg shadow-lg"
  >
    <!-- Header section with title and button to schedule docking -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-space-nebula-teal">
        Docking Schedule
      </h1>
      <button
        @click="showModal = true"
        class="bg-space-nebula-teal hover:bg-space-nebula-teal/80 text-space-starlight-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
      >
        Schedule Docking
      </button>
    </div>
    <!-- Loading indicator -->
    <div
      v-if="loading"
      class="text-center text-space-nebula-teal"
    >
      Loading...
    </div>
    <div v-else>
      <!-- Table displaying docking schedule -->
      <table
        class="min-w-full bg-space-dark-blue bg-opacity-80 rounded-lg overflow-hidden"
      >
        <thead
          class="bg-space-cosmic-purple text-space-starlight-white"
        >
          <tr>
            <th class="py-3 px-4 text-left">Spacecraft</th>
            <th class="py-3 px-4 text-left">Captain</th>
            <th class="py-3 px-4 text-left">
              Docking Time
            </th>
            <th class="py-3 px-4 text-left">Docking Bay</th>
            <th class="py-3 px-4 text-left">Status</th>
            <th class="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Loop through dockingsWithCaptains to display each docking entry -->
          <tr
            v-for="docking in dockingsWithCaptains"
            :key="docking.id"
            class="border-b border-space-nebula-teal border-opacity-30 hover:bg-space-nebula-teal hover:bg-opacity-20 transition-colors duration-300"
          >
            <td class="py-3 px-4">
              {{ docking.spacecraftName }}
            </td>
            <td class="py-3 px-4">
              {{ docking.captainName }}
            </td>
            <td class="py-3 px-4">
              {{ formatDate(docking.dockingTime) }}
            </td>
            <td class="py-3 px-4">{{ docking.bayId }}</td>
            <td class="py-3 px-4">
              <span
                :class="getStatusClass(docking.status)"
                class="px-2 py-1 rounded-full text-xs font-bold"
              >
                {{ docking.status }}
              </span>
            </td>
            <td class="py-3 px-4">
              <button
                v-if="docking.scan"
                @click="handleViewScan(docking.scan)"
                class="bg-space-cosmic-purple hover:bg-space-cosmic-purple/80 text-space-starlight-white font-bold py-1 px-3 rounded-full transition-colors duration-300 mr-2"
              >
                View Scan
              </button>
              <button
                v-if="docking.status === 'docked'"
                @click="openVideoScanModal(docking.id)"
                class="bg-space-nebula-teal hover:bg-space-nebula-teal/80 text-space-starlight-white font-bold py-1 px-3 rounded-full transition-colors duration-300"
              >
                Record Scan
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Error message display -->
      <div v-if="error" class="text-space-martian-red mt-4">
        {{ error.message }}
      </div>
    </div>
    <!-- Docking form component for scheduling new dockings -->
    <DockingForm
      :showModal="showModal"
      :spacecrafts="spacecrafts"
      @close="showModal = false"
      @schedule-docking="handleScheduleDocking"
    />
    <!-- Video scan modal component -->
    <VideoScanModal
      :showModal="showVideoScanModal"
      @close="showVideoScanModal = false"
      @submit-scan="handleSubmitScan"
    />
    <!-- Video viewer modal component -->
    <VideoViewerModal
      :showModal="showVideoViewerModal"
      :scan="currentScan"
      @close="showVideoViewerModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDocking } from '@/composables/useDocking';
import { useSpacecraft } from '@/composables/useSpacecraft';
import DockingForm from './DockingForm.vue';
import VideoScanModal from './VideoScanModal.vue';
import VideoViewerModal from './VideoViewerModal.vue';
import type { Docking, Spacecraft } from '@/types';
import { DockingWithSpacecraft } from '@/types';

// Destructure docking-related data and methods from useDocking composable
const {
  dockings,
  loading,
  error,
  scheduleDocking,
  addScanToDocking,
} = useDocking();

// Destructure spacecraft-related data and methods from useSpacecraft composable
const {
  spacecrafts,
  loading: spacecraftLoading,
  error: spacecraftError,
} = useSpacecraft();

// Reactive variable to control the visibility of the modal
const showModal = ref(false);

// Reactive variable to control the visibility of the video scan modal
const showVideoScanModal = ref(false);

// Reactive variable to control the visibility of the video viewer modal
const showVideoViewerModal = ref(false);

// Reactive variable to hold the current scan Blob
const currentScan = ref<Blob | null>(null);

// Reactive variable to hold the current docking ID
const currentDockingId = ref<string | null>(null);

// Function to format ISO date strings into a more readable format
const formatDate = (isoString: string): string => {
  return new Date(isoString).toLocaleString();
};

// Function to handle scheduling a new docking
const handleScheduleDocking = async (
  dockingData: Docking
): Promise<void> => {
  try {
    await scheduleDocking(dockingData);
    showModal.value = false; // Close the modal on successful scheduling
  } catch (error) {
    console.error('Failed to schedule docking:', error); // Log error if scheduling fails
  }
};

// Function to handle scan submission
const handleSubmitScan = (scan: Blob) => {
  if (currentDockingId.value) {
    addScanToDocking(currentDockingId.value, scan);
    showVideoScanModal.value = false;
  }
};

// Function to handle viewing an existing scan
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
  if (loading.value || spacecraftLoading.value) {
    return []; // Return empty array if data is still loading
  }
  return dockings.value.map(
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

// New function to get status class
const getStatusClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'departing':
      return 'bg-space-solar-flare text-space-deep-blue';
    case 'docked':
      return 'bg-space-alien-green text-space-deep-blue';
    case 'scheduled':
      return 'bg-space-cosmic-purple text-space-starlight-white';
    default:
      return 'bg-space-nebula-teal text-space-starlight-white';
  }
};
</script>
