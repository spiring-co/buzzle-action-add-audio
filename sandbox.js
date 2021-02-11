var ffmpeg = require("fluent-ffmpeg");
const https = require("https");
const fs = require("fs");

/**
 * Download a resource from `url` to `dest`.
 * @param {string} url - Valid URL to attempt download of resource
 * @param {string} dest - Valid path to save the file.
 * @returns {Promise<void>} - Returns asynchronously when successfully completed download
 */
function download(url, dest) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest, { flags: "wx" });
        file.on("finish", () => resolve());
        file.on("error", (err) => {
          file.close();
          if (err.code === "EEXIST") reject("File already exists");
          else fs.unlink(dest, () => reject(err.message)); // Delete temp file
        });
        response.pipe(file);
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        //Recursively follow redirects, only a 200 will resolve.
        download(response.headers.location, dest).then(() => resolve());
      } else {
        reject(
          `Server responded with ${response.statusCode}: ${response.statusMessage}`
        );
      }
    });

    request.on("error", (err) => {
      reject(err.message);
    });
  });
}
ffmpeg.setFfmpegPath("/Users/harshbhatia/code/sandbox/ffmpeg-b4.2.2");
ffmpeg.setFfprobePath("/Users/harshbhatia/Desktop/ffprobe");
const output = "output.mp4";
// download("https://firebasestorage.googleapis.com/v0/b/bulaava-functions-test.appspot.com/o/bulaavaAssets%2F1594970137219.mpeg?alt=media&token=c22ce4e7-69b8-435e-86a8-3454322daf9f", 'abc.mpeg')
ffmpeg()
  //input files
  .input(
    "https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4"
  )
  .input(
    "https://firebasestorage.googleapis.com/v0/b/bulaava-functions-test.appspot.com/o/bulaavaAssets%2F1594972730964.mp3?alt=media&token=ba12c8d5-1cd3-4443-a7e3-374f6f6745c9"
  )
  // .input("https://firebasestorage.googleapis.com/v0/b/bulaava-functions-test.appspot.com/o/bulaavaAssets%2F1594970137219.mpeg?alt=media&token=c22ce4e7-69b8-435e-86a8-3454322daf9f")
  .outputOptions(["-map 1:a:0", "-map 0:v:0", "-shortest"])
  .on("error", function (err, stdout, stderr) {
    console.log("join audio video failed: " + err.message);
  })
  .on("progress", function (value) {
    console.log("In Progress.." + value);
  })
  .on("end", function () {
    //save
    console.log("added audio successfully");
  })
  .save(output);
