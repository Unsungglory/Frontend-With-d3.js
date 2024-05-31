//******************************************************************* */
////////////////////// SCREEN SHOT SUPREME! //////////////////////////
//******************************************************************* */

// docs: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
// see: https://www.webrtc-experiment.com/Pluginfree-Screen-Sharing/#20893521368186473
// see: https://github.com/muaz-khan/WebRTC-Experiment/blob/master/Pluginfree-Screen-Sharing/conference.js

//***************************************** */
// TRIGGER SCREEN SHOT BY PRESSING: SsS ///
//***************************************** */
let one = false;
let two = false;
document.addEventListener('keydown', e => {
    if (e.key === 'S') {
        if (two) {
            makePic();
            one = false;
            two = false;
            document.getElementById('fund-page').contentWindow.removeResize();
        } else {
            one = true;
        }
    } else if (one && e.key === 's') {
        two = true;
    } else if (e.key != 'Shift') {
        one = false;
        two = false;
    }
});

let numberOfScreenshots = 0;
let mergedHeight = 0;
/////////////////////////////////////////////////

async function waitForMe(num) {
    // goFullScreen();
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('wait over...')
            resolve(true);
        }, num)
    })
}

async function makePic() {

    // IF WE HAVE CAPTURED THE ENTIRE PAGE WE WILL MERGE IMAGES INTO ONE AND OUTPUT THAT
    if (mergedHeight >= $('#fund-page').contents().height()) {

        const canvas = document.getElementById('output-canvas');
        const context = canvas.getContext('2d');

        // https://stackoverflow.com/questions/29187029/save-multiple-canvas-as-one-image-make-website-like-picframe/29187670#29187670
        const canvases = document.querySelectorAll('.ss-canvas');
        canvases.forEach((canvas, i) => {
            const screenshot = document.getElementById(`ss-canvas-${i}`);

            // merging images
            if (i === 0) {
                context.drawImage(screenshot, 0, 0);
            }
            else if (i === 1) {
                context.drawImage(screenshot, 0, window.innerHeight - 1);
            }
            else {
                const currentHeight = (window.innerHeight * i) - (215 * (i - 1)) - (1.5 * (i - 1));
                context.drawImage(screenshot, 0, currentHeight);
            }
        })

        // create image
        const dataURL = canvas.toDataURL();
        const img = new Image();
        img.onload = function () {
            document.body.appendChild(img);
        };
        img.src = dataURL;
        img.id = 'merged-screenshot';
        img.style.zIndex = 99999;
        img.style.top = '30px';
        img.style.position = 'absolute';
        img.style.boxShadow = '0 0 39px 10px rgba(0,0,0,.2)';
        img.style.transform = 'scale(.8)';
        img.style.border = '1px solid grey'

        document.getElementById('fund-page').style.pointerEvents = 'all';
    } else {
        await takeScreenshot();

        if (document.getElementById('fund-page')) {
            const scrollHeight = window.innerHeight * numberOfScreenshots - 215 * numberOfScreenshots;
            document.getElementById('fund-page').contentWindow.scrollTo(0, scrollHeight);
            document.getElementById('fund-page').style.pointerEvents = 'none';
        }
        else
            window.scrollTo(0, window.innerHeight - 215);
    }
}

// take the screenshot
async function takeScreenshot() {
    // ADD THIS LAYER ONLY ONCE
    if (numberOfScreenshots === 0) {
        let c = document.createElement('canvas');
        c.id = 'output-canvas';
        c.height = $('#fund-page').contents().height();
        c.width = window.innerWidth;
        c.style.display = 'none';
        document.body.appendChild(c);
    }

    document.body.style.cursor = 'none'; // cursor off
    const screenshotJpegBlob = await takeScreenshotJpegBlob();
    console.log(screenshotJpegBlob)
    document.body.style.cursor = 'unset'; // cursor on

    // show preview 
    const newCanvas = await blobToCanvas(screenshotJpegBlob, window.width, window.height);
    newCanvas.classList = 'ss-canvas';
    newCanvas.id = 'ss-canvas-' + numberOfScreenshots;
    newCanvas.style.display = 'none';
    document.body.appendChild(newCanvas);

    numberOfScreenshots += 1;
}

async function takeScreenshotJpegBlob() {
    const canvas = await takeScreenshotCanvas();

    if (!canvas) {
        console.log('error: takeScreenshotJpegBlob')
        return null;
    }

    return getJpegBlob(canvas);
}

