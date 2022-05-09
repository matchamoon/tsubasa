<script setup lang="ts">
import { defineComponent, reactive, ref, VueElement } from "vue";
import MediaInfoFactory from "mediainfo.js";
import type {
  ResultObject,
  MediaInfo,
  ReadChunkFunc,
  Result,
} from "mediainfo.js/dist/types";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

let targetSize = ref(8);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onFileChanged = async (event: any) => {
  // TODO: Move all of this

  if (event.target.files[0] === null) return;
  const file = event.target.files[0];
  console.log("selected file", file.name);

  const mediaInfo = (await getFileInfo(file)) as ResultObject;

  let originalDuration = mediaInfo.media.track[0].Duration as number;
  let originalAudioRate = (mediaInfo.media.track[2].BitRate as number) / 1024;
  let targetMinimumSize = (originalAudioRate * originalDuration) / 8192;

  if (targetMinimumSize > targetSize.value) {
    console.error("bad size");
    return;
  }

  let targetAudioRate = originalAudioRate;

  let targetVideoRate =
    (targetSize.value * 8192) / (1.048576 * originalDuration) -
    originalAudioRate;
};

const getFileInfo = async (file: File) => {
  //let getSize = () => file.size;
  //let getSize = file.size;

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

  //let mediainfo: MediaInfo | undefined;

  let mediainfo = (await MediaInfoFactory({ format: "object" })) as MediaInfo;

  const result = await mediainfo.analyzeData(() => file.size, readChunk);

  mediainfo && mediainfo.close();
  return result;
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
          id="formFile"
          accept="video/mp4"
          v-on:change="onFileChanged"
        />
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
