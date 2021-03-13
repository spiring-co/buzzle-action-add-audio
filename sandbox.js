const mergeThumbnail = require("./index")
/**
 * Download a resource from `url` to `dest`.
 * @param {string} url - Valid URL to attempt download of resource
 * @param {string} dest - Valid path to save the file.
 * @returns {Promise<void>} - Returns asynchronously when successfully completed download
 */
const output = "musicWithFade.mp4";
let audio = 'test.mp3'
const input = 'video.mp4'
let started = Date.now()
mergeThumbnail(
  { output: "C:\\Users\\Utkarsh\\Desktop", workpath: "C:\\Users\\Utkarsh\\Desktop" }, { logger: { log: console.log }, workpath: "C:\\Users\\Utkarsh\\Desktop" }, {
  input, audio, output,
  onStart: () => {
    console.log("Started")
    started = Date.now()
  },
  onComplete: () => console.log("completed in", (Date.now() - started) / 1000, " secs")
})
