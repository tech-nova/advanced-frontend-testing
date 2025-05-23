// Place ce mock tout en haut du fichier, AVANT l'import du composant !
vi.mock('@/composables/useSpacecraft', () => ({
  useSpacecraft: () => ({
    spacecrafts: { value: [
      { id: 's1', name: 'Apollo', captain: 'Neil' },
      { id: 's2', name: 'Enterprise', captain: 'Jean-Luc' },
    ] },
    loading: { value: false },
    error: null,
  }),
}));

import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
// import { ofetch } from 'ofetch';
// import { ref } from 'vue';
import DockingSchedule from './DockingSchedule.vue';
import DockingForm from './DockingForm.vue';

describe('DockingSchedule', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  describe('Component Rendering', () => {
    it('renders the component with title and schedule button', () => {
      const wrapper = shallowMount(DockingSchedule, {
        global: {
          plugins: [createTestingPinia()],
          stubs: ['DockingForm', 'VideoScanModal', 'VideoViewerModal'],
          mocks: {
            // Si besoin, mocker les composables ici
          },
        },
      });

      // Vérifie le titre
      expect(wrapper.text()).toContain('Docking Schedule');
      // Vérifie le bouton
      const button = wrapper.find('button');
      expect(button.exists()).toBe(true);
      expect(button.text()).toBe('Schedule Docking');
    });

    it('displays loading state when dockings are being fetched', () => {
      const wrapper = shallowMount(DockingSchedule, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                docking: { // nom du store défini dans defineStore
                  loading: true,
                  dockings: [],
                  error: null,
                },
              },
            }),
          ],
          stubs: ['DockingForm', 'VideoScanModal', 'VideoViewerModal'],
        },
      });
    
      // On vérifie que le texte "Loading..." est affiché
      expect(wrapper.text()).toContain('Loading...');
    });

    it('displays docking entries when data is loaded', async () => {
  
        // Données de docking à afficher
        const dockings = [
          {
            id: 'd1',
            spacecraftId: 's1',
            dockingTime: '2024-07-07T10:00:00Z',
            bayId: 1,
            status: 'scheduled',
          },
          {
            id: 'd2',
            spacecraftId: 's2',
            dockingTime: '2024-07-08T12:00:00Z',
            bayId: 2,
            status: 'docked',
          },
        ];
  
        const wrapper = shallowMount(DockingSchedule, {
          global: {
            plugins: [
              createTestingPinia({
                initialState: {
                  docking: {
                    loading: false,
                    dockings,
                    error: null,
                  },
                },
              }),
            ],
            stubs: ['DockingForm', 'VideoScanModal', 'VideoViewerModal'],
          },
        });
  
        // Vérifie que les noms des vaisseaux et capitaines sont affichés
        expect(wrapper.html()).toContain('Apollo');
        expect(wrapper.text()).toContain('Neil');
        expect(wrapper.text()).toContain('Enterprise');
        expect(wrapper.text()).toContain('Jean-Luc');
        // Vérifie que les bayId et status sont affichés
        expect(wrapper.text()).toContain('1');
        expect(wrapper.text()).toContain('scheduled');
        expect(wrapper.text()).toContain('2');
        expect(wrapper.text()).toContain('docked');      
    });

    it('displays error message when there is an error in the docking store', () => {

      // On crée une fausse erreur à injecter dans le store
      const fakeError = new Error('Erreur critique dans le store');

      const wrapper = shallowMount(DockingSchedule, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                docking: {
                  loading: false,
                  dockings: [],
                  error: fakeError,
                },
              },
            }),
          ],
          stubs: ['DockingForm', 'VideoScanModal', 'VideoViewerModal'],
        },
      });

      // On vérifie que le message d’erreur est affiché dans le composant
      expect(wrapper.text()).toContain('Erreur critique dans le store');

    });
  });

  describe('Docking Scans', () => {
    it('does not display "View Scan" button for dockings without scans', () => {
      // Docking sans propriété scan
      const dockings = [
        {
          id: 'd1',
          spacecraftId: 's1',
          dockingTime: '2024-07-07T10:00:00Z',
          bayId: 1,
          status: 'scheduled',
          // pas de scan
        },
      ];

      const wrapper = shallowMount(DockingSchedule, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                docking: {
                  loading: false,
                  dockings,
                  error: null,
                },
              },
            }),
          ],
          stubs: ['DockingForm', 'VideoScanModal', 'VideoViewerModal'],
        },
      });

      // On vérifie que le bouton "View Scan" n'est pas présent
      const viewScanButton = wrapper.find('button.bg-blue-500');
      expect(viewScanButton.exists()).toBe(false);
      // On peut aussi vérifier que le texte n'est pas là
      expect(wrapper.text()).not.toContain('View Scan');
    });

    it('displays "View Scan" button for dockings with scans', () => {
      // Docking AVEC une propriété scan (on peut utiliser un Blob fictif)
      const dockings = [
        {
          id: 'd1',
          spacecraftId: 's1',
          dockingTime: '2024-07-07T10:00:00Z',
          bayId: 1,
          status: 'scheduled',
          scan: new Blob(['fake video'], { type: 'video/mp4' }),
        },
      ];

      const wrapper = shallowMount(DockingSchedule, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                docking: {
                  loading: false,
                  dockings,
                  error: null,
                },
              },
            }),
          ],
          stubs: ['DockingForm', 'VideoScanModal', 'VideoViewerModal'],
        },
      });

      // On vérifie que le bouton "View Scan" est présent
      const viewScanButton = wrapper.find('button.bg-blue-500');
      expect(viewScanButton.exists()).toBe(true);
      expect(viewScanButton.text()).toBe('View Scan');      
    });

    it('does not display "Record Scan" button for scheduled or departed dockings', () => {
      // Deux dockings : un "scheduled", un "departed"
      const dockings = [
        {
          id: 'd1',
          spacecraftId: 's1',
          dockingTime: '2024-07-07T10:00:00Z',
          bayId: 1,
          status: 'scheduled',
        },
        {
          id: 'd2',
          spacecraftId: 's2',
          dockingTime: '2024-07-08T12:00:00Z',
          bayId: 2,
          status: 'departed',
        },
      ];

      const wrapper = shallowMount(DockingSchedule, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                docking: {
                  loading: false,
                  dockings,
                  error: null,
                },
              },
            }),
          ],
          stubs: ['DockingForm', 'VideoScanModal', 'VideoViewerModal'],
        },
      });

      // On vérifie que le bouton "Record Scan" n'est pas présent
      const recordScanButtons = wrapper.findAll('button.bg-purple-500');
      expect(recordScanButtons.length).toBe(0);
      // On peut aussi vérifier que le texte n'est pas là
      expect(wrapper.text()).not.toContain('Record Scan');
    });

    it('displays "Record Scan" button for docked spacecraft', () => {
      // Docking avec le statut "docked"
      const dockings = [
        {
          id: 'd1',
          spacecraftId: 's1',
          dockingTime: '2024-07-07T10:00:00Z',
          bayId: 1,
          status: 'docked',
        },
      ];

      const wrapper = shallowMount(DockingSchedule, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                docking: {
                  loading: false,
                  dockings,
                  error: null,
                },
              },
            }),
          ],
          stubs: ['DockingForm', 'VideoScanModal', 'VideoViewerModal'],
        },
      });

      // On vérifie que le bouton "Record Scan" est présent
      const recordScanButton = wrapper.find('button.bg-purple-500');
      expect(recordScanButton.exists()).toBe(true);
      expect(recordScanButton.text()).toBe('Record Scan');
    });
  });

  describe('Network Calls', () => {
    it('fetches dockings on mount', async () => {
      // On mock ofetch pour observer les appels
      const ofetchMock = vi.fn().mockResolvedValue({
        id: 'd3',
        spacecraftId: 's1',
        dockingTime: '2024-07-09T10:00:00Z',
        bayId: 3,
        status: 'scheduled',
      });
      vi.doMock('ofetch', () => ({ ofetch: ofetchMock }));

      // On importe à nouveau le composant pour que le mock soit pris en compte
      const { default: DockingSchedule } = await import('./DockingSchedule.vue');

      const wrapper = shallowMount(DockingSchedule, {
        global: {
          plugins: [createTestingPinia()],
          stubs: ['DockingForm', 'VideoScanModal', 'VideoViewerModal'],
        },
      });

      // On simule l'émission de l'événement schedule-docking depuis le stub
      await wrapper.vm.handleScheduleDocking({
        id: 'd3',
        spacecraftId: 's1',
        dockingTime: '2024-07-09T10:00:00Z',
        bayId: 3,
        status: 'scheduled',
      });

      expect(ofetchMock).toHaveBeenCalledWith('/api/dockings', expect.objectContaining({
        method: 'POST',
        body: expect.any(Object),
      }));
    });

    it('schedules a new docking', async () => {
      // Mock ofetch
      const ofetchMock = vi.fn().mockResolvedValue({
        id: 'd3',
        spacecraftId: 's1',
        dockingTime: '2024-07-09T10:00:00Z',
        bayId: 3,
        status: 'scheduled',
      });
      vi.doMock('ofetch', () => ({ ofetch: ofetchMock }));

      // On importe à nouveau le composant pour que le mock soit pris en compte
      const { default: DockingSchedule } = await import('./DockingSchedule.vue');

      // On rend le composant avec le vrai DockingForm
      const { getByText, getByRole, container } = render(DockingSchedule, {
        global: {
          plugins: [createTestingPinia()],
          components: { DockingForm }, // On utilise le vrai composant
        },
      });

      // On ouvre le formulaire (en cliquant sur "Schedule Docking")
      await fireEvent.click(getByText('Schedule Docking'));

      // On sélectionne le vaisseau (le premier select du formulaire)
      const select = getByRole('combobox');
      await fireEvent.update(select, 's1');

      // Sélectionne le champ date
      const inputDate = container.querySelector('input[type="datetime-local"]');
      expect(inputDate).not.toBeNull();

      await fireEvent.update(inputDate, '2024-07-09T10:00');

      // Sélectionne le champ bay
      const inputBay = getByRole('spinbutton');
      await fireEvent.update(inputBay, '3');

      // On soumet le formulaire (le bouton "Schedule" du formulaire)
      const scheduleButton = getByRole('button', { name: /^schedule$/i });
      await fireEvent.click(scheduleButton);

      // On vérifie que l'appel POST a bien été fait
      expect(ofetchMock).toHaveBeenCalledWith(
        '/api/dockings',
        expect.objectContaining({
          method: 'POST',
          body: expect.objectContaining({
            spacecraftId: 's1',
            bayId: 3,
            // On ne vérifie pas la valeur exacte de dockingTime
          }),
        })
      );
    });
  });
});
