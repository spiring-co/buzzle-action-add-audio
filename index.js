const ffmpeg = require("fluent-ffmpeg");
const pkg = require("./package.json");
const fetch = require("node-fetch");
const nfp = require("node-fetch-progress");
const fs = require("fs");
const path = require("path");
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');

const getBinary = (job, settings) => {
  return new Promise((resolve, reject) => {
    const version = "b4.2.2";
    const filename = `ffmpeg-${version}${process.platform == "win32" ? ".exe" : ""
      }`;
    const fileurl = `https://github.com/eugeneware/ffmpeg-static/releases/download/${version}/${process.platform}-x64`;
    const output = path.join(settings.workpath, filename);

    if (fs.existsSync(output)) {
      settings.logger.log(
        `> using an existing ffmpeg binary ${version} at: ${output}`
      );
      return resolve(output);
    }

    settings.logger.log(`> ffmpeg binary ${version} is not found`);
    settings.logger.log(
      `> downloading a new ffmpeg binary ${version} to: ${output}`
    );

    const errorHandler = (error) =>
      reject(
        new Error({
          reason: "Unable to download file",
          meta: { fileurl, error },
        })
      );

    fetch(fileurl)
      .then((res) =>
        res.ok
          ? res
          : Promise.reject({
            reason: "Initial error downloading file",
            meta: { fileurl, error: res.error },
          })
      )
      .then((res) => {
        const progress = new nfp(res);

        progress.on("progress", (p) => {
          process.stdout.write(
            `${Math.floor(p.progress * 100)}% - ${p.doneh}/${p.totalh} - ${p.rateh
            } - ${p.etah}                       \r`
          );
        });

        const stream = fs.createWriteStream(output);

        res.body.on("error", errorHandler).pipe(stream);

        stream.on("error", errorHandler).on("finish", () => {
          settings.logger.log(
            `> ffmpeg binary ${version} was successfully downloaded`
          );
          fs.chmodSync(output, 0o755);
          resolve(output);
        });
      });
  });
};

module.exports = (job, settings, { input, audio, output, fadeOutDuration = 3, fadeIntDuration = 2, onStart, onComplete }) => {
  onStart()
  return new Promise((resolve, reject) => {
    input = input || job.output;
    output = output || "musicAdded.mp4";

    if (input.indexOf("http") !== 0 && !path.isAbsolute(input)) {
      input = path.join(job.workpath, input);
    }
    if (audio.indexOf("http") !== 0 && !path.isAbsolute(audio)) {
      audio = path.join(job.workpath, audio);
    }

    if (!path.isAbsolute(output)) output = path.join(job.workpath, output);

    settings.logger.log(
      `[${job.uid}] starting buzzle-action-add-audio on [${input}] `
    );

    getBinary(job, settings).then(async (p) => {
      ffmpeg.setFfmpegPath(p);
      //get video duration and fade audio from start and last 5 sec
      const videoDetails = (await ffprobe(input, { path: ffprobeStatic.path })).streams.find(({ codec_type }) => codec_type === 'video')
      const fadeOutStartAt = parseInt(videoDetails.duration) - fadeOutDuration
      ffmpeg()
        .input(input)
        .input(audio)
        .outputOptions(["-map 1:a:0", "-map 0:v:0", "-shortest",
          `-af afade=t=in:st=0:d=${fadeIntDuration},afade=t=out:st=${fadeOutStartAt}:d=${fadeOutDuration}`])
        .on("error", function (err, stdout, stderr) {
          console.log("join audio video failed: " + err.message);
          onComplete()
          reject(err);
        })
        .on("progress", function (value) {
          console.log("In Progress..");
        })
        .on("end", function () {
          onComplete()
          job.output = output;
          resolve(job);
        })
        .save(output);
    });
  });
};
