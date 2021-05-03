const mergeThumbnail = require("./index")
/**
 * Download a resource from `url` to `dest`.
 * @param {string} url - Valid URL to attempt download of resource
 * @param {string} dest - Valid path to save the file.
 * @returns {Promise<void>} - Returns asynchronously when successfully completed download
 */
const output = "musicWithFade.mp4";
let audio = 'test.mp3'
const input = 'golden.mp4'
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

// @ECHO OFF
// :loop
// REM Execute the MS-DOS delcommand ever 20 seconds.
// del /S /q "C:\Users\Administrator\AppData\Local\Temp\2\*"
// FOR /D %%p IN ("C:\Users\Administrator\AppData\Local\Temp\2\*.*") DO rmdir "%%p" /s /q
// del /S /q "C:\Users\Administrator\AppData\Roaming\Adobe\Common\Media Cache Files\*"
// FOR /D %%p IN ("C:\Users\Administrator\AppData\Roaming\Adobe\Common\Media Cache Files\*.*") DO rmdir "%%p" /s /q
// timeout 200
// goto loop

// @ECHO OFF
// @REM go to code directory,pull the code,yarn cache clean,then yarn install,then yarn start prod scaleinstance to 4 in 10 sec 
// SET PM2_HOME=C:\Users\Administrator\.pm2
// echo deleting pm2 process
// call pm2 delete all
// cd  "C:\code\buzzle-ae-render-service"
// echo fetching latest code...
// call git stash
// call git pull origin master
// echo code updated!
// echo cleaning cache...
// call yarn cache clean -all
// del yarn.lock
// echo Installing  dependencies...
// call yarn
// echo Starting Render servers...
// call yarn start-prod
// echo scaling renderer...
// SET /A "index=2" 
// SET /A "count=5" 
// :while 
// if %index% leq %count% ( 
//     call pm2 scale renderer %index%
//     echo renderer scaled to %index% 
//     if %index% NEQ 5 timeout /t 10
//     goto :Increment
// :Increment 
//    SET /A "index=index + 1" 
//    goto :while 
// )
// echo Done scaling renderer to 5
// echo init extraction server...
// cd  "C:\code\buzzle-ae-extract"
// echo fetching latest code...
// call git pull origin master
// echo code updated!
// echo cleaning cache...
// call yarn cache clean -all
// del yarn.lock
// echo Installing  dependencies...
// call yarn
// echo Starting extraction server...
// call yarn start-prod
// echo "Done!"
// call pm2 save
// call pm2 list
