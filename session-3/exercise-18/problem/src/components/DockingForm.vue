<template>
  <!-- Modal container, visible only if showModal is true -->
  <div
    v-if="showModal"
    class="fixed inset-0 flex items-center justify-center z-50"
  >
    <!-- Background overlay -->
    <div
      class="fixed inset-0 bg-space-deep-blue opacity-50"
    ></div>
    <!-- Modal content container -->
    <div
      class="bg-space-dark-blue p-6 rounded-lg shadow-lg shadow-space-nebula-teal/10 z-10 max-w-md w-full border border-space-nebula-teal border-opacity-30"
    >
      <h1
        class="text-2xl font-bold mb-4 text-space-starlight-white"
      >
        Schedule Docking
      </h1>
      <!-- Form for scheduling docking, prevents default submit behavior -->
      <form @submit.prevent="handleSubmit">
        <!-- Spacecraft selection dropdown -->
        <div class="mb-4">
          <label
            class="block text-space-starlight-white"
            for="spacecraft"
            >Spacecraft</label
          >
          <select
            v-model="form.spacecraftId"
            id="spacecraft"
            class="w-full px-3 py-2 bg-space-dark-blue bg-opacity-80 text-space-starlight-white border border-space-nebula-teal border-opacity-50 rounded focus:border-opacity-100 focus:ring-2 focus:ring-space-nebula-teal focus:ring-opacity-50 outline-none"
            :class="{
              'border-space-martian-red': errors.spacecraft,
            }"
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
            v-if="errors.spacecraftId"
            class="text-space-martian-red text-sm"
            >{{ errors.spacecraftId }}</span
          >
        </div>
        <!-- Docking time input field -->
        <div class="mb-4">
          <label
            class="block text-space-starlight-white"
            for="dockingTime"
            >Docking Time</label
          >
          <input
            id="dockingTime"
            v-model="form.dockingTime"
            type="datetime-local"
            class="w-full px-3 py-2 bg-space-dark-blue bg-opacity-80 text-space-starlight-white border border-space-nebula-teal border-opacity-50 rounded focus:border-opacity-100 focus:ring-2 focus:ring-space-nebula-teal focus:ring-opacity-50 outline-none"
            :class="{
              'border-space-martian-red':
                errors.dockingTime,
            }"
          />
          <!-- Display error message if docking time is invalid -->
          <span
            v-if="errors.dockingTime"
            class="text-space-martian-red text-sm"
            >{{ errors.dockingTime }}</span
          >
        </div>
        <!-- Docking bay input field -->
        <div class="mb-4">
          <label
            class="block text-space-starlight-white"
            for="bayId"
            >Docking Bay</label
          >
          <input
            id="bayId"
            v-model="form.bayId"
            type="number"
            class="w-full px-3 py-2 bg-space-dark-blue bg-opacity-80 text-space-starlight-white border border-space-nebula-teal border-opacity-50 rounded focus:border-opacity-100 focus:ring-2 focus:ring-space-nebula-teal focus:ring-opacity-50 outline-none"
            :class="{
              'border-space-martian-red': errors.bayId,
            }"
          />
          <!-- Display error message if bay ID is invalid -->
          <span
            v-if="errors.bayId"
            class="text-space-martian-red text-sm"
            >{{ errors.bayId }}</span
          >
        </div>
        <!-- Submit button, disabled while loading -->
        <button
          type="submit"
          class="bg-space-nebula-teal hover:bg-space-nebula-teal/80 text-space-starlight-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
          :disabled="loading"
        >
          Schedule
        </button>
        <!-- Cancel button to close the modal -->
        <button
          type="button"
          @click="closeModal"
          class="bg-space-cosmic-purple hover:bg-space-cosmic-purple/80 text-space-starlight-white font-bold py-2 px-4 rounded-full transition-colors duration-300 ml-2"
        >
          Cancel
        </button>
        <!-- Display error message if there is an error -->
        <div
          v-if="error"
          class="text-space-martian-red mt-4"
        >
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
  spacecraftId: string;
  dockingTime: string;
  bayId: string;
}>({
  spacecraftId: '',
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
  errors.value = validateDocking(form.value);
  if (Object.keys(errors.value).length === 0) {
    loading.value = true;
    try {
      if (Math.random() < 0.4) {
        throw new Error(
          'Communication failure with docking control system. Please try again.'
        );
      }

      emit('schedule-docking', {
        spacecraftId: form.value.spacecraftId,
        dockingTime: form.value.dockingTime,
        bayId: parseInt(form.value.bayId, 10),
      });
      closeModal();
      form.value = {
        spacecraftId: '',
        dockingTime: '',
        bayId: '',
      };
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  }
};

// Close the modal
const closeModal = () => {
  emit('close');
};
</script>
