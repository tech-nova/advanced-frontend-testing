<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">
      Docking Dashboard
    </h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Section for currently docked spacecraft -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-xl font-semibold mb-2">
          Currently Docked Spacecraft
        </h2>
        <!-- List of currently docked spacecraft -->
        <ul
          v-if="currentDocked.length > 0"
          class="divide-y"
        >
          <li
            v-for="docking in currentDocked"
            :key="docking.id"
            class="py-3"
          >
            <!-- Display spacecraft name and type -->
            {{ getSpacecraftName(docking.spacecraftId) }} -
            {{ getSpacecraftType(docking.spacecraftId) }}
          </li>
        </ul>
        <!-- Message when no spacecraft are currently docked -->
        <p v-else>No currently docked spacecraft</p>
      </div>
      <!-- Section for upcoming dockings -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-xl font-semibold mb-2">
          Upcoming Dockings
        </h2>
        <!-- List of upcoming dockings -->
        <ul
          v-if="upcomingDockings.length > 0"
          class="divide-y"
        >
          <li
            v-for="docking in upcomingDockings"
            :key="docking.id"
            class="py-3"
          >
            <!-- Display spacecraft name and formatted docking time -->
            {{ getSpacecraftName(docking.spacecraftId) }} -
            {{ formatDate(docking.dockingTime) }}
          </li>
        </ul>
        <!-- Message when no upcoming dockings are scheduled -->
        <p v-else>No upcoming dockings</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSpacecraft } from '@/composables/useSpacecraft';
import { useDockingStore } from '@/stores/dockingStore';
import type { Docking, Spacecraft } from '@/types';

// Get dockings data from the docking store
const dockingStore = useDockingStore();
// Get spacecraft data from the useSpacecraft composable
const { spacecrafts } = useSpacecraft();

// Compute the list of currently docked spacecraft
const currentDocked = computed<Docking[]>(() => {
  return dockingStore.dockings.filter(
    (d: Docking) => d.status === 'docked'
  );
});

// Compute the list of upcoming dockings
const upcomingDockings = computed<Docking[]>(() => {
  return dockingStore.dockings.filter(
    (d: Docking) => d.status === 'scheduled'
  );
});

// Format ISO date string to a more readable format
const formatDate = (isoString: string): string => {
  return new Date(isoString).toLocaleString();
};

// Get the name of a spacecraft by its ID
const getSpacecraftName = (
  spacecraftId: string
): string => {
  const spacecraft = spacecrafts.value.find(
    (s: Spacecraft) => s.id === spacecraftId
  );
  return spacecraft ? spacecraft.name : 'Unknown'; // Return 'Unknown' if spacecraft not found
};

// Get the type of a spacecraft by its ID
const getSpacecraftType = (
  spacecraftId: string
): string => {
  const spacecraft = spacecrafts.value.find(
    (s: Spacecraft) => s.id === spacecraftId
  );
  return spacecraft ? spacecraft.type : 'Unknown'; // Return 'Unknown' if spacecraft not found
};
</script>
