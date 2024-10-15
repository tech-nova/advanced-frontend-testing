import { mount, flushPromises } from '@vue/test-utils';
import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
} from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import SpacecraftForm from '@/components/SpacecraftForm.vue';
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
   * useMockSpacecrafts is a utility function that mocks the spacecraft data
   * useErrorFetchingSpacecrafts is a utility function that mocks the error fetching spacecraft data
   */
  const {
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
        {
          path: '/spacecraft/add',
          name: 'AddSpacecraft',
          component: SpacecraftForm,
        },
        {
          path: '/spacecraft/edit/:id',
          name: 'EditSpacecraft',
          component: SpacecraftForm,
        },
      ],
    });
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

    it('submits the form with correct data for a new spacecraft', async () => {
      wrapper = await mountComponent();

      const inputs = wrapper.findAll('input[type="text"]');
      expect(inputs.length).toBe(3);

      const [nameInput, typeInput, captainInput] = inputs;

      await nameInput.setValue('New Spacecraft');
      await typeInput.setValue('Explorer');
      await captainInput.setValue('John Doe');

      await wrapper.find('form').trigger('submit.prevent');

      /**
       * 💡 Note: Normally, we'd mock out the composable and verify the call
       * on the mock here, but we're doing this just for simplicity.
       */
      expect(wrapper.vm.form).toEqual({
        name: 'New Spacecraft',
        type: 'Explorer',
        captain: 'John Doe',
      });
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

    it('displays validation errors when form is invalid', async () => {
      /**
       * 🔄 Refresher: Mocking functions was covered in Exercise 4.
       *
       * Here we mock the validateSpacecraft function to return an error.
       */
      vi.mock('@/utils/validation', () => ({
        validateSpacecraft: vi.fn(() => ({
          name: 'Name is required',
        })),
      }));

      wrapper = await mountComponent();

      await wrapper.find('form').trigger('submit.prevent');

      expect(wrapper.text()).toContain('Name is required');
    });

    it('displays error message when there is an error', async () => {
      useErrorFetchingSpacecrafts();

      wrapper = await mountComponent('/spacecraft/edit/1');
      await flushPromises();

      expect(wrapper.text()).toContain('Network error');
    });
  });
});
