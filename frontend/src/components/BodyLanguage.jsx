import { useEffect, useRef, useState } from 'react';

const API_URL = 'http://127.0.0.1:8000/api/body-language';

export default function BodyLanguage({ onResult }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const busyRef = useRef(false);

  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const analyzeFrame = async () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      busyRef.current ||
      videoRef.current.readyState < 2
    ) {
      return;
    }

    busyRef.current = true;

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      });

      if (!blob) {
        throw new Error('Could not capture webcam frame.');
      }

      const formData = new FormData();
      formData.append('file', blob, 'body-frame.jpg');

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Body analysis failed.');
      }

      setAnalysis(result);
      if (onResult) {
  onResult(result);
}
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to analyze body language.');
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      setError('');
      setAnalysis(null);
      setLoading(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      await videoRef.current.play();

      setCameraActive(true);
      setLoading(false);

      await analyzeFrame();

      intervalRef.current = setInterval(() => {
        analyzeFrame();
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Unable to access webcam.');
    }
  };

  const stopCamera = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    busyRef.current = false;
    setCameraActive(false);
    setLoading(false);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const analysisItems = [
    ['Shoulder Alignment', analysis?.body_analysis?.shoulder_alignment],
    ['Body Posture', analysis?.body_analysis?.body_posture],
    ['Arm Position', analysis?.body_analysis?.arm_position],
    ['Head Alignment', analysis?.body_analysis?.head_alignment],
  ];

  const movementItems = [
    ['Overall Movement', analysis?.movement_analysis?.overall],
    ['Head Movement', analysis?.movement_analysis?.head],
    ['Arm Movement', analysis?.movement_analysis?.arms],
    ['Upper Body Movement', analysis?.movement_analysis?.upper_body],
  ];

  return (
    <section id="body-language" className="bg-slate-950 py-20 text-white">
      <div className="mx-auto max-w-6xl px-6">

        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-purple-400">
            Body Language Analysis
          </p>

          <h2 className="text-3xl font-bold md:text-4xl">
            Real-Time Body Language Detection
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Analyze body posture, head alignment, arm position and movement
            using real-time human pose detection.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">

          {/* Webcam */}
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <h3 className="mb-4 text-xl font-semibold">Live Camera</h3>

            <div className="overflow-hidden rounded-xl bg-black">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="aspect-video w-full object-cover"
              />
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="mt-5 flex flex-wrap gap-3">
              {!cameraActive ? (
                <button
                  onClick={startCamera}
                  disabled={loading}
                  className="rounded-lg bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Starting Camera...' : 'Start Analysis'}
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="rounded-lg bg-red-600 px-6 py-3 font-semibold hover:bg-red-700"
                >
                  Stop Camera
                </button>
              )}

              <span className="flex items-center text-sm text-slate-400">
                {cameraActive ? '● Camera Active' : '● Camera Inactive'}
              </span>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-400">{error}</p>
            )}
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
              <h3 className="mb-5 text-xl font-semibold">
                Body Posture Analysis
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {analysisItems.map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl bg-slate-800 p-4"
                  >
                    <p className="text-sm text-slate-400">{label}</p>
                    <p className="mt-2 font-semibold text-purple-300">
                      {value || 'Waiting for detection...'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
              <h3 className="mb-5 text-xl font-semibold">
                Movement Analysis
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {movementItems.map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl bg-slate-800 p-4"
                  >
                    <p className="text-sm text-slate-400">{label}</p>
                    <p className="mt-2 font-semibold text-green-300">
                      {value || 'Waiting for detection...'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
              <h3 className="mb-3 text-lg font-semibold">
                Detection Information
              </h3>

              <p className="text-sm text-slate-400">
                Pose Detection:{' '}
                <span className="font-semibold text-white">
                  {analysis
                    ? analysis.pose_detected
                      ? 'Detected'
                      : 'Not Detected'
                    : 'Waiting'}
                </span>
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Total Landmarks:{' '}
                <span className="font-semibold text-white">
                  {analysis?.total_landmarks ?? '--'}
                </span>
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Average Visibility:{' '}
                <span className="font-semibold text-white">
                  {analysis
                    ? `${analysis.average_visibility}%`
                    : '--'}
                </span>
              </p>
            </div>

          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Body posture and movement cues are estimates based on visible
          landmarks; they do not independently establish a person's emotions.
        </p>

      </div>
    </section>
  );
}
