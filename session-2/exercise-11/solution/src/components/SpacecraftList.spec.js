import {
  render,
  screen,
  waitForElementToBeRemoved,
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
      const wrapper = shallowMountComponent(SpacecraftList);

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
    // ✨ Refactored to use Vue Testing Library
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
      renderComponent(SpacecraftList);

      const rows = await screen.findAllByRole('row');
      expect(rows).toHaveLength(3);

      expect(screen.getByText('Apollo')).toBeDefined();
      expect(
        screen.getByText('Lunar Module')
      ).toBeDefined();
      expect(
        screen.getByText('Neil Armstrong')
      ).toBeDefined();

      expect(screen.getByText('Enterprise')).toBeDefined();
      expect(screen.getByText('Explorer')).toBeDefined();
      expect(screen.getByText('James Kirk')).toBeDefined();
    });

    it('shows loading state initially', () => {
      const wrapper = shallowMountComponent(SpacecraftList);
      expect(wrapper.text()).toContain('Loading...');
    });

    // ✨ Refactored to use Vue Testing Library
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

      // Check that loading state is initially present
      expect(
        screen.getByText(/loading\.\.\./i)
      ).toBeDefined();

      // Wait for the loading element to disappear
      await waitForElementToBeRemoved(() =>
        screen.queryByText(/loading\.\.\./i)
      );

      // Verify that loading state is removed
      expect(
        screen.queryByText(/loading\.\.\./i)
      ).toBeNull();

      // Check if spacecrafts are displayed
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(2); // Header row + 1 spacecraft row

      // Verify spacecraft data is displayed
      expect(screen.getByText('Apollo')).toBeDefined();
      expect(
        screen.getByText('Lunar Module')
      ).toBeDefined();
      expect(
        screen.getByText('Neil Armstrong')
      ).toBeDefined();
    });

    it('displays an error message when server returns an error', async () => {
      // 🔄 Refresher: useErrorFetchingSpacecrafts mocks an error fetching spacecrafts
      useErrorFetchingSpacecrafts();
      const wrapper = shallowMountComponent(SpacecraftList);

      await flushPromises();

      expect(wrapper.text()).toContain('Network error');
    });
  });

  describe('Navigation links', () => {
    it('has a link to add spacecraft page', async () => {
      const wrapper = shallowMountComponent(SpacecraftList);
      const addButton =
        wrapper.findComponent(RouterLinkStub);
      expect(addButton.exists()).toBe(true);
      expect(addButton.props('to')).toBe('/spacecraft/add');
    });

    // ✨ Refactored to use Vue Testing Library
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
      const { findAllByText } =
        renderComponent(SpacecraftList);

      const editLinks = await findAllByText(/edit/i);
      expect(editLinks).toHaveLength(2);

      expect(editLinks[0].getAttribute('href')).toBe(
        '/spacecraft/edit/1'
      );
      expect(editLinks[1].getAttribute('href')).toBe(
        '/spacecraft/edit/2'
      );
    });
  });
});
