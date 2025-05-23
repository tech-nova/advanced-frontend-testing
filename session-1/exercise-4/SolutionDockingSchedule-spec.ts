import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
  } from 'vitest';
  import { render, screen } from '@testing-library/vue';
  import { shallowMount } from '@vue/test-utils';
  import DockingSchedule from './DockingSchedule.vue';
  import { createTestingPinia } from '@pinia/testing';
  import { ref } from 'vue';
  import type {
    Spacecraft,
    DockingWithSpacecraft,
  } from '@/types';
  import DockingForm from './DockingForm.vue';
  import { ofetch } from 'ofetch';
  
  // Mock child components
  vi.mock('./DockingForm.vue', () => ({
    default: {
      name: 'DockingForm',
      template: '<div data-testid="docking-form"></div>',
    },
  }));
  
  vi.mock('./VideoScanModal.vue', () => ({
    default: {
      name: 'VideoScanModal',
      template: '<div data-testid="video-scan-modal"></div>',
    },
  }));
  
  vi.mock('./VideoViewerModal.vue', () => ({
    default: {
      name: 'VideoViewerModal',
      template:
        '<div data-testid="video-viewer-modal"></div>',
    },
  }));
  
  // Mock composable
  vi.mock('@/composables/useSpacecraft', () => ({
    useSpacecraft: () => ({
      spacecrafts: ref<Spacecraft[]>([
        {
          id: '1',
          name: 'Spacecraft 1',
          captain: 'Captain 1',
          type: 'type1',
        },
        {
          id: '2',
          name: 'Spacecraft 2',
          captain: 'Captain 2',
          type: 'type2',
        },
      ]),
      loading: ref(false),
      error: ref(null),
    }),
  }));
  
  // Mock ofetch
  vi.mock('ofetch', () => ({
    ofetch: vi.fn(),
  }));
  
  describe('DockingSchedule', () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
  
    describe('Component Rendering', () => {
      it('renders the component with title and schedule button', () => {
        // Arrange
        render(DockingSchedule, {
          global: {
            plugins: [createTestingPinia()],
          },
        });
  
        // Assert
        expect(
          screen.getByText('Docking Schedule')
        ).toBeTruthy();
        expect(
          screen.getByText('Schedule Docking')
        ).toBeTruthy();
      });
  
      it('displays loading state when dockings are being fetched', () => {
        // Arrange
        render(DockingSchedule, {
          global: {
            plugins: [
              // Mock Pinia store
              createTestingPinia({
                initialState: {
                  docking: { loading: true },
                },
              }),
            ],
          },
        });
  
        // Assert
        expect(screen.getByText('Loading...')).toBeTruthy();
      });
  
      it('displays docking entries when data is loaded', async () => {
        // Arrange
        const mockDockings = [
          {
            id: '1',
            spacecraftId: '1',
            dockingTime: '2023-04-15T10:00:00Z',
            bayId: 'A1',
            status: 'scheduled',
          },
          {
            id: '2',
            spacecraftId: '2',
            dockingTime: '2023-04-16T14:00:00Z',
            bayId: 'B2',
            status: 'docked',
          },
        ];
  
        render(DockingSchedule, {
          global: {
            plugins: [
              // Mock Pinia store
              createTestingPinia({
                initialState: {
                  docking: {
                    dockings: mockDockings,
                    loading: false,
                  },
                },
              }),
            ],
          },
        });
  
        // Assert
        expect(screen.getByText('Spacecraft 1')).toBeTruthy();
        expect(screen.getByText('Captain 1')).toBeTruthy();
        expect(screen.getByText('Spacecraft 2')).toBeTruthy();
        expect(screen.getByText('Captain 2')).toBeTruthy();
      });
  
      it('displays error message when there is an error in the docking store', () => {
        // Arrange
        render(DockingSchedule, {
          global: {
            plugins: [
              // Mock Pinia store
              createTestingPinia({
                initialState: {
                  docking: {
                    error: new Error('Test error message'),
                    loading: false,
                  },
                },
              }),
            ],
          },
        });
  
        // Assert
        expect(
          screen.getByText('Test error message')
        ).toBeTruthy();
      });
    });
  
    describe('Docking Scans', () => {
      it('does not display "View Scan" button for dockings without scans', () => {
        // Arrange
        const mockDockings = [
          {
            id: '1',
            spacecraftId: '1',
            dockingTime: '2023-04-15T10:00:00Z',
            bayId: 'A1',
            status: 'docked',
          },
        ];
  
        render(DockingSchedule, {
          global: {
            plugins: [
              // Mock Pinia store
              createTestingPinia({
                initialState: {
                  docking: {
                    dockings: mockDockings,
                    loading: false,
                  },
                },
              }),
            ],
          },
        });
  
        // Assert
        expect(screen.queryByText('View Scan')).toBeNull();
      });
  
      it('displays "View Scan" button for dockings with scans', () => {
        // Arrange
        const mockDockings = [
          {
            id: '1',
            spacecraftId: '1',
            dockingTime: '2023-04-15T10:00:00Z',
            bayId: 'A1',
            status: 'docked',
            scan: new Blob(),
          },
        ];
  
        render(DockingSchedule, {
          global: {
            plugins: [
              // Mock Pinia store
              createTestingPinia({
                initialState: {
                  docking: {
                    dockings: mockDockings,
                    loading: false,
                  },
                },
              }),
            ],
          },
        });
  
        // Assert
        expect(screen.getByText('View Scan')).toBeTruthy();
      });
  
      it('does not display "Record Scan" button for scheduled or departed dockings', () => {
        // Arrange
        const mockDockings: DockingWithSpacecraft[] = [
          {
            id: '1',
            spacecraftId: '1',
            dockingTime: '2023-04-15T10:00:00Z',
            bayId: 1,
            status: 'scheduled',
          },
          {
            id: '2',
            spacecraftId: '2',
            dockingTime: '2023-04-16T14:00:00Z',
            bayId: 2,
            status: 'departed',
          },
        ];
  
        render(DockingSchedule, {
          global: {
            plugins: [
              // Mock Pinia store
              createTestingPinia({
                initialState: {
                  docking: {
                    dockings: mockDockings,
                    loading: false,
                  },
                },
              }),
            ],
          },
        });
  
        // Assert
        expect(screen.queryByText('Record Scan')).toBeNull();
      });
  
      it('displays "Record Scan" button for docked spacecraft', () => {
        // Arrange
        const mockDockings: DockingWithSpacecraft[] = [
          {
            id: '1',
            spacecraftId: '1',
            dockingTime: '2023-04-15T10:00:00Z',
            bayId: 1,
            status: 'docked',
          },
        ];
  
        render(DockingSchedule, {
          global: {
            plugins: [
              // Mock Pinia store
              createTestingPinia({
                initialState: {
                  docking: {
                    dockings: mockDockings,
                    loading: false,
                  },
                },
              }),
            ],
          },
        });
  
        // Assert
        expect(screen.getByText('Record Scan')).toBeTruthy();
      });
    });
  
    describe('Network Calls', () => {
      it('fetches dockings on mount', async () => {
        const mockDockings: DockingWithSpacecraft[] = [
          {
            id: '1',
            spacecraftId: '1',
            dockingTime: '2023-04-15T10:00:00Z',
            bayId: 1,
            status: 'scheduled',
          },
        ];
  
        vi.mocked(ofetch).mockResolvedValueOnce(mockDockings);
  
        render(DockingSchedule, {
          global: {
            plugins: [createTestingPinia()],
          },
        });
  
        expect(ofetch).toHaveBeenCalledWith('/api/dockings');
      });
  
      /**
       * Use vue-test-utils to test the event being emitted
       * from the child component DockingForm
       */
      it('schedules a new docking', async () => {
        const newDocking: DockingWithSpacecraft = {
          id: '3',
          spacecraftId: '1',
          dockingTime: '2023-04-17T12:00:00Z',
          bayId: 3,
          status: 'scheduled',
        };
  
        vi.mocked(ofetch).mockResolvedValueOnce(newDocking);
  
        // Use vue-test-utils to test the event emission
        const wrapper = shallowMount(DockingSchedule, {
          global: {
            plugins: [createTestingPinia()],
          },
        });
  
        const dockingForm =
          wrapper.findComponent(DockingForm);
  
        await dockingForm.vm.$emit(
          'schedule-docking',
          newDocking
        );
  
        expect(ofetch).toHaveBeenCalledWith('/api/dockings', {
          method: 'POST',
          body: newDocking,
        });
      });
    });
  });
  