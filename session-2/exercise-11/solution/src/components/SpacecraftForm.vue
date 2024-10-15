<template>
  <div class="">
    <h1
      class="text-2xl font-bold mb-4 text-space-starlight-white"
    >
      {{ isEdit ? 'Edit Spacecraft' : 'Add Spacecraft' }}
    </h1>
    <form
      @submit.prevent="handleSubmit"
      class="max-w-md bg-space-dark-blue bg-opacity-80 p-6 rounded-lg shadow-lg shadow-space-nebula-teal/10"
    >
      <div class="mb-4">
        <label class="block text-space-starlight-white"
          >Name</label
        >
        <input
          v-model="form.name"
          type="text"
          class="w-full px-3 py-2 bg-space-dark-blue bg-opacity-80 text-space-starlight-white border border-space-nebula-teal border-opacity-50 rounded focus:border-opacity-100 focus:ring-2 focus:ring-space-nebula-teal focus:ring-opacity-50 outline-none"
          :class="{
            'border-space-martian-red': errors.name,
          }"
        />
        <span
          v-if="errors.name"
          class="text-space-martian-red text-sm"
          >{{ errors.name }}</span
        >
      </div>
      <div class="mb-4">
        <label class="block text-space-starlight-white"
          >Type</label
        >
        <input
          v-model="form.type"
          type="text"
          class="w-full px-3 py-2 bg-space-dark-blue bg-opacity-80 text-space-starlight-white border border-space-nebula-teal border-opacity-50 rounded focus:border-opacity-100 focus:ring-2 focus:ring-space-nebula-teal focus:ring-opacity-50 outline-none"
          :class="{
            'border-space-martian-red': errors.type,
          }"
        />
        <span
          v-if="errors.type"
          class="text-space-martian-red text-sm"
          >{{ errors.type }}</span
        >
      </div>
      <div class="mb-4">
        <label class="block text-space-starlight-white"
          >Captain</label
        >
        <input
          v-model="form.captain"
          type="text"
          class="w-full px-3 py-2 bg-space-dark-blue bg-opacity-80 text-space-starlight-white border border-space-nebula-teal border-opacity-50 rounded focus:border-opacity-100 focus:ring-2 focus:ring-space-nebula-teal focus:ring-opacity-50 outline-none"
          :class="{
            'border-space-martian-red': errors.captain,
          }"
        />
        <span
          v-if="errors.captain"
          class="text-space-martian-red text-sm"
          >{{ errors.captain }}</span
        >
      </div>
      <button
        type="submit"
        class="bg-space-nebula-teal hover:bg-space-nebula-teal/80 text-space-starlight-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
        :disabled="loading"
      >
        {{ isEdit ? 'Update' : 'Add' }}
      </button>
      <div v-if="error" class="text-space-martian-red mt-4">
        {{ error.message }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useSpacecraft } from '@/composables/useSpacecraft';
import { useRoute, useRouter } from 'vue-router';
import { validateSpacecraft } from '@/utils/validation';

const route = useRoute();
const router = useRouter();
const isEdit = computed(
  () => route.name === 'EditSpacecraft'
);
const spacecraftId = computed(() =>
  isEdit.value ? route.params.id : null
);

const form = ref({
  name: '',
  type: '',
  captain: '',
});

const {
  spacecrafts,
  addSpacecraft,
  updateSpacecraft,
  loading,
  error,
} = useSpacecraft();

const currentSpacecraft = computed(() =>
  spacecrafts.value.find(
    (sc) => sc.id === spacecraftId.value
  )
);

watch(
  currentSpacecraft,
  (newSpacecraft) => {
    if (newSpacecraft) {
      form.value = { ...newSpacecraft };
    }
  },
  { immediate: true }
);

const errors = computed(() =>
  validateSpacecraft(form.value)
);

const validForm = computed(() => {
  return Object.keys(errors.value).length === 0;
});

const handleSubmit = async () => {
  if (validForm.value) {
    if (isEdit.value) {
      await updateSpacecraft(
        spacecraftId.value,
        form.value
      );
    } else {
      await addSpacecraft(form.value);
    }
    router.push('/spacecraft');
  }
};
</script>
