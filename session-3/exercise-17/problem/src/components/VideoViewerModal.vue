<!--
Purpose: This component creates a modal to display a video scan.
Usage: Include this component in a parent component and pass 'showModal' and 'scan' props.
Limitations: Assumes the scan prop is a Blob containing video data.
Error Handling: No specific error handling for invalid Blob data.
-->

<template>
  <div
    v-if="showModal"
    class="fixed inset-0 flex items-center justify-center z-50"
  >
    <!-- Background overlay for dimming the content behind the modal -->
    <div
      class="fixed inset-0 bg-space-deep-blue opacity-80"
    ></div>
    <!-- Modal content container -->
    <div
      role="dialog"
      aria-labelledby="modalTitle"
      aria-modal="true"
      class="bg-space-dark-blue bg-opacity-80 p-6 rounded-lg shadow-lg shadow-space-nebula-teal/10 z-10 max-w-lg w-full border border-space-nebula-teal border-opacity-30"
    >
      <h1
        id="modalTitle"
        class="text-2xl font-bold mb-4 text-space-starlight-white"
      >
        View Video Scan
      </h1>
      <!-- Video player for displaying the scan -->
      <video
        :src="videoURL"
        controls
        class="w-full mb-4 rounded"
        aria-label="Video scan playback"
      ></video>
      <div class="flex justify-end">
        <!-- Close button to dismiss the modal -->
        <button
          @click="closeModal"
          class="bg-space-cosmic-purple hover:bg-space-cosmic-purple/80 text-space-starlight-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
          aria-label="Close modal"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { Docking } from '../types';

// Define props for the component
const props = defineProps<{
  showModal: boolean; // Controls visibility of the modal
  scan: Docking['scan']; // The video scan data to be displayed
}>();

// Define emits for the component
const emit = defineEmits<{
  (e: 'close'): void; // Event emitted when the modal is closed
}>();

// Ref to store the URL for the video
const videoURL = ref<string>('');

// Watch for changes in the scan prop
watch(
  () => props.scan,
  (newScan: Docking['scan']) => {
    if (newScan) {
      // Create a new object URL when the scan changes
      videoURL.value = URL.createObjectURL(newScan);
    }
  },
  { immediate: true } // Run immediately on component creation
);

// Clean up the object URL when the component is unmounted
onUnmounted(() => {
  if (videoURL.value) {
    URL.revokeObjectURL(videoURL.value);
  }
});

// Function to close the modal and clean up resources
const closeModal = (): void => {
  emit('close'); // Emit close event
  // Revoke the object URL to free up memory
  if (videoURL.value) {
    URL.revokeObjectURL(videoURL.value);
    videoURL.value = '';
  }
};

// Watch for changes in the showModal prop
watch(
  () => props.showModal,
  (newShowModal: boolean) => {
    if (newShowModal && props.scan) {
      // Recreate the object URL when the modal is opened again
      videoURL.value = URL.createObjectURL(props.scan);
    }
  }
);
</script>
