import {
  shallowMount,
  flushPromises,
} from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import { RouterLinkStub } from '@vue/test-utils';
import SpacecraftList from '@/components/SpacecraftList.vue';
import { useMockServer } from '../../tests/useMockServer';

// 💡 Note: You'll want to use this to help you refactor your tests
// to use Vue Testing Library
function renderComponent(component, options = {}) {
  const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/', component: component }],
  });

  const target = render(component, {
    global: {
      plugins: [router],
    },
    ...options,
  });

  return target;
}

function shallowMountComponent(component, options = {}) {
  return shallowMount(component, {
    ...options,
    global: {
      stubs: {
        // 💡 Note: The RouterLinkStub is needed so we can test the navigation links
        RouterLink: RouterLinkStub,
      },
    },
  });
}

describe('SpacecraftList.vue', () => {
  /**
   * 🔄 Refresher: useMockServer and MSW were covered in Exercise 9.
   *
   * useMockServer is a utility function that sets up a mock server for testing.
   * It provides methods to mock API responses for spacecraft and docking data,
   * allowing us to test our components in isolation from the actual backend.
   * This includes mocking successful responses as well as error scenarios.
   */
  const {
    useMockSpacecrafts,
    useErrorFetchingSpacecrafts,
  } = useMockServer();

  let wrapper;

  beforeEach(() => {
    setActivePinia(createPinia());
    wrapper = shallowMountComponent(SpacecraftList);
  });

  describe('Component rendering', () => {
    // 🛠️ Refactor: Rewrite this test to use Vue Testing Library
    it('renders the SpacecraftList component without errors', () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('h1').text()).toBe(
        'Spacecraft Management'
      );
    });

    // 🛠️ Refactor: Rewrite this test to use Vue Testing Library
    it('displays the "Add Spacecraft" button with correct text', () => {
      const addButton =
        wrapper.findComponent(RouterLinkStub);
      expect(addButton.exists()).toBe(true);
      expect(addButton.text()).toBe('Add Spacecraft');
    });

    it('renders table headers correctly', async () => {
      // 🔄 Refresher: useMockSpacecrafts is a utility function that mocks the spacecraft data
      useMockSpacecrafts([
        {
          id: 1,
          name: 'Apollo',
          type: 'Lunar Module',
          captain: 'Neil Armstrong',
        },
      ]);

      wrapper = shallowMountComponent(SpacecraftList);

      // 💡 Note: We use flushPromises() to ensure all pending promises are resolved
      // This is important when testing components that fetch data asynchronously
      await flushPromises();

      const headers = wrapper.findAll('thead th');
      expect(headers).toHaveLength(4);

      const headerTexts = headers.map((header) =>
        header.text()
      );
      expect(headerTexts).toEqual([
        'Name',
        'Type',
        'Captain',
        'Actions',
      ]);
    });
  });

  describe('Spacecraft list', () => {
    // 🛠️ Refactor: Rewrite this test to use Vue Testing Library
    it('renders a list of spacecrafts', async () => {
      useMockSpacecrafts([
        {
          id: 1,
          name: 'Apollo',
          type: 'Lunar Module',
          captain: 'Neil Armstrong',
        },
        {
          id: 2,
          name: 'Enterprise',
          type: 'Explorer',
          captain: 'James Kirk',
        },
      ]);

      wrapper = shallowMountComponent(SpacecraftList);

      await flushPromises();

      const rows = wrapper.findAll('tbody tr');
      expect(rows).toHaveLength(2);

      expect(rows[0].find('td').text()).toBe('Apollo');
      expect(rows[0].findAll('td')[1].text()).toBe(
        'Lunar Module'
      );
      expect(rows[0].findAll('td')[2].text()).toBe(
        'Neil Armstrong'
      );

      expect(rows[1].find('td').text()).toBe('Enterprise');
      expect(rows[1].findAll('td')[1].text()).toBe(
        'Explorer'
      );
      expect(rows[1].findAll('td')[2].text()).toBe(
        'James Kirk'
      );
    });

    it('shows loading state initially', () => {
      expect(wrapper.text()).toContain('Loading...');
    });

    // 🛠️ Refactor: Rewrite this test to use Vue Testing Library
    it('removes loading state and displays spacecrafts after loading', async () => {
      useMockSpacecrafts([
        {
          id: 1,
          name: 'Apollo',
          type: 'Lunar Module',
          captain: 'Neil Armstrong',
        },
      ]);

      wrapper = shallowMountComponent(SpacecraftList);

      expect(wrapper.text()).toContain('Loading...');

      await flushPromises();

      expect(wrapper.text()).not.toContain('Loading...');
      const rows = wrapper.findAll('tbody tr');
      expect(rows).toHaveLength(1);
    });

    it('displays an error message when server returns an error', async () => {
      // 🔄 Refresher: useErrorFetchingSpacecrafts mocks an error fetching spacecrafts
      useErrorFetchingSpacecrafts();

      wrapper = shallowMountComponent(SpacecraftList);

      await flushPromises();

      expect(wrapper.text()).toContain('Network error');
    });
  });

  describe('Navigation links', () => {
    it('has a link to add spacecraft page', async () => {
      const addButton =
        wrapper.findComponent(RouterLinkStub);
      expect(addButton.exists()).toBe(true);
      expect(addButton.props('to')).toBe('/spacecraft/add');
    });

    // 🛠️ Refactor: Rewrite this test to use Vue Testing Library
    it('has correct edit links for each spacecraft', async () => {
      useMockSpacecrafts([
        {
          id: 1,
          name: 'Apollo',
          type: 'Lunar Module',
          captain: 'Neil Armstrong',
        },
        {
          id: 2,
          name: 'Voyager',
          type: 'Probe',
          captain: 'Carl Sagan',
        },
      ]);

      wrapper = shallowMountComponent(SpacecraftList);

      await flushPromises();

      const editLinks =
        wrapper.findAllComponents(RouterLinkStub);
      expect(editLinks.length).toBe(3);

      expect(editLinks[1].props().to).toBe(
        '/spacecraft/edit/1'
      );
      expect(editLinks[1].text()).toBe('Edit');

      expect(editLinks[2].props().to).toBe(
        '/spacecraft/edit/2'
      );
      expect(editLinks[2].text()).toBe('Edit');
    });
  });
});
