const video = document.getElementById('video')

/*------adjust the values here to calibrate the sensitivity of the facial recognition system------*/
var calibrateHappy = 0.8;
var calibrateSad = 0.8;
var calibrateAngry = 0.8;
var calibrateSurprise = 0.8;
var calibrateFear = 0.8;

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

/*-------Adds the pulsing animation depending on the facial recognition input -------------*/
function startAnimation(el){
  var elem = document.getElementById(el);
  elem.style.setProperty('animation','pulse 2s ease-out infinite')
}

function startAnimation2(el){
  var elem = document.getElementById(el);
  elem.style.setProperty('animation','pulse 2s 1s ease-out infinite')
}

function stopAnimation(el){
  var elem = document.getElementById(el);

  requestAnimationFrame(()=>{
    elem.style.animation = "";
  });
}
/*-------Adds the pulsing animation depending on the facial recognition input -------------*/

video.addEventListener('play', () => {

  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, 
    new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    
    if(detections[0].expressions.neutral){
      console.log("Neutral")
    }

    if(detections[0].expressions.surprised > calibrateSurprise){
      console.log("Surprised")
      startAnimation('pulseSurpriseBehind1')
      startAnimation2('pulseSurpriseBehind2')
    }else{
      stopAnimation('pulseSurpriseBehind1')
      stopAnimation('pulseSurpriseBehind2')
    }

    if(detections[0].expressions.sad > calibrateSad || detections[0].expressions.fearful > calibrateFear){
      console.log("Sad")
      startAnimation('pulseSadBehind1')
      startAnimation2('pulseSadBehind2')
    }else{
      stopAnimation('pulseSadBehind1')
      stopAnimation('pulseSadBehind2')
    }

    if(detections[0].expressions.angry > calibrateAngry){
      console.log("Angry")
      startAnimation('pulseAngryBehind1')
      startAnimation2('pulseAngryBehind2')
    }else{
      stopAnimation('pulseAngryBehind1')
      stopAnimation('pulseAngryBehind2')
    }

    if(detections[0].expressions.happy > calibrateHappy){
      console.log("Happy")
      startAnimation('pulseHappyBehind1')
      startAnimation2('pulseHappyBehind2')
    }else{
      stopAnimation('pulseHappyBehind1')
      stopAnimation('pulseHappyBehind2')
    }

  }, 100)
})

