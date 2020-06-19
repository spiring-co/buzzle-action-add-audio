var ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath("C:/Users/abuty/Desktop/ffmpeg-b4.2.2.exe")
const output = "output.mp4"
ffmpeg()
  //input files
  .input("https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4")
  .input("https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3")
  .outputOptions([
  '-map 1:a:0',
  '-map 0:v:0'])
  .on("error", function (err, stdout, stderr) {
    console.log("join audio video failed: " + err.message);
  })
  .on("progress", function (value) {
    console.log("In Progress.."+value);
  })
  .on("end", function () {
      //save
      console.log("added audio successfully");
})
  .save(output);
