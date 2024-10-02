<template>
  <!-- Modal container, visible only if showModal is true -->
  <div
    v-if="showModal"
    class="fixed inset-0 flex items-center justify-center z-50"
  >
    <!-- Background overlay -->
    <div class="fixed inset-0 bg-black opacity-50"></div>
    <!-- Modal content container -->
    <div
      class="bg-white p-6 rounded shadow-lg z-10 max-w-md w-full"
    >
      <h1 class="text-2xl font-bold mb-4">
        Schedule Docking
      </h1>
      <!-- Form for scheduling docking, prevents default submit behavior -->
      <form @submit.prevent="handleSubmit">
        <!-- Spacecraft selection dropdown -->
        <div class="mb-4">
          <label class="block text-gray-700"
            >Spacecraft</label
          >
          <select
            v-model="form.spacecraft"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.spacecraft }"
          >
            <option value="" disabled>
              Select a spacecraft
            </option>
            <!-- Loop through spacecraft options and create an option element for each -->
            <option
              v-for="spacecraft in spacecraftOptions"
              :key="spacecraft.id"
              :value="spacecraft.id"
            >
              {{ spacecraft.name }}
            </option>
          </select>
          <!-- Display error message if spacecraft selection is invalid -->
          <span
            v-if="errors.spacecraft"
            class="text-red-500 text-sm"
            >{{ errors.spacecraft }}</span
          >
        </div>
        <!-- Docking time input field -->
        <div class="mb-4">
          <label class="block text-gray-700"
            >Docking Time</label
          >
          <input
            v-model="form.dockingTime"
            type="datetime-local"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{
              'border-red-500': errors.dockingTime,
            }"
          />
          <!-- Display error message if docking time is invalid -->
          <span
            v-if="errors.dockingTime"
            class="text-red-500 text-sm"
            >{{ errors.dockingTime }}</span
          >
        </div>
        <!-- Docking bay input field -->
        <div class="mb-4">
          <label class="block text-gray-700"
            >Docking Bay</label
          >
          <input
            v-model="form.bayId"
            type="number"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.bayId }"
          />
          <!-- Display error message if bay ID is invalid -->
          <span
            v-if="errors.bayId"
            class="text-red-500 text-sm"
            >{{ errors.bayId }}</span
          >
        </div>
        <!-- Submit button, disabled while loading -->
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          :disabled="loading"
        >
          Schedule
        </button>
        <!-- Cancel button to close the modal -->
        <button
          type="button"
          @click="closeModal"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
        >
          Cancel
        </button>
        <!-- Display error message if there is an error -->
        <div v-if="error" class="text-red-500 mt-4">
          {{ error.message }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { validateDocking } from '@/utils/validation';
import { Spacecraft, ValidationErrors } from '@/types';

// Define component props
const props = defineProps<{
  showModal: boolean;
  spacecrafts: Spacecraft[];
}>();

// Define component events
const emit = defineEmits<{
  (e: 'close'): void;
  (
    e: 'schedule-docking',
    payload: {
      spacecraftId: string;
      dockingTime: string;
      bayId: number;
    }
  ): void;
}>();

// Reactive form data
const form = ref<{
  spacecraft: string;
  dockingTime: string;
  bayId: string;
}>({
  spacecraft: '',
  dockingTime: '',
  bayId: '',
});

// Reactive error messages
const errors = ref<ValidationErrors>({});
// Loading state
const loading = ref(false);
// General error state
const error = ref<Error | null>(null);

// Compute spacecraft options from props
const spacecraftOptions = computed(() => props.spacecrafts);

// Handle form submission
const handleSubmit = async () => {
  // Validate form data
  errors.value = validateDocking(form.value);
  // If no validation errors, proceed with submission
  if (Object.keys(errors.value).length === 0) {
    loading.value = true;
    try {
      // Emit schedule-docking event with form data
      emit('schedule-docking', {
        spacecraftId: form.value.spacecraft,
        dockingTime: form.value.dockingTime,
        bayId: parseInt(form.value.bayId, 10),
      });
      // Close the modal
      closeModal();
      // Clear the form
      form.value = {
        spacecraft: '',
        dockingTime: '',
        bayId: '',
      };
    } catch (err) {
      // Set error state if submission fails
      error.value = err as Error;
    } finally {
      // Reset loading state
      loading.value = false;
    }
  }
};

// Close the modal
const closeModal = () => {
  emit('close');
};
</script>
