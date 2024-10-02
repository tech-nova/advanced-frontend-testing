<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">
      {{ isEdit ? 'Edit Spacecraft' : 'Add Spacecraft' }}
    </h1>
    <form
      @submit.prevent="handleSubmit"
      class="max-w-md bg-white p-6 rounded shadow"
    >
      <div class="mb-4">
        <label class="block text-gray-700">Name</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-red-500': errors.name }"
        />
        <span
          v-if="errors.name"
          class="text-red-500 text-sm"
          >{{ errors.name }}</span
        >
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Type</label>
        <input
          v-model="form.type"
          type="text"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-red-500': errors.type }"
        />
        <span
          v-if="errors.type"
          class="text-red-500 text-sm"
          >{{ errors.type }}</span
        >
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Captain</label>
        <input
          v-model="form.captain"
          type="text"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-red-500': errors.captain }"
        />
        <span
          v-if="errors.captain"
          class="text-red-500 text-sm"
          >{{ errors.captain }}</span
        >
      </div>
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        :disabled="loading"
      >
        {{ isEdit ? 'Update' : 'Add' }}
      </button>
      <div v-if="error" class="text-red-500 mt-4">
        {{ error.message }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSpacecraft } from '@/composables/useSpacecraft';
import { useRoute, useRouter } from 'vue-router';
import { validateSpacecraft } from '@/utils/validation';

const route = useRoute();
const router = useRouter();
const isEdit = ref(false);
const spacecraftId = ref(null);

const form = ref({
  name: '',
  type: '',
  captain: '',
});

const errors = ref({});
const {
  spacecrafts,
  addSpacecraft,
  updateSpacecraft,
  loading,
  error,
} = useSpacecraft();

onMounted(() => {
  if (route.name === 'EditSpacecraft') {
    isEdit.value = true;
    spacecraftId.value = route.params.id;
    const spacecraft = spacecrafts.value.find(
      (sc) => sc.id === spacecraftId.value
    );
    if (spacecraft) {
      form.value = { ...spacecraft };
    }
  }
});

const handleSubmit = async () => {
  errors.value = validateSpacecraft(form.value);
  if (Object.keys(errors.value).length === 0) {
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
