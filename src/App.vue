<script setup lang="ts">
import {
  defineComponent,
  onMounted,
  onUpdated,
  reactive,
  readonly,
  ref,
  VueElement,
  type InputHTMLAttributes,
} from "vue";

import MediaInfoFactory from "mediainfo.js";
import type {
  ResultObject,
  MediaInfo,
  ReadChunkFunc,
  Result,
} from "mediainfo.js/dist/types";
import { createFFmpeg, fetchFile, type FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpeg: FFmpeg;

//const root = ref<HTMLElement | null>(null);
onMounted(() => {
  ffmpeg = createFFmpeg({ log: true });
});

const inputFile = ref<File | null>(null);
const message = ref("Message here");
const video = ref<string | null>(null);

let targetSize = ref(8);

const onFileChanged = async (event: any) => {
  if (!event.target) return;
  if (event.target.files[0] === null) return;
  inputFile.value = event.target.files[0];
};

const getVideoInfo = async (file: File) => {
  let duration = 0;
  let audioRate = 0;
  let targetMinimumSize = 0;
  let targetVideoRate = 0;

  const readChunk: ReadChunkFunc = (chunkSize: number, offset: number) =>
    new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        if (event.target.error) {
          reject(event.target.error);
        }
        resolve(new Uint8Array(event.target.result));
      };
      reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize));
    });

  let mediainfo = (await MediaInfoFactory({ format: "object" })) as MediaInfo;

  const result = await mediainfo.analyzeData(() => file.size, readChunk);

  mediainfo && mediainfo.close();

  if (typeof result != "object") return;

  duration = Number(result.media.track[0].Duration);
  audioRate = (result.media.track[2].BitRate as number) / 1024;
  targetMinimumSize = (targetVideoRate * duration) / 8192;

  if (targetMinimumSize > targetSize.value) {
    console.error("bad size");
    return;
  }

  targetVideoRate =
    (targetSize.value * 8192) / (1.048576 * duration) - audioRate;

  return {
    duration,
    audioRate,
    targetVideoRate,
  } as VideoInfo;
};

const onSubmit = async (event: any) => {
  if (!inputFile.value) return;

  const videoInfo = await getVideoInfo(inputFile.value);
  if (!videoInfo) throw "Could not get video info";

  shrinkVideo(videoInfo);
};

const shrinkVideo = async (videoInfo: VideoInfo) => {
  const inputFileName = inputFile.value?.name as string;

  message.value = "Loading ffmeg-core.js";
  await ffmpeg.load();
  message.value = "Start transcoding";
  ffmpeg.FS(
    "writeFile",
    inputFileName,
    await fetchFile(inputFile.value as File)
  );
  await ffmpeg.run(
    "-i",
    inputFileName,
    "-c:v",
    "libx264",
    "-b:v",
    String(videoInfo.targetVideoRate) + "k",
    "-c:a",
    "aac",
    "-b:a",
    String(videoInfo.audioRate) + "k",
    "output.mp4"
  );
  message.value = "Complete transcoding";
  const data = ffmpeg.FS("readFile", "output.mp4");
  video.value = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4" })
  );
};

type VideoInfo = {
  duration: number;
  audioRate: number;
  targetVideoRate: number;
};
</script>

<template>
  <main>
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
@import "./assets/base.css";

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

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
