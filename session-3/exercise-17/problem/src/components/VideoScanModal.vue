<template>
  <!-- Modal container -->
  <div
    v-if="showModal"
    class="fixed inset-0 flex items-center justify-center z-50"
    role="dialog"
    aria-labelledby="modal-title"
    aria-modal="true"
  >
    <!-- Modal backdrop -->
    <div
      class="fixed inset-0 bg-space-deep-blue opacity-50"
      aria-hidden="true"
    ></div>

    <!-- Modal content -->
    <div
      class="bg-space-dark-blue p-6 rounded-lg shadow-lg shadow-space-nebula-teal/10 z-10 max-w-md w-full border border-space-nebula-teal border-opacity-30"
      role="document"
    >
      <h1
        id="modal-title"
        class="text-2xl font-bold mb-4 text-space-starlight-white"
      >
        Record Video Scan
      </h1>

      <!-- Video preview and recording UI -->
      <div class="relative">
        <video
          ref="videoElement"
          class="w-full mb-4"
          :class="{
            'border-4 border-space-martian-red animate-pulse':
              isRecording,
          }"
          autoplay
          aria-label="Camera preview"
        ></video>

        <!-- Countdown overlay -->
        <div
          v-if="countdown > 0"
          class="absolute inset-0 flex items-center justify-center bg-space-deep-blue bg-opacity-50 text-space-starlight-white text-6xl font-bold"
          aria-live="assertive"
          role="status"
        >
          {{ countdown }}
        </div>

        <!-- Recording duration display -->
        <div
          v-if="isRecording"
          class="absolute top-2 right-2 bg-space-deep-blue bg-opacity-50 text-space-starlight-white px-2 py-1 rounded"
          aria-live="polite"
          role="status"
        >
          {{ formattedDuration }}
        </div>
      </div>

      <!-- Recording control buttons -->
      <div class="flex justify-between items-center mb-4">
        <!-- Start recording button -->
        <button
          @click="startRecording"
          class="py-2 px-4 rounded-full flex items-center transition-colors duration-300"
          :class="{
            'bg-space-nebula-teal hover:bg-space-nebula-teal/80 text-space-starlight-white':
              !(isRecording || countdown > 0),
            'bg-space-deep-blue text-space-starlight-white opacity-50 cursor-not-allowed':
              isRecording || countdown > 0,
          }"
          :disabled="isRecording || countdown > 0"
          aria-label="Start Recording"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 mr-2 -ml-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
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
          class="py-2 px-4 rounded-full flex items-center transition-colors duration-300"
          :class="{
            'bg-space-martian-red hover:bg-space-martian-red/80 text-space-starlight-white':
              isRecording,
            'bg-space-deep-blue text-space-starlight-white opacity-50 cursor-not-allowed':
              !isRecording,
          }"
          :disabled="!isRecording"
          aria-label="Stop Recording"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 mr-2 -ml-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
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
        <h2
          id="preview-title"
          class="text-lg font-semibold mb-2 text-space-starlight-white"
        >
          Preview:
        </h2>
        <video
          :src="recordedVideoUrl"
          controls
          class="w-full"
          aria-labelledby="preview-title"
        ></video>
      </div>

      <!-- Action buttons -->
      <div class="flex justify-between">
        <button
          @click="submitScan"
          class="bg-space-alien-green hover:bg-space-alien-green/80 text-space-deep-blue font-bold py-2 px-4 rounded-full transition-colors duration-300"
          :disabled="!recordedVideoUrl"
        >
          Submit Scan
        </button>
        <button
          @click="closeModal"
          class="bg-space-cosmic-purple hover:bg-space-cosmic-purple/80 text-space-starlight-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
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
    border-color: rgba(var(--color-space-martian-red), 0.5);
  }
  50% {
    border-color: rgba(var(--color-space-martian-red), 1);
  }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
