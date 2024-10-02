<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">
        Spacecraft Management
      </h1>
      <router-link
        to="/spacecraft/add"
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add Spacecraft
      </router-link>
    </div>
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else>
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">Name</th>
            <th class="py-2 px-4 border-b">Type</th>
            <th class="py-2 px-4 border-b">Captain</th>
            <th class="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="spacecraft in spacecrafts"
            :key="spacecraft.id"
            class="text-center border-t"
          >
            <td class="py-2 px-4">{{ spacecraft.name }}</td>
            <td class="py-2 px-4">{{ spacecraft.type }}</td>
            <td class="py-2 px-4">
              {{ spacecraft.captain }}
            </td>
            <td class="py-2 px-4">
              <router-link
                :to="`/spacecraft/edit/${spacecraft.id}`"
                class="text-blue-500 hover:underline"
              >
                Edit
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="error" class="text-red-500 mt-4">
        {{ error.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSpacecraft } from '@/composables/useSpacecraft';

const { spacecrafts, loading, error } = useSpacecraft();
</script>
