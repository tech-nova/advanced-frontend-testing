<template>
  <div
    class="bg-space-deep-blue text-space-starlight-white p-6"
  >
    <h1
      class="text-3xl font-bold mb-6 text-space-nebula-teal"
    >
      Docking Dashboard
    </h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Section for currently docked spacecraft -->
      <div
        class="bg-space-dark-blue bg-opacity-80 p-6 rounded-lg border border-space-nebula-teal border-opacity-30 shadow-lg shadow-space-nebula-teal/10 hover:shadow-xl hover:shadow-space-nebula-teal/20 transition-shadow duration-300"
      >
        <h2
          class="text-xl font-semibold mb-4 text-space-starlight-white"
        >
          Currently Docked Spacecraft
        </h2>
        <!-- List of currently docked spacecraft -->
        <ul
          v-if="currentDocked.length > 0"
          class="divide-y divide-space-nebula-teal divide-opacity-30"
        >
          <li
            v-for="docking in currentDocked"
            :key="docking.id"
            class="py-4 flex items-center"
          >
            <span
              class="inline-block w-3 h-3 rounded-full bg-space-alien-green mr-3"
            ></span>
            <!-- Display spacecraft name and type -->
            <span
              >{{ getSpacecraftName(docking.spacecraftId) }}
              -
              {{
                getSpacecraftType(docking.spacecraftId)
              }}</span
            >
          </li>
        </ul>
        <!-- Message when no spacecraft are currently docked -->
        <p v-else class="text-space-solar-flare">
          No currently docked spacecraft
        </p>
      </div>
      <!-- Section for upcoming dockings -->
      <div
        class="bg-space-dark-blue bg-opacity-80 p-6 rounded-lg border border-space-nebula-teal border-opacity-30 shadow-lg shadow-space-nebula-teal/10 hover:shadow-xl hover:shadow-space-nebula-teal/20 transition-shadow duration-300"
      >
        <h2
          class="text-xl font-semibold mb-4 text-space-starlight-white"
        >
          Upcoming Dockings
        </h2>
        <!-- List of upcoming dockings -->
        <ul
          v-if="upcomingDockings.length > 0"
          class="divide-y divide-space-nebula-teal divide-opacity-30"
        >
          <li
            v-for="docking in upcomingDockings"
            :key="docking.id"
            class="py-4 flex items-center"
          >
            <span
              class="inline-block w-3 h-3 rounded-full bg-space-cosmic-purple mr-3"
            ></span>
            <!-- Display spacecraft name and formatted docking time -->
            <span
              >{{
                getSpacecraftName(docking.spacecraftId)
              }}
              - {{ formatDate(docking.dockingTime) }}</span
            >
          </li>
        </ul>
        <!-- Message when no upcoming dockings are scheduled -->
        <p v-else class="text-space-solar-flare">
          No upcoming dockings
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import necessary functions from Vue and custom composables
import { computed } from 'vue';
import { useDocking } from '@/composables/useDocking';
import { useSpacecraft } from '@/composables/useSpacecraft';
import type {
  DockingWithSpacecraft,
  Spacecraft,
} from '@/types';

// Get dockings data from the useDocking composable
const { dockings } = useDocking();
// Get spacecraft data from the useSpacecraft composable
const { spacecrafts } = useSpacecraft();

// Compute the list of currently docked spacecraft
const currentDocked = computed<DockingWithSpacecraft[]>(
  () => {
    return dockings.value.filter(
      (d: DockingWithSpacecraft) => d.status === 'docked' // Filter dockings with status 'docked'
    );
  }
);

// Compute the list of upcoming dockings
const upcomingDockings = computed<DockingWithSpacecraft[]>(
  () => {
    return dockings.value.filter(
      (d: DockingWithSpacecraft) => d.status === 'scheduled' // Filter dockings with status 'scheduled'
    );
  }
);

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
