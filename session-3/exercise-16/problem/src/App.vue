<template>
  <div class="min-h-screen bg-space-deep-blue">
    <nav
      class="bg-space-dark-blue bg-opacity-90 backdrop-filter backdrop-blur-lg p-4"
    >
      <ul class="flex space-x-4">
        <li>
          <router-link
            to="/"
            class="text-space-starlight-white hover:text-space-nebula-teal transition-colors duration-300"
            active-class="text-space-nebula-teal border-b-2 border-space-nebula-teal"
          >
            Dashboard
          </router-link>
        </li>
        <li>
          <router-link
            to="/spacecraft"
            class="text-space-starlight-white hover:text-space-nebula-teal transition-colors duration-300"
            active-class="text-space-nebula-teal border-b-2 border-space-nebula-teal"
          >
            Spacecraft
          </router-link>
        </li>
        <li>
          <router-link
            to="/dockings"
            class="text-space-starlight-white hover:text-space-nebula-teal transition-colors duration-300"
            active-class="text-space-nebula-teal border-b-2 border-space-nebula-teal"
          >
            Dockings
          </router-link>
        </li>
        <li>
          <router-link
            to="/notifications"
            class="text-space-starlight-white hover:text-space-nebula-teal transition-colors duration-300"
            active-class="text-space-nebula-teal border-b-2 border-space-nebula-teal"
          >
            Notifications
          </router-link>
        </li>
      </ul>
    </nav>
    <main class="p-4">
      <router-view />
    </main>
  </div>
</template>
