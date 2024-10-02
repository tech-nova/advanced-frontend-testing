<template>
  <!-- Modal container -->
  <div
    v-if="showModal"
    class="fixed inset-0 flex items-center justify-center z-50"
  >
    <!-- Modal backdrop -->
    <div class="fixed inset-0 bg-black opacity-50"></div>

    <!-- Modal content -->
    <div
      class="bg-white p-6 rounded shadow-lg z-10 max-w-md w-full"
    >
      <h1 class="text-2xl font-bold mb-4">
        Record Video Scan
      </h1>

      <!-- Video preview and recording UI -->
      <div class="relative">
        <video
          ref="videoElement"
          class="w-full mb-4"
          :class="{
            'border-4 border-red-500 animate-pulse':
              isRecording,
          }"
          autoplay
        ></video>

        <!-- Countdown overlay -->
        <div
          v-if="countdown > 0"
          class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-6xl font-bold"
        >
          {{ countdown }}
        </div>

        <!-- Recording duration display -->
        <div
          v-if="isRecording"
          class="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded"
        >
          {{ formattedDuration }}
        </div>
      </div>

      <!-- Recording control buttons -->
      <div class="flex justify-between items-center mb-4">
        <!-- Start recording button -->
        <button
          @click="startRecording"
          class="p-2 rounded flex items-center transition-colors duration-200"
          :class="{
            'bg-blue-500 text-white hover:bg-blue-600': !(
              isRecording || countdown > 0
            ),
            'bg-gray-300 text-gray-500 cursor-not-allowed':
              isRecording || countdown > 0,
          }"
          :disabled="isRecording || countdown > 0"
          aria-label="Start Recording"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle
              cx="12"
              cy="12"
              r="8"
              stroke-width="2"
              fill="currentColor"
            />
          </svg>
          Start Recording
        </button>

        <!-- Stop recording button -->
        <button
          @click="stopRecording"
          class="p-2 rounded flex items-center transition-colors duration-200"
          :class="{
            'bg-red-500 text-white hover:bg-red-600':
              isRecording,
            'bg-gray-300 text-gray-500 cursor-not-allowed':
              !isRecording,
          }"
          :disabled="!isRecording"
          aria-label="Stop Recording"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <rect
              x="7"
              y="7"
              width="10"
              height="10"
              stroke-width="2"
              fill="currentColor"
            />
          </svg>
          Stop Recording
        </button>
      </div>

      <!-- Recorded video preview -->
      <div v-if="recordedVideoUrl" class="mb-4">
        <h2 class="text-lg font-semibold mb-2">Preview:</h2>
        <video
          :src="recordedVideoUrl"
          controls
          class="w-full"
        ></video>
      </div>

      <!-- Action buttons -->
      <div class="flex justify-between">
        <button
          @click="submitScan"
          class="bg-green-500 text-white px-4 py-2 rounded"
          :disabled="!recordedVideoUrl"
        >
          Submit Scan
        </button>
        <button
          @click="closeModal"
          class="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { Docking } from '../types';

// Define component props
const props = defineProps<{
  showModal: boolean;
}>();

// Define component events
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit-scan', scan: Docking['scan']): void;
}>();

// Refs for managing video recording state and UI
const videoElement = ref<HTMLVideoElement | null>(null);
const mediaRecorder = ref<MediaRecorder | null>(null);
const recordedChunks = ref<Blob[]>([]);
const stream = ref<MediaStream | null>(null);
const isRecording = ref<boolean>(false);
const recordingDuration = ref<number>(0);
const countdown = ref<number>(0);
const recordedVideoUrl = ref<string | null>(null);

// Maximum recording duration in seconds
const MAX_RECORDING_DURATION = 60;

// Computed property to format recording duration
const formattedDuration = computed((): string => {
  const minutes = Math.floor(recordingDuration.value / 60);
  const seconds = recordingDuration.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
});

// Initialize camera and set up video stream
const initializeCamera = async (): Promise<void> => {
  try {
    stream.value =
      await navigator.mediaDevices.getUserMedia({
        video: true,
      });
    if (videoElement.value) {
      videoElement.value.srcObject = stream.value;
    }
  } catch (error) {
    console.error('Error accessing camera:', error);
  }
};

// Start recording with a countdown
const startRecording = (): void => {
  countdown.value = 3;
  const countdownInterval = setInterval(() => {
    countdown.value--;
    if (countdown.value === 0) {
      clearInterval(countdownInterval);
      startActualRecording();
    }
  }, 1000);
};

// Begin the actual recording process
const startActualRecording = (): void => {
  if (stream.value) {
    // Clear previous recording data
    recordedChunks.value = [];
    recordedVideoUrl.value = null;

    // Set up MediaRecorder and start recording
    mediaRecorder.value = new MediaRecorder(stream.value);
    mediaRecorder.value.ondataavailable = (
      event: BlobEvent
    ) => {
      if (event.data.size > 0) {
        recordedChunks.value.push(event.data);
      }
    };
    mediaRecorder.value.start();
    isRecording.value = true;
    recordingDuration.value = 0;

    // Set up interval to update recording duration and stop if max duration is reached
    const durationInterval = setInterval(() => {
      recordingDuration.value++;
      if (
        recordingDuration.value >= MAX_RECORDING_DURATION
      ) {
        clearInterval(durationInterval);
        stopRecording();
      }
    }, 1000);
  }
};

// Stop the recording process
const stopRecording = (): void => {
  if (
    mediaRecorder.value &&
    mediaRecorder.value.state !== 'inactive'
  ) {
    mediaRecorder.value.stop();
    isRecording.value = false;

    // Create a blob from recorded chunks and generate a URL for preview
    setTimeout(() => {
      const blob = new Blob(recordedChunks.value, {
        type: 'video/webm',
      });
      recordedVideoUrl.value = URL.createObjectURL(blob);
    }, 100);
  }
};

// Submit the recorded video scan
const submitScan = (): void => {
  if (recordedChunks.value.length > 0) {
    const blob = new Blob(recordedChunks.value, {
      type: 'video/webm',
    });
    emit('submit-scan', blob);
    closeModal();
  }
};

// Close the modal and reset all states
const closeModal = (): void => {
  if (stream.value) {
    stream.value
      .getTracks()
      .forEach((track) => track.stop());
  }
  isRecording.value = false;
  recordingDuration.value = 0;
  recordedChunks.value = [];
  recordedVideoUrl.value = null;
  emit('close');
};

// Watch for changes in showModal prop to initialize or close camera
watch(
  () => props.showModal,
  (newValue: boolean) => {
    if (newValue) {
      initializeCamera();
    } else {
      closeModal();
    }
  }
);

// Initialize camera when component is mounted if modal is shown
onMounted(() => {
  if (props.showModal) {
    initializeCamera();
  }
});
</script>

<style scoped>
/* Animation for the recording indicator */
@keyframes pulse {
  0%,
  100% {
    border-color: rgba(239, 68, 68, 0.5);
  }
  50% {
    border-color: rgba(239, 68, 68, 1);
  }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
