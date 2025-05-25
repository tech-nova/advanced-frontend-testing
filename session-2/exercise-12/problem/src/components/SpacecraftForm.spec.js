import { mount, flushPromises } from '@vue/test-utils';
import { render } from '@testing-library/vue';
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
    it('populates form fields when editing an existing spacecraft', async () => {
      const mockSpacecraft = {
        id: '1',
        name: 'Enterprise',
        type: 'Explorer',
        captain: 'James Kirk',
      };
      useMockSpacecrafts([mockSpacecraft]);

      wrapper = await mountComponent('/spacecraft/edit/1');
      await flushPromises();

      const inputs = wrapper.findAll('input');
      expect(inputs[0].element.value).toBe('Enterprise');
      expect(inputs[1].element.value).toBe('Explorer');
      expect(inputs[2].element.value).toBe('James Kirk');
    });

    // 🛠️ Now we need to test the form submission and not just the navigation
    it('submits the form with correct data for a new spacecraft', async () => {
      const mockSpacecraft = {
        id: '1',
        name: 'Enterprise',
        type: 'Explorer',
        captain: 'James Kirk',
      };

      // Navigate to the add spacecraft page
      router.push('/spacecraft/add');
      await router.isReady();

      // Render the app so we can navigate between routes
      const { getByRole, findByRole } = render(App, {
        global: {
          plugins: [router],
        },
      });

      // Make sure we're on the right page
      expect(
        getByRole('heading', { name: 'Add Spacecraft' })
      ).toBeDefined();
    expect(getByRole('button', { name: 'Add' })).toBeDefined();

      // Fill in the form
      const inputs = wrapper.findAll('input');
      await inputs[0].setValue(mockSpacecraft.name);
      await inputs[1].setValue(mockSpacecraft.type);
      await inputs[2].setValue(mockSpacecraft.captain);

      await wrapper.find('form').trigger('submit.prevent');

      expect(wrapper.vm.form).toEqual(mockSpacecraft);

      router.push('/spacecraft');
      await router.isReady();
      // Check if the spacecraft is created
      expect(wrapper.vm.spacecrafts).toContainEqual(mockSpacecraft);
    });

    it('submits the form with correct data for an edited spacecraft', async () => {
      const mockSpacecraft = {
        id: '1',
        name: 'Enterprise',
        type: 'Explorer',
        captain: 'James Kirk',
      };
      useMockSpacecrafts([mockSpacecraft]);

      wrapper = await mountComponent('/spacecraft/edit/1');
      await flushPromises();

      const inputs = wrapper.findAll('input[type="text"]');
      await inputs[0].setValue('Updated Enterprise');
      await wrapper.find('form').trigger('submit.prevent');

      /**
       * 💡 Note: Normally, we'd mock out the composable and verify the call
       * on the mock here, but we're doing this just for simplicity.
       */
      expect(wrapper.vm.form).toEqual({
        id: '1',
        name: 'Updated Enterprise',
        type: 'Explorer',
        captain: 'James Kirk',
      });
    });

    it('displays error message when there is an error', async () => {
      useErrorFetchingSpacecrafts();

      wrapper = await mountComponent('/spacecraft/edit/1');
      await flushPromises();

      expect(wrapper.text()).toContain('Network error');
    });
  });
});
