import MediaInfoFactory from "mediainfo.js";
import type {
  MediaInfo,
  ReadChunkFunc,
  ResultObject,
} from "mediainfo.js/dist/types";
import { createFFmpeg, fetchFile, type FFmpeg } from "@ffmpeg/ffmpeg";
import type Messenger from "../utils/messenger.util";

type Parameters = {
  duration: number;
  audioRate: number;
  videoRate: number;
};

export default class VideoService {
  private ffmpeg: FFmpeg;
  private messenger: Messenger;

  constructor(messenger: Messenger) {
    this.messenger = messenger;
    this.ffmpeg = createFFmpeg({ log: true });
  }

  async shrinkVideo(file: File, targetSize: number) {
    const originalInfo = await this.getVideoInfo(file);

    if (typeof originalInfo != "object") return;

    const parameters = this.getTargetParameters(originalInfo, targetSize);

    return this.transcode(file, parameters, targetSize);
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

    const audioRate = Number(originalInfo.media.track[2]) ?? 0;

    const videoRate = (targetSize * 8192) / (1.048576 * duration) - duration;

    return {
      duration,
      audioRate,
      videoRate,
    } as Parameters;
  }

  private async transcode(
    file: File,
    parameters: Parameters,
    targetSize: number
  ) {
    const targetMinimumSize =
      (parameters.videoRate * parameters.duration) / 8192;

    if (targetMinimumSize > targetSize) {
      console.error("bad size");
      return;
    }

    const inputFileName = file.name as string;

    this.messenger.sendMessage("Loading ffmeg-core.js");
    await this.ffmpeg.load();
    this.messenger.sendMessage("Start transcoding");
    this.ffmpeg.FS("writeFile", inputFileName, await fetchFile(file));
    await this.ffmpeg.run(
      "-i",
      inputFileName,
      "-c:v",
      "libx264",
      "-b:v",
      String(parameters.videoRate) + "k",
      "-c:a",
      "aac",
      "-b:a",
      String(parameters.audioRate) + "k",
      "output.mp4"
    );
    this.messenger.sendMessage("Complete transcoding");
    const data = this.ffmpeg.FS("readFile", "output.mp4");

    return data;
  }
}
