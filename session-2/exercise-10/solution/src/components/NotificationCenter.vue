<template>
  <div
    class="bg-space-deep-blue bg-opacity-90 text-space-starlight-white p-6 rounded-lg shadow-lg"
  >
    <!-- Header section with title -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-space-nebula-teal">
        Notifications
      </h1>
    </div>
    <!-- Loading indicator -->
    <div
      v-if="loading"
      class="text-center text-space-nebula-teal"
    >
      Loading...
    </div>
    <div
      v-else
      class="bg-space-dark-blue bg-opacity-80 rounded-lg border-space-nebula-teal border-opacity-30"
    >
      <!-- Notifications list -->
      <ul
        class="bg-space-dark-blue bg-opacity-80 rounded-lg overflow-hidden"
      >
        <li
          v-for="notification in notifications"
          :key="notification.id"
          class="p-4 border-b border-space-nebula-teal border-opacity-30 hover:bg-space-nebula-teal hover:bg-opacity-20 transition-colors duration-300"
        >
          <p class="text-space-starlight-white mb-2">
            {{ notification.message }}
          </p>
          <small class="text-space-alien-green">{{
            formatDate(notification.timestamp)
          }}</small>
        </li>
      </ul>
      <!-- Error message display -->
      <div v-if="error" class="text-space-martian-red mt-4">
        {{ error.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore';

const store = useNotificationStore();

onMounted(() => {
  store.fetchNotifications();
});

const notifications = computed(() => store.notifications);
const loading = computed(() => store.loading);
const error = computed(() => store.error);

const formatDate = (isoString) => {
  return new Date(isoString).toLocaleString();
};
</script>
