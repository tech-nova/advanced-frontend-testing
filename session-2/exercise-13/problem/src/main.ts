import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import './index.css';

// Conditionally start MSW
if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('../tests/mocks/browser');
  await worker.start({
    onUnhandledRequest: 'bypass', // This will allow non-mocked requests to pass through
  });
}

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(router);

app.mount('#app');
