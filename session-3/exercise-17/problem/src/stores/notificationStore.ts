import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '@/services/apiService';

export const useNotificationStore = defineStore(
  'notification',
  () => {
    const notifications = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const fetchNotifications = async () => {
      loading.value = true;
      try {
        notifications.value =
          await apiService.getNotifications();
      } catch (err) {
        error.value = err;
      } finally {
        loading.value = false;
      }
    };

    const sendNotification = async (data) => {
      loading.value = true;
      try {
        const newNotification =
          await apiService.sendNotification(data);
        notifications.value.push(newNotification);
      } catch (err) {
        error.value = err;
      } finally {
        loading.value = false;
      }
    };

    return {
      notifications,
      loading,
      error,
      fetchNotifications,
      sendNotification,
    };
  }
);
