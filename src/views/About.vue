<template>
  <header>
    <div class="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-gray-200">
      <h1 class="text-3xl font-bold leading-tight pt-6 pb-2 text-gray-100">Tsubasa 🦋</h1>
      <p class="py-2">Tsubasa is a fast video compression service that runs locally on your device. Maintain the best quality while staying under MB file limits.</p>
      <p class="py-2">Source code: <a href="https://github.com/matchamoon/tsubasa" target="_blank" rel="noopener" class="text-indigo-300 hover:text-indigo-200 transition duration-150">https://github.com/matchamoon/tsubasa</a></p>
      <h1 class="text-2xl font-bold leading-tight pt-6 pb-2 text-gray-100">Why Tsubasa</h1>
      <p class="py-2">Tsubasa was created as a proof-of-concept for a ffmpeg-wasm implementation.</p>
      <ul>
        <li>✅ Allows transcoding to a size limit (for services with a file size upload limit)</li>
        <li>✅ Allows scaling resolution, to preserve video quality/bitrate</li>
        <li>✅ Preserves audio quality</li>
        <li>✅ Runs locally on your device</li>
      </ul>
      <h1 class="text-2xl font-bold leading-tight pt-6 pb-2 text-gray-100">Development</h1>
      <p class="py-2">With <a href="https://hacks.mozilla.org/2020/07/safely-reviving-shared-memory/" target="_blank" rel="noopener" class="text-indigo-300 hover:text-indigo-200 transition duration-150">the return of secure WASM support in browsers</a>, we wanted to see: Could we actually build a server-less compression service, running a desktop program, purely in JavaScript and WebAssembly?</p>
      <p class="py-2">With ffmpeg-wasm, transcoding can happen locally on devices, which means no time spent upload/downloading and processing as fast as your device allows. We were also able to experiment with preserving audio quality, which we found minimally impacted the output file size while improving the overall "feel" even for lower resolution videos. By allowing videos to scale the resolution down, more file space can be allocated to preserving the bitrate and the quality of each frame.</p>
      <p class="py-2">Tsubasa is a work in progress, and welcomes feature suggestions, bug reports, and pull requests.</p>
      <p class="py-2">Source code: <a href="https://github.com/matchamoon/tsubasa" target="_blank" rel="noopener" class="text-indigo-300 hover:text-indigo-200 transition duration-150">https://github.com/matchamoon/tsubasa</a></p>
      <h1 class="text-2xl font-bold leading-tight pt-6 pb-2 text-gray-100">Licenses</h1>
      <p class="py-2">License: <a href="https://github.com/matchamoon/tsubasa/blob/master/LICENSE" target="_blank" rel="noopener" class="text-indigo-300 hover:text-indigo-200 transition duration-150">https://github.com/matchamoon/tsubasa/blob/master/LICENSE</a></p>
      <p class="py-2">Tsubasa was built using:</p>
      <ul class="list-disc pl-6">
        <li v-for="lic in licenses" :key="lic.title"><a :href="lic.url" target="_blank" rel="noopener" class="text-indigo-300 hover:text-indigo-200 transition duration-150">{{ lic.title }}</a></li>
      </ul>
    </div>
  </header>
</template>

<script lang="ts">
export default {
  data() {
    return {
      licenses: [
        { title: "Free hosting: Netlify", url: "https://netlify.com" },
        { title: "Free domain name: JS.org", url: "https://js.org" },
        { title: "ffmpeg.wasm - MIT", url: "https://github.com/ffmpegwasm/ffmpeg.wasm" },
        { title: "mediainfo.js - BSD 2-Clause", url: "https://github.com/buzz/mediainfo.js" },
      ],
    };
  }
};
</script>
