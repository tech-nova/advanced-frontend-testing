import { mount, flushPromises } from '@vue/test-utils';
import { render } from '@testing-library/vue';
import { render, fireEvent } from '@testing-library/vue';
import {
  render,
  fireEvent,
  waitFor,
} from '@testing-library/vue';
import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  afterEach,
} from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from '@/App.vue';
import SpacecraftForm from '@/components/SpacecraftForm.vue';
import SpacecraftList from '@/components/SpacecraftList.vue';
import Dashboard from '@/components/Dashboard.vue';
import { useMockServer } from '../../tests/useMockServer';

/**
 * 🔄 Refresher: Mocking functions was covered in Exercise 4.
 *
 * We only use this for the test 'displays validation errors when form is invalid'.
 */
vi.mock('@/utils/validation', () => ({
  validateSpacecraft: vi.fn(() => ({})),
}));

describe('SpacecraftForm.vue', () => {
  /**
   * 🔄 Refresher: useMockServer and MSW were covered in Exercise 9.
   *
   * useMockCreateSpacecraft is a utility function that mocks the creation of a new spacecraft
   * useMockSpacecrafts is a utility function that mocks the spacecraft data
   * useErrorFetchingSpacecrafts is a utility function that mocks the error fetching spacecraft data
   */
  const {
    useMockCreateSpacecraft,
    useMockSpacecrafts,
    useErrorFetchingSpacecrafts,
    useMockEditSpacecraft,
  } = useMockServer();

  let wrapper;
  let router;

  beforeEach(() => {
    setActivePinia(createPinia());

    /**
     * 💡 Note: If this was a *real* unit test we'd probably want to mock
     * the router. But I want to make things a bit easier for you
     * by giving you a bit of a head start here.
     */
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: Dashboard },
        {
          path: '/spacecraft',
          component: SpacecraftList,
          name: 'SpacecraftList',
        },
        {
          path: '/spacecraft/add',
          component: SpacecraftForm,
          name: 'AddSpacecraft',
        },
        {
          path: '/spacecraft/edit/:id',
          component: SpacecraftForm,
          name: 'EditSpacecraft',
        },
      ],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mountComponent = async (
    route = '/spacecraft/add'
  ) => {
    /**
     * 💡 Note: We need to navigate to the route before mounting the component.
     * This is necessary for Vue Router to know the current route.
     *
     * We use `await router.isReady()` to make sure the router is ready.
     */
    router.push(route);
    await router.isReady();

    return mount(SpacecraftForm, {
      global: {
        plugins: [router],
      },
    });
  };

  describe('Component rendering', () => {
    it('displays the correct title for add mode', async () => {
      wrapper = await mountComponent();

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('h1').text()).toBe(
        'Add Spacecraft'
      );
    });

    it('displays the correct title for edit mode', async () => {
      wrapper = await mountComponent('/spacecraft/edit/1');

      expect(wrapper.find('h1').text()).toBe(
        'Edit Spacecraft'
      );
    });

    it('renders form fields correctly', async () => {
      wrapper = await mountComponent();

      const inputs = wrapper.findAll('input');
      expect(inputs).toHaveLength(3);
      expect(inputs[0].attributes('type')).toBe('text');
      expect(inputs[1].attributes('type')).toBe('text');
      expect(inputs[2].attributes('type')).toBe('text');
    });

    it('displays the correct button text in add mode', async () => {
      wrapper = await mountComponent();

      const button = wrapper.find('button[type="submit"]');
      expect(button.text()).toBe('Add');
    });

    it('displays the correct button text in edit mode', async () => {
      wrapper = await mountComponent('/spacecraft/edit/1');

      const button = wrapper.find('button[type="submit"]');
      expect(button.text()).toBe('Update');
    });
  });

  describe('Form functionality', () => {
    // ✨ Refactored to use Vue Testing Library
    it('populates form fields when editing an existing spacecraft', async () => {
      const mockSpacecraft = {
        id: '1',
        name: 'Enterprise',
        type: 'Explorer',
        captain: 'James Kirk',
      };
      useMockSpacecrafts([mockSpacecraft]);

      router.push('/spacecraft/edit/1');
      await router.isReady();

      const { findByLabelText } = render(SpacecraftForm, {
        global: {
          plugins: [router],
        },
      });

      // We need to wait for the form to be populated with existing data
      // so we can wrap the expect statements in a waitFor
      await waitFor(async () => {
        const nameInput = await findByLabelText('Name');
        const typeInput = await findByLabelText('Type');
        const captainInput = await findByLabelText(
          'Captain'
        );

        expect(nameInput.value).toBe('Enterprise');
        expect(typeInput.value).toBe('Explorer');
        expect(captainInput.value).toBe('James Kirk');
      });
    });

    // ✨ Refactored to use Vue Testing Library
    it('submits the form with correct data for a new spacecraft', async () => {
      // Set up mock data
      useMockCreateSpacecraft();

      // Navigate to the add spacecraft page
      router.push('/spacecraft/add');
      await router.isReady();

      // Render the app so we can navigate between routes
      const {
        getByLabelText,
        getByRole,
        findByText,
        findByRole,
      } = render(App, {
        global: {
          plugins: [router],
        },
      });

      // Make sure we're on the right page
      expect(
        getByRole('heading', { name: 'Add Spacecraft' })
      ).toBeDefined();

      // Update the form fields
      await fireEvent.update(
        getByLabelText('Name'),
        'New Spacecraft'
      );
      await fireEvent.update(
        getByLabelText('Type'),
        'Military'
      );
      await fireEvent.update(
        getByLabelText('Captain'),
        'John Doe'
      );

      // Submit the form
      await fireEvent.submit(getByRole('form'));

      // Wait for the navigation to complete
      await findByRole('heading', {
        name: 'Spacecraft Management',
      });

      // Verify that the form submission was successful
      const newSpacecraft = await findByText(
        'New Spacecraft'
      );
      expect(newSpacecraft).toBeDefined();
    });

    // ✨ Refactored to use Vue Testing Library
    it('submits the form with correct data for an edited spacecraft', async () => {
      const mockSpacecraft = {
        id: '1',
        name: 'Enterprise',
        type: 'Explorer',
        captain: 'James Kirk',
      };
      useMockSpacecrafts([mockSpacecraft]);
      useMockEditSpacecraft();

      // Navigate to the edit spacecraft page
      router.push('/spacecraft/edit/1');
      await router.isReady();

      // Render the app so we can navigate between routes
      const {
        getByLabelText,
        getByRole,
        findByRole,
        findByDisplayValue,
      } = render(App, {
        global: {
          plugins: [router],
        },
      });

      // Make sure we're on the right page
      expect(
        await findByRole('heading', {
          name: 'Edit Spacecraft',
        })
      ).toBeDefined();

      // Wait for the form to be populated with existing data
      await findByDisplayValue('Enterprise');

      // Update the name field
      await fireEvent.update(
        getByLabelText('Name'),
        'Updated Enterprise'
      );

      // Submit the form
      await fireEvent.submit(getByRole('form'));

      // Wait for the navigation to complete
      await findByRole('heading', {
        name: 'Spacecraft Management',
      });

      // Verify that the form submission was successful
      const updatedSpacecraft = await findByRole('cell', {
        name: 'Updated Enterprise',
      });
      expect(updatedSpacecraft).toBeDefined();
    });

    it('displays error message when there is an error', async () => {
      useErrorFetchingSpacecrafts();

      wrapper = await mountComponent('/spacecraft/edit/1');
      await flushPromises();

      expect(wrapper.text()).toContain('Network error');
    });
  });

  it('displays error message when there is an error', async () => {
    useErrorFetchingSpacecrafts();

    wrapper = await mountComponent('/spacecraft/edit/1');
    await flushPromises();

    expect(wrapper.text()).toContain('Network error');
  });
});
