<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Notifications</h1>
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else>
      <ul>
        <li
          v-for="notification in notifications"
          :key="notification.id"
          class="bg-white p-4 mb-2 rounded shadow"
        >
          <p>{{ notification.message }}</p>
          <small class="text-gray-500">{{
            formatDate(notification.timestamp)
          }}</small>
        </li>
      </ul>
      <div v-if="error" class="text-red-500 mt-4">
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
