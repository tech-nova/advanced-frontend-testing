import { mount } from '@vue/test-utils';
import { render } from '@testing-library/vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import App from '@/App.vue'; // Your App.vue component
import Dashboard from '@/components/Dashboard.vue'; // Component to test route navigation
import SpacecraftList from '@/components/SpacecraftList.vue'; // Another component for route navigation

describe('App.vue Navigation', () => {
  let router;
  let pinia;

  beforeEach(() => {
    // Set up Pinia
    pinia = createPinia();
    setActivePinia(pinia);

    // Set up router
    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          name: 'Dashboard',
          component: Dashboard,
        },
        {
          path: '/spacecraft',
          name: 'SpacecraftList',
          component: SpacecraftList,
        },
      ],
    });
  });

  it('navigates to SpacecraftList route', async () => {
    // Mount App.vue with router and Pinia
    const wrapper = render(App, {
      global: {
        plugins: [router],
      },
    });

    // Initial route should be '/'
    await router.push('/');
    await router.isReady();

    // Check that the dashboard component is rendered
    expect(wrapper.html()).toContain('Dashboard');

    // Navigate to the spacecraft route
    await router.push('/spacecraft');
    await router.isReady();

    // Assert that the SpacecraftList component is rendered
    expect(wrapper.html()).toContain('Spacecraft');
  });
});
