<template>
  <div
    class="bg-space-deep-blue bg-opacity-90 p-6 rounded-lg shadow-lg"
  >
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-space-nebula-teal">
        Spacecraft Management
      </h1>
      <router-link
        to="/spacecraft/add"
        class="bg-space-nebula-teal hover:bg-space-nebula-teal/80 text-space-starlight-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
      >
        Add Spacecraft
      </router-link>
    </div>
    <div
      v-if="loading"
      class="text-center text-space-starlight-white"
    >
      Loading...
    </div>
    <div v-else>
      <table
        class="min-w-full bg-space-dark-blue bg-opacity-80 rounded-lg overflow-hidden"
      >
        <thead class="bg-space-cosmic-purple">
          <tr>
            <th
              class="py-3 px-4 text-space-starlight-white font-bold text-left"
            >
              Name
            </th>
            <th
              class="py-3 px-4 text-space-starlight-white font-bold text-left"
            >
              Type
            </th>
            <th
              class="py-3 px-4 text-space-starlight-white font-bold text-left"
            >
              Captain
            </th>
            <th
              class="py-3 px-4 text-space-starlight-white font-bold text-left"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="spacecraft in spacecrafts"
            :key="spacecraft.id"
            class="border-b border-space-nebula-teal border-opacity-30 hover:bg-space-nebula-teal hover:bg-opacity-20 transition-colors duration-300"
          >
            <td
              class="py-3 px-4 text-space-starlight-white"
            >
              {{ spacecraft.name }}
            </td>
            <td
              class="py-3 px-4 text-space-starlight-white"
            >
              {{ spacecraft.type }}
            </td>
            <td
              class="py-3 px-4 text-space-starlight-white"
            >
              {{ spacecraft.captain }}
            </td>
            <td class="py-3 px-4">
              <router-link
                :to="`/spacecraft/edit/${spacecraft.id}`"
                class="text-space-nebula-teal hover:text-space-solar-flare transition-colors duration-300"
              >
                Edit
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="error" class="text-space-martian-red mt-4">
        {{ error.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSpacecraft } from '@/composables/useSpacecraft';

const { spacecrafts, loading, error } = useSpacecraft();
</script>
