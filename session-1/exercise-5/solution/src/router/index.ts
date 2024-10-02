import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/components/Dashboard.vue';
import SpacecraftList from '@/components/SpacecraftList.vue';
import SpacecraftForm from '@/components/SpacecraftForm.vue';
import DockingSchedule from '@/components/DockingSchedule.vue';
import NotificationCenter from '@/components/NotificationCenter.vue';

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  {
    path: '/spacecraft',
    name: 'SpacecraftList',
    component: SpacecraftList,
  },
  {
    path: '/spacecraft/add',
    name: 'AddSpacecraft',
    component: SpacecraftForm,
  },
  {
    path: '/spacecraft/edit/:id',
    name: 'EditSpacecraft',
    component: SpacecraftForm,
    props: true,
  },
  {
    path: '/dockings',
    name: 'DockingSchedule',
    component: DockingSchedule,
  },
  {
    path: '/notifications',
    name: 'NotificationCenter',
    component: NotificationCenter,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
