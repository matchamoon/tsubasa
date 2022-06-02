# Tsubasa 🦋

Tsubasa is a fast video compression service that runs locally on your device. Maintain the best quality while staying under MB file limits.

[![Visit Tsubasa site](https://img.shields.io/badge/%20Visit%20Tsubasa-▸-6366f1?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABgAAAAYADwa0LPAAAA9ElEQVRIx+2SMW7CQBBFZ1Ga3IHUOYg7AuI4aZCcKCD5KgGJHiGC72MUybGLNOjRLMpqPTYL3nT8xjOa7/92PRa5K4aANyBr67v0EMioRSQFfm2fish77FvM+FPaJ2gK5EANFMAGSOwMAFsndlZY7x6YXArPaJECaNOi6+REAACMNUDumfIrAP67Xxqg8pcIvAYAGl7g55w7cBhHp370nl3SvMeGC9hF/ERbDfASccmjtj9pHgHw4WYaBYIGN8aY88ytNZ/bD+SfpQGqHnllCGDXA7C56ACege8blnwAhkHHAJ6AJVBa2FoBrOysBD6Dw+/ydQI4QqBJRaz0jQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wNS0zMFQxMTo0NzowMyswMDowMGyoM9kAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDUtMzBUMTE6NDc6MDMrMDA6MDAd9YtlAAAAAElFTkSuQmCC&logoColor=white&logoWidth=25)](https://tsubasa.js.org) 

[![preview.png](./public/media/preview.png)](https://tsubasa.js.org)

## Why Tsubasa

Tsubasa was created as a proof-of-concept for a ffmpeg-wasm implementation.

- ✅ Allows transcoding to a size limit (for services with a file size upload limit)
- ✅ Allows scaling resolution, to preserve video quality/bitrate
- ✅ Preserves audio quality
- ✅ Runs locally on your device

## Development

With [the return of secure WASM support in browsers](https://hacks.mozilla.org/2020/07/safely-reviving-shared-memory/), we wanted to see: Could we actually build a server-less compression service, running a desktop program, purely in JavaScript and WebAssembly?

Tsubasa is a work in progress, and welcomes feature suggestions, bug reports, and pull requests.

[See the Wiki for development setup >](https://github.com/matchamoon/tsubasa/wiki)

Tsubasa was named after [翼, the Japanese kanji for "wing"](https://jisho.org/search/%E7%BF%BC).
