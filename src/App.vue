<template>
  <div class="about w-full text-center">
    <router-link to="/">
      <div
        class="bg-gradient-to-br from-indigo-500 to-green-900 bg-cover bg-center px-4 py-8 sm:p-12"
      >
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div class="font-bold text-4xl text-gray-100 pb-2">🦋 Tsubasa</div>
          <div class="text-gray-300">Video compression made easy</div>
        </div>
      </div>
    </router-link>

    <div
      class="bg-161616 text-eeeeee px-t2 sm:px-6 md:px-12 py-t2 md:py-6 text-left min-h-screen"
    >
      <div
        class="bg-transparent grid grid-cols-2 gap-1 py-t1 sm:py-0 sm:px-t4 md:px-t8 sm:flex sm:flex-no-wrap sm:items-center sm:justify-center"
      >
        <router-link
          v-for="navlink in navitems"
          :key="navlink.title"
          :to="navlink.url"
          class="inline-flex items-center justify-center px-4 py-3 sm:m-1 text-base font-medium leading-6 transition-colors duration-300 hover:bg-282828 rounded-md cursor-pointer"
          active-class="bg-222222 shadow"
          >{{ navlink.title }}</router-link
        >
      </div>

      <div id="content"></div>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>

      <Transcoder />

      <div class="text-center pt-24 pb-2">
        <div class="text-center pb-2 text-gray-600 text-sm">
          &copy; 2022, by Matcha Moon
        </div>
        <div class="text-center pb-2">
          <router-link
            to="/about"
            class="text-gray-500 transition duration-300 hover:text-gray-400"
            >See About/Terms/Privacy</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Transcoder from './components/Transcoder.vue'

export default {
  components: {
    Transcoder
  },
  data() {
    return {
      navitems: [
        { title: "Home", url: "/" },
        { title: "About", url: "/about" },
      ],
    };
  },
  async created() {
    let copyYear = 2022;
  },
  methods: {
    reload() {
      window.location.reload();
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
};
</script>

<style>
html,
body {
  font-family: Jost, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  scroll-behavior: smooth;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
