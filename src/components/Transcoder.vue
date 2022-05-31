<template>
  <div
    class="mt-8 flex justify-center px-4 py-6 sm:p-8 rounded-lg shadow-lg bg-202020 w-full max-w-6xl mx-auto"
  >
    <div class="w-full max-w-md">
      <div v-if="!store.state.ffFileOk">
        <div class="pb-6">
          <div class="pb-2 font-bold">Upload a file</div>
          <input
            class="form-control block w-full text-sm font-thin bg-161616/50 rounded cursor-pointer file:py-2 file:px-4 file:mr-4 file:rounded-none file:bg-161616 file:border-none file:text-sm file:font-normal file:text-gray-200"
            type="file"
            accept="video/mp4"
            v-on:change="onFileChanged"
          />
        </div>
        <div class="pb-6">
          <div class="pb-2 font-bold">Choose your size</div>
          <input
            class="bg-161616 rounded px-3 py-2 w-24 text-sm"
            type="number"
            v-model="targetSize"
          />
          MB<span v-if="store.state.ffFilesize" class="pl-4 text-sm"
            >(original file:
            {{ sizeBytes(Number(store.state.ffFilesize)) }})</span
          >
        </div>
        <div>
          Scale:
          <output class="block">1</output>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.1"
            v-model="targetScale"
            oninput="this.previousElementSibling.value = this.value"
          />
        </div>
        <div>
          <div>Minimum size: {{ minimumSize }}</div>
        </div>
        <div class="pb-2 text-right">
          <button
            class="bg-indigo-800 hover:bg-indigo-700 transition-colors duration-150 px-4 py-2 rounded text-gray-200"
            v-on:click="onSubmit"
          >
            🦋&ensp;Compress
          </button>
        </div>
      </div>
      <div v-else>
        <div
          class="px-3 py-2 block text-sm bg-161616/25 rounded mt-2 cursor-default"
        >
          {{ store.state.ffFilename }}
        </div>
        <div
          class="px-3 py-2 block text-sm bg-161616/25 rounded mt-2 cursor-default"
        >
          {{ sizeBytes(Number(store.state.ffFilesize)) }} ->
          {{ targetSize }} MB
        </div>
        <div class="pt-2 pb-2 text-right">
          <button
            class="bg-transparent px-4 py-2 rounded text-gray-200"
            v-if="store.state.ffProgress < 100"
            v-on:click="reload()"
          >
            ❌
          </button>
          <button
            class="bg-indigo-800 shadow px-4 py-2 rounded text-gray-200"
            v-else
            v-on:click="reload()"
          >
            Compress new video
          </button>
        </div>
      </div>

      <div
        class="pt-2 pb-2"
        v-if="!store.state.ffFileOk && store.state.consoleErr"
      >
        <span class="absolute transition-all duration-150">⚠</span>
        <span class="ml-8">{{ store.state.consoleErr }}</span>
      </div>
      <div class="pt-6 pb-2" v-if="store.state.consoleMsg">
        <span
          class="absolute transition-all duration-150"
          :class="store.state.ffProgress < 100 ? 'animate-bounce' : ''"
          >🦋</span
        >
        <span class="ml-8">{{ store.state.consoleMsg }}</span>
        <span class="ml-2" v-if="store.state.ffProgress > 0"
          >{{ store.state.ffProgress }}%</span
        >
      </div>
      <div class="pt-6 pb-2" v-if="video">
        <div class="pb-2 font-bold">🎊 Video Compressed 🎊</div>
        <video
          v-if="video"
          :src="video"
          class="rounded shadow cursor-pointer"
          controls
        />
        <div class="text-sm text-gray-300 pt-2">
          <b>To save:</b>&ensp;Right-click/long-press the video and click
          Save Video
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { store } from "../store/index";

import VideoService from "../services/video.service";

const inputFile = ref<File | null>(null);
const video = ref<string | null>(null);
const targetSize = ref(8);
const targetScale = ref(1.0);

let minimumSize = ref(0);

let vs: VideoService;

// onMounted - initializes ffmpeg
onMounted(() => {
  vs = new VideoService();
});

// onFileChanged - sets the inputFile to the file passed in
const onFileChanged = async (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (!target.files) {
    return store.commit("consoleErr", "No file selected");
  }
  store.commit("consoleErr", "");
  inputFile.value = target.files[0];
  store.commit("ffFilename", target.files[0].name);
  store.commit("ffFilesize", target.files[0].size);

  minimumSize.value = (await vs.getMinimumSize(
    target.files[0],
    targetScale.value
  )) as number;
};

// onSubmit - called when submit button is pressed245
// reads the file and calls the ffmpeg function
const onSubmit = async () => {
  if (!inputFile.value) {
    return store.commit("consoleErr", "No file selected");
  }
  if (store.state.ffFilesize <= Number(targetSize.value) * 1024 * 1024) {
    return store.commit("consoleErr", "File is smaller than your target size!");
  }

  store.commit("ffFileOk", true);

  const renamedFile = new File([inputFile.value], "input.mp4");

  const videoData = await vs.shrinkVideo(
    renamedFile,
    targetSize.value,
    targetScale.value
  );

  if (!videoData) return;
  video.value = URL.createObjectURL(
    new Blob([videoData.buffer], { type: "video/mp4" })
  );
};
</script>

<script lang="ts">
export default {
  data() {
    return {
    };
  },
  methods: {
    reload() {
      window.location.reload();
    },
    sizeBytes(x: number) {
      // https://stackoverflow.com/a/39906526/15923512 CC BY-SA 4.0
      const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      let l = 0,
        n = x || 0;
      while (n >= 1024 && ++l) {
        n = n / 1024;
      }
      return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
    },
  },
};
</script>