<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-blue-600 p-4 text-white">
      <ul class="flex space-x-4">
        <li>
          <router-link to="/" class="hover:underline"
            >Dashboard</router-link
          >
        </li>
        <li>
          <router-link
            to="/spacecraft"
            class="hover:underline"
            >Spacecraft</router-link
          >
        </li>
        <li>
          <router-link
            to="/dockings"
            class="hover:underline"
            >Dockings</router-link
          >
        </li>
        <li>
          <router-link
            to="/notifications"
            class="hover:underline"
            >Notifications</router-link
          >
        </li>
      </ul>
    </nav>
    <main class="p-4">
      <router-view />
    </main>
  </div>
</template>
