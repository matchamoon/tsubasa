<script setup lang="ts">
import { onMounted, ref } from "vue";

import VideoService from "../services/video.service";
import Messenger from "../utils/messenger.util";

const inputFile = ref<File | null>(null);
var message = ref("Message here");
const video = ref<string | null>(null);
const targetSize = ref(8);

let vs: VideoService;

const messenger = new Messenger();

// onMounted - initializes ffmpeg
onMounted(() => {
  vs = new VideoService(messenger);
});

// onFileChanged - sets the inputFile to the file passed in
const onFileChanged = async (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (!target.files?.[0]) {
    throw new Error("No file selected");
  }
  inputFile.value = target.files[0];
};

// onSubmit - called when submit button is pressed245
// reads the file and calls the ffmpeg function
const onSubmit = async () => {
  if (!inputFile.value) {
    messenger.sendMessage("No video selected.");
    return;
  }

  const videoData = await vs.shrinkVideo(inputFile.value, targetSize.value);

  if (!videoData) return;
  video.value = URL.createObjectURL(
    new Blob([videoData.buffer], { type: "video/mp4" })
  );
};
</script>

<template>
  <main class="bg-222222 text-gray-200">
    <div class="flex justify-center">
      <div class="mb-3 w-96">
        <input class="bg-slate-700" type="number" v-model="targetSize" />
        mb
        <input
          class="form-control block w-full px-3 py-1.5"
          type="file"
          accept="video/mp4"
          v-on:change="onFileChanged"
        />
        <button class="bg-white text-red-600" v-on:click="onSubmit">
          Submit
        </button>
        <div>{{ message }}</div>
        <div>
          <video v-if="video" :src="video" controls autoplay />
        </div>
      </div>
    </div>
  </main>
</template>

<style>
@import "../assets/base.css";

/* #app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
} */

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }
}
</style>
