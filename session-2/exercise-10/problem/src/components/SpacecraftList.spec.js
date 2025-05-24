import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/vue';
import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import SpacecraftList from '@/components/SpacecraftList.vue';
import { useMockServer } from '../../tests/useMockServer';
import {
  shallowMount,
  flushPromises,
  RouterLinkStub,
} from '@vue/test-utils';

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

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Component rendering', () => {

    // ✨ Refactored to use Vue Testing Library
    it('renders the SpacecraftList component without errors', () => {
      renderComponent(SpacecraftList);
      const heading = screen.getByRole('heading', {
        name: 'Spacecraft Management',
      });
      expect(heading).toBeDefined();
    });

    // ✨ Refactored to use Vue Testing Library
    it('displays the "Add Spacecraft" button with correct text', () => {
      renderComponent(SpacecraftList);
      const addButton = screen.getByRole('link', {
        name: /add/i,
      });
      expect(addButton).toBeDefined();
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
      const {findAllByRole, findByRole } = renderComponent(SpacecraftList);
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

      const spacecrafts = await findAllByRole('row');
      const table = await findByRole('table');

      expect(spacecrafts).toHaveLength(3);

      expect(table).toBeDefined();

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

      renderComponent(SpacecraftList);

      await waitForElementToBeRemoved(() =>
        screen.queryByText(/loading\.\.\./i)
      );

      expect(screen.getByText('Apollo')).toBeInTheDocument();
      expect(screen.getByText('Lunar Module')).toBeInTheDocument();
      expect(screen.getByText('Neil Armstrong')).toBeInTheDocument();
    });

    it('displays an error message when server returns an error', async () => {
      // 🔄 Refresher: useErrorFetchingSpacecrafts mocks an error fetching spacecrafts
      useErrorFetchingSpacecrafts();

      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  describe('Navigation links', () => {
    it('has a link to add spacecraft page', async () => {
      renderComponent(SpacecraftList);
      const addButton = screen.getByRole('link', {
        name: /add spacecraft/i,
      });
      expect(addButton).toBeInTheDocument();
      expect(addButton.getAttribute('href')).toBe('/spacecrafts/add');
    });

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

      const { getByRole, findAllByRole } = renderComponent(SpacecraftList);
      const editLinks = await findAllByRole('link', {
        name: /edit/i,
      });

      expect(editLinks).toHaveLength(2);

      expect(editLinks[0].getAttribute('href')).toBe('/spacecraft/edit/1');
      expect(editLinks[0].textContent).toBe(' Edit ');

      expect(editLinks[1].getAttribute('href')).toBe('/spacecraft/edit/2');
      expect(editLinks[1].textContent).toBe(' Edit ');
    });
  });
});