async function takeScreenshotCanvas() {
    const stream = await takeScreenshotStream();

    if (!stream) {
        console.error('no stream')
        return null;
    }

    // from: https://stackoverflow.com/a/57665309/5221762
    const video = document.createElement('video');
    // await waitForMe(2300);

    const result = await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
            video.play();
            video.pause();

            // from: https://github.com/kasprownik/electron-screencapture/blob/master/index.js
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = numberOfScreenshots === 0 ? video.videoHeight : video.videoHeight - 215;

            // CAPTURES THE FINAL SCREENSHOT WHICH IS USUALLY MUCH SHORTER THAN THE PREVIOUS SCREENSHOTS
            if (document.getElementById('output-canvas').height - mergedHeight < canvas.height) {
                canvas.height = document.getElementById('output-canvas').height - mergedHeight - numberOfScreenshots;
                context.drawImage(video, 0, -(window.innerHeight - canvas.height) - numberOfScreenshots, video.videoWidth, video.videoHeight);

                mergedHeight = mergedHeight + canvas.height + numberOfScreenshots;

            } else {
                mergedHeight = mergedHeight + canvas.height;

                // see: https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement
                const yPos = numberOfScreenshots === 0 ? 0 : -215;
                context.drawImage(video, 0, yPos, video.videoWidth, video.videoHeight);
            }

            resolve(canvas);
        };
        video.srcObject = stream;
    });

    stream.getTracks().forEach(function (track) {
        track.stop();
    });

    return result;
}

async function takeScreenshotStream() {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/Window/screen
    const width = screen.width * (window.devicePixelRatio || 1);
    const height = screen.height * (window.devicePixelRatio || 1);

    const errors = [];
    let stream;
    try {
        stream = await getDisplayMedia({
            // see: https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints/video
            video: {
                cursor: 'never',
                width,
                height,
                frameRate: 1
            },
            audio: false
            // logicalSurface: true,
        });
    } catch (ex) {
        errors.push(ex);
    }

    if (errors.length) {
        console.debug(...errors);
    }

    return stream;
}

function getDisplayMedia(options) {
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        return navigator.mediaDevices.getDisplayMedia(options);
    }
    if (navigator.getDisplayMedia) {
        return navigator.getDisplayMedia(options);
    }
    if (navigator.webkitGetDisplayMedia) {
        return navigator.webkitGetDisplayMedia(options);
    }
    if (navigator.mozGetDisplayMedia) {
        return navigator.mozGetDisplayMedia(options);
    }
    throw new Error('getDisplayMedia is not defined');
}

// from: https://stackoverflow.com/a/46182044/5221762
async function getJpegBlob(canvas) {
    return new Promise((resolve, reject) => {
        // docs: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
        canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.95);
    });
}

function blobToCanvas(blob, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const scale = Math.min(1, maxWidth ? maxWidth / img.width : 1, maxHeight ? maxHeight / img.height : 1);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
            resolve(canvas);
        };
        img.onerror = () => {
            reject(new Error('Error load blob to Image'));
        };
        img.src = URL.createObjectURL(blob);
    });
}

// async function takeScreenshotJpegBytes() {
//     const canvas = await takeScreenshotCanvas();
//     if (!canvas) {
//         return null;
//     }
//     return getJpegBytes(canvas);
// }

// async function getJpegBytes(canvas) {
//     const blob = await getJpegBlob(canvas);
//     return new Promise((resolve, reject) => {
//         const fileReader = new FileReader();

//         fileReader.addEventListener('loadend', function () {
//             if (this.error) {
//                 reject(this.error);
//                 return;
//             }
//             resolve(this.result);
//         });

//         fileReader.readAsArrayBuffer(blob);
//     });
// }



// function getUserMedia(options) {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//         return navigator.mediaDevices.getUserMedia(options);
//     }
//     if (navigator.getUserMedia) {
//         return navigator.getUserMedia(options);
//     }
//     if (navigator.webkitGetUserMedia) {
//         return navigator.webkitGetUserMedia(options);
//     }
//     if (navigator.mozGetUserMedia) {
//         return navigator.mozGetUserMedia(options);
//     }
//     throw new Error('getUserMedia is not defined');
// }

/* Get the element you want displayed in fullscreen mode (a video in this example): */

/* When the openFullscreen() function is executed, open the video in fullscreen.
Note that we must include prefixes for different browsers, as they don't support the requestFullscreen method yet */

function goFullScreen() {
    const elem = document.getElementById("fund-page");
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}
