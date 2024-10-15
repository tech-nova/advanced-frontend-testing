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
      <div
        class="min-w-full bg-space-dark-blue bg-opacity-80 rounded-lg overflow-hidden"
        role="table"
      >
        <div
          class="grid grid-cols-4 bg-space-cosmic-purple"
          role="row"
        >
          <div
            v-for="header in [
              'Name',
              'Type',
              'Captain',
              'Actions',
            ]"
            :key="header"
            class="py-3 px-4 text-space-starlight-white font-bold text-left"
            role="columnheader"
          >
            {{ header }}
          </div>
        </div>
        <div role="rowgroup">
          <div
            v-for="spacecraft in spacecrafts"
            :key="spacecraft.id"
            class="grid grid-cols-4 border-b border-space-nebula-teal border-opacity-30 hover:bg-space-nebula-teal hover:bg-opacity-20 transition-colors duration-300"
            role="row"
          >
            <div
              v-for="prop in ['name', 'type', 'captain']"
              :key="prop"
              class="py-3 px-4 text-space-starlight-white"
              role="cell"
            >
              {{ spacecraft[prop] }}
            </div>
            <div class="py-3 px-4" role="cell">
              <router-link
                :to="`/spacecraft/edit/${spacecraft.id}`"
                class="text-space-nebula-teal hover:text-space-solar-flare transition-colors duration-300"
              >
                Edit
              </router-link>
            </div>
          </div>
        </div>
      </div>
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
