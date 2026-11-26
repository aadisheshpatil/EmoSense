import { useEffect, useRef, useState } from 'react';

const API_URL = 'http://127.0.0.1:8000/api/facial-emotion';

const emotionList = [
  'happy',
  'sad',
  'angry',
  'neutral',
  'fear',
  'surprise',
  'disgust',
];

export default function LiveEmotion({ onResult }) {  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const busyRef = useRef(false);
  const predictionWindowRef = useRef([]);


  const [cameraActive, setCameraActive] = useState(false);
  const [emotion, setEmotion] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [error, setError] = useState('');

  const [stats, setStats] = useState({});
  const [history, setHistory] = useState([]);
  const [totalDetections, setTotalDetections] = useState(0);

  const resetAnalytics = () => {
  setStats({});
  setHistory([]);
  setTotalDetections(0);
  predictionWindowRef.current = [];
};

  const startCamera = async () => {
    try {
      setError('');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      await videoRef.current.play();

      resetAnalytics();
      setCameraActive(true);
 } catch (err) {
  console.error('Camera Error:', err);

  setError(
    `Camera Error: ${err.name} - ${err.message}`
  );
}
  };

  const stopCamera = () => {
    clearInterval(intervalRef.current);

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
    setEmotion(null);
    setConfidence(null);
    setFaceDetected(false);
    if (onResult) {
  onResult({
    face_detected: false,
    emotion: null,
    confidence: null,
  });
}
    busyRef.current = false;
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!cameraActive) return;

    intervalRef.current = setInterval(async () => {
      if (busyRef.current || !videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;

      if (video.readyState < 2 || !video.videoWidth) return;

      busyRef.current = true;

      try {
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, 'image/jpeg', 0.8)
        );

        if (!blob) throw new Error('Could not capture camera frame.');

        const formData = new FormData();
        formData.append('file', blob, 'webcam.jpg');

        const response = await fetch(API_URL, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Backend error: ${response.status}`);
        }

    

        const result = await response.json();

if (result.face_detected && result.emotion) {
  setFaceDetected(true);

  const detectedEmotion = result.emotion.toLowerCase();
  const predictionConfidence = Number(result.confidence);

  if (
    Number.isFinite(predictionConfidence) &&
    predictionConfidence >= 60
  ) {
    const updatedWindow = [
      ...predictionWindowRef.current,
      {
        emotion: detectedEmotion,
        confidence: predictionConfidence,
      },
    ].slice(-5);

    predictionWindowRef.current = updatedWindow;

    const emotionCounts = updatedWindow.reduce((counts, item) => {
      counts[item.emotion] = (counts[item.emotion] || 0) + 1;
      return counts;
    }, {});

    const stableResult = Object.entries(emotionCounts)
      .find(([, count]) => count >= 3);

    if (stableResult) {
      const stableEmotion = stableResult[0];

      const matchingPredictions = updatedWindow.filter(
        (item) => item.emotion === stableEmotion
      );

      const averageConfidence =
        matchingPredictions.reduce(
          (sum, item) => sum + item.confidence,
          0
        ) / matchingPredictions.length;

      setEmotion(stableEmotion);
      setConfidence(Number(averageConfidence.toFixed(1)));

      if (onResult) {
  onResult({
    face_detected: true,
    emotion: stableEmotion,
    confidence: Number(averageConfidence.toFixed(1)),
  });
}

      setStats((previous) => ({
        ...previous,
        [stableEmotion]: (previous[stableEmotion] || 0) + 1,
      }));

      setTotalDetections((previous) => previous + 1);

      setHistory((previous) => [
        {
          emotion: stableEmotion,
          confidence: Number(averageConfidence.toFixed(1)),
          time: new Date().toLocaleTimeString(),
        },
        ...previous,
      ].slice(0, 10));
    }
  }
} else {
  setFaceDetected(false);
  predictionWindowRef.current = [];
  setEmotion(null);
  setConfidence(null);

  if (onResult) {
    onResult({
      face_detected: false,
      emotion: null,
      confidence: null,
    });
  }
}

setError('');
      } catch (err) {
        setError(err.message || 'Emotion detection failed.');
      } finally {
        busyRef.current = false;
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [cameraActive]);

  const dominantEmotion =
    Object.entries(stats).sort((a, b) => b[1] - a[1])[0]?.[0] || '--';
    const displayedEmotionList = [
  ...new Set([
    'happy',
    'sad',
    'angry',
    'neutral',
    'fear',
    'surprise',
    'disgust',
    ...Object.keys(stats),
  ]),
];

  return (
    <section id="live-emotion" className="w-full py-20 px-6">

      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">

          <p className="text-primary font-semibold tracking-widest uppercase text-sm">
            AI Emotion Intelligence
          </p>

          <h2 className="text-3xl md:text-5xl font-bold mt-3">
            Real-Time Emotion Analytics
          </h2>

          <p className="text-on-surface-variant mt-4">
            Detect, monitor and analyse facial emotions using artificial intelligence.
          </p>

        </div>

        {/* Camera and Analysis */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Camera */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-5">

            <h3 className="text-xl font-bold mb-5">
              Live Camera
            </h3>

            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full rounded-xl bg-black aspect-video object-cover"
            />

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-3 mt-5">

              {!cameraActive ? (

                <button
                  onClick={startCamera}
                  className="flex-1 bg-primary text-white rounded-xl py-3 font-semibold"
                >
                  Start Camera
                </button>

              ) : (

                <button
                  onClick={stopCamera}
                  className="flex-1 bg-red-500 text-white rounded-xl py-3 font-semibold"
                >
                  Stop Camera
                </button>

              )}

            </div>

            {error && (
              <p className="text-red-400 mt-4 text-sm">
                {error}
              </p>
            )}

          </div>

          {/* Current Emotion */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-8">

            <h3 className="text-xl font-bold mb-8">
              Current Emotion Analysis
            </h3>

            <div className="mb-8">

              <p className="text-on-surface-variant text-sm">
                Face Detection
              </p>

              <p className="text-2xl font-semibold mt-2">
                {faceDetected ? 'Face Detected' : 'No Face Detected'}
              </p>

            </div>

            <div className="mb-8">

              <p className="text-on-surface-variant text-sm">
                Detected Emotion
              </p>

              <p className="text-4xl font-bold text-primary mt-3 capitalize">
                {emotion || 'Waiting...'}
              </p>

            </div>

            <div>

              <p className="text-on-surface-variant text-sm">
                Prediction Confidence
              </p>

              <p className="text-3xl font-semibold mt-2">
                {confidence !== null ? `${confidence}%` : '--'}
              </p>

            </div>

          </div>

        </div>

        {/* Analytics Summary */}
        <div className="mt-12">

          <h3 className="text-2xl font-bold mb-6">
            Emotion Analytics Dashboard
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

            <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-6">

              <p className="text-on-surface-variant text-sm">
                Total Detections
              </p>

              <p className="text-4xl font-bold text-primary mt-3">
                {totalDetections}
              </p>

            </div>

            <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-6">

              <p className="text-on-surface-variant text-sm">
                Dominant Emotion
              </p>

              <p className="text-3xl font-bold text-primary mt-3 capitalize">
                {dominantEmotion}
              </p>

            </div>

            <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-6">

              <p className="text-on-surface-variant text-sm">
                Different Emotions
              </p>

              <p className="text-4xl font-bold text-primary mt-3">
                {Object.keys(stats).length}
              </p>

            </div>

          </div>

        </div>

        {/* Emotion Distribution */}
        <div className="mt-12 bg-surface-container border border-outline-variant/30 rounded-2xl p-8">

          <h3 className="text-2xl font-bold mb-8">
            Emotion Distribution
          </h3>

          <div className="space-y-6">

            {displayedEmotionList.map((item) => {

              const count = stats[item] || 0;

              const percentage =
                totalDetections > 0
                  ? (count / totalDetections) * 100
                  : 0;

              const displayedEmotionList = [
  ...new Set([...emotionList, ...Object.keys(stats)]),
];
return (

                <div key={item}>

                  <div className="flex justify-between mb-2">

                    <span className="capitalize font-semibold">
                      {item}
                    </span>

                    <span className="text-on-surface-variant text-sm">
                      {count} detections ({percentage.toFixed(1)}%)
                    </span>

                  </div>

                  <div className="w-full h-3 bg-surface rounded-full overflow-hidden">

                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />

                  </div>

                </div>

              );

            })}

          </div>

        </div>

        {/* Live Emotion Timeline */}
<div className="mt-12 bg-surface-container border border-outline-variant/30 rounded-2xl p-8">

  <h3 className="text-2xl font-bold mb-3">
    Live Emotion Timeline
  </h3>

  <p className="text-on-surface-variant text-sm mb-8">
    Track how detected facial expressions change over time.
  </p>

  {history.length === 0 ? (

    <p className="text-on-surface-variant">
      Timeline will appear after emotion detection begins.
    </p>

  ) : (

    <div className="flex items-end gap-3 overflow-x-auto pb-4">

      {[...history].reverse().map((item, index) => {

        const emotionColors = {
          happy: 'bg-yellow-400',
          sad: 'bg-blue-400',
          angry: 'bg-red-500',
          neutral: 'bg-gray-400',
          fear: 'bg-purple-500',
          surprise: 'bg-pink-500',
          disgust: 'bg-green-500',
        };

        const color =
          emotionColors[item.emotion] || 'bg-primary';

        return (

          <div
            key={`${item.time}-${index}`}
            className="flex flex-col items-center min-w-[85px]"
          >

            <span className="text-sm font-semibold capitalize mb-3">
              {item.emotion}
            </span>

            <div
              className={`w-12 rounded-t-lg ${color}`}
              style={{
                height: `${Math.max(
                  35,
                  Math.min(Number(item.confidence) || 35, 100)
                )}px`,
              }}
            />

            <span className="text-xs text-on-surface-variant mt-3">
              {item.time}
            </span>

          </div>

        );

      })}

    </div>

  )}

</div>
        {/* Detection History */}
        <div className="mt-12 bg-surface-container border border-outline-variant/30 rounded-2xl p-8">

          <div className="flex justify-between items-center flex-wrap gap-4 mb-6">

            <h3 className="text-2xl font-bold">
              Recent Detection History
            </h3>

            <button
              onClick={resetAnalytics}
              className="bg-primary text-white px-5 py-2 rounded-lg font-semibold"
            >
              Reset Analytics
            </button>

          </div>

          {history.length === 0 ? (

            <p className="text-on-surface-variant">
              No emotion detections recorded yet. Start your camera to begin.
            </p>

          ) : (

            <div className="space-y-3">

              {history.map((item, index) => (

                <div
                  key={`${item.time}-${index}`}
                  className="flex justify-between items-center bg-surface rounded-xl p-4"
                >

                  <div>

                    <p className="font-semibold capitalize text-lg">
                      {item.emotion}
                    </p>

                    <p className="text-sm text-on-surface-variant">
                      {item.time}
                    </p>

                  </div>

                  <p className="font-semibold text-primary">
                    {item.confidence ?? '--'}%
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </section>
  );
}