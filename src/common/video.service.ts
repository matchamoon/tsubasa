import { store } from "../store/index";

import MediaInfoFactory from "mediainfo.js";
import type {
  MediaInfo,
  ReadChunkFunc,
  ResultObject,
} from "mediainfo.js/dist/types";
import { createFFmpeg, fetchFile, type FFmpeg } from "@ffmpeg/ffmpeg";

type Parameters = {
  duration: number;
  audioRate: number;
  videoRate: number;
};

export default class VideoService {
  private ffmpeg: FFmpeg;

  constructor() {
    this.ffmpeg = createFFmpeg({ log: true });
  }

  async shrinkVideo(file: File, targetSize: number, targetScale: number) {
    const originalInfo = await this.getVideoInfo(file);

    if (typeof originalInfo != "object") return;

    const parameters = this.getTargetParameters(originalInfo, targetSize);

    return this.transcode(file, parameters, targetSize, targetScale);
  }

  private async getVideoInfo(file: File) {
    const readChunk: ReadChunkFunc = (chunkSize: number, offset: number) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event: Event) => {
          const target = event.target as FileReader;
          if (target.error) {
            reject(target.error);
          }
          console.log(target.result);
          resolve(new Uint8Array(target.result as ArrayBuffer));
        };
        reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize));
      });

    const mediainfo = (await MediaInfoFactory({
      format: "object",
    })) as MediaInfo;

    const result = await mediainfo.analyzeData(() => file.size, readChunk);

    mediainfo && mediainfo.close();

    if (typeof result != "object") return;

    return result;
  }

  private getTargetParameters(originalInfo: ResultObject, targetSize: number) {
    const duration = Number(originalInfo.media.track[0].Duration);

    const audioRate =
      Number(originalInfo.media.track[2].BitRate as number) / 1024 ?? 0;

    const videoRate = (targetSize * 8192) / (1.048576 * duration) - duration;

    return {
      duration,
      audioRate,
      videoRate,
    } as Parameters;
  }

  public async getMinimumSize(file: File, targetSize: number) {
    const videoInfo = await this.getVideoInfo(file);
    if (!videoInfo)
      return store.commit("consoleErr", "Could not get video info");

    const parameters = this.getTargetParameters(videoInfo, targetSize);

    // The final *1024 is to convert back to bytes
    return ((parameters.audioRate * parameters.duration) / 8192) * 1024 * 1024;
  }

  private async transcode(
    file: File,
    parameters: Parameters,
    targetSize: number,
    targetScale: number
  ) {
    const targetMinimumSize =
      ((parameters.audioRate * parameters.duration) / 8192);

    if (targetMinimumSize > targetSize) {
      return store.commit("consoleErr", "Target size too small");
    }

    store.commit("consoleMsg", "Loading ffmeg-core.js");
    await this.ffmpeg.load();
    store.commit("consoleMsg", "Start transcoding");
    this.ffmpeg.FS("writeFile", "input.mp4", await fetchFile(file));
    this.ffmpeg.setProgress(({ ratio }) => {
      store.commit(
        "ffProgress",
        Math.floor(Number(Number(Math.abs(ratio)) * 100))
      );
    });
    await this.ffmpeg.run(
      "-i",
      "input.mp4",
      "-c:v",
      "libx264",
      "-b:v",
      String(parameters.videoRate) + "k",
      "-vf",
      `scale=iw*${targetScale}:ih*${targetScale}`,
      "-c:a",
      "aac",
      "-b:a",
      String(parameters.audioRate) + "k",
      "output.mp4"
    );
    store.commit("consoleMsg", "Complete transcoding");
    const data = this.ffmpeg.FS("readFile", "output.mp4");

    return data;
  }
}
