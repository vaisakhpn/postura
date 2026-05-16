import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as posedetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/pose";

const BicepsDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [feedback, setFeedback] = useState("Initializing camera...");
  const [count, setCount] = useState(0);
  const debug = false;

  const countRef = useRef(0);
  const stageRef = useRef(null);
  const lastSpokenTime = useRef(0);

  useEffect(() => {
    let detector = null;
    let rafId = null;
    let running = true;

    const setMsg = (msg) => {
      if (debug) console.log("[BicepsDetector]", msg);
      setFeedback(msg);
    };

    const speak = (text) => {
      const now = Date.now();

      if (now - lastSpokenTime.current > 3000) {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
        lastSpokenTime.current = now;
      }
    };

    const setupVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      canvasRef.current.width = videoRef.current.videoWidth || 640;
      canvasRef.current.height = videoRef.current.videoHeight || 480;
    };

    const initModel = async () => {
      await tf.setBackend("webgl");
      await tf.ready();
      detector = await posedetection.createDetector(
        posedetection.SupportedModels.BlazePose,
        {
          runtime: "mediapipe",
          solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/pose",
          modelType: "lite",
        },
      );
      setMsg("Model loaded!");
    };

    const kpToPixel = (kp, w, h) =>
      kp && kp.x <= 1 && kp.y <= 1
        ? { x: kp.x * w, y: kp.y * h, score: kp.score ?? 0 }
        : kp;

    const calcAngle = (A, B, C) => {
      if (!A || !B || !C) return null;
      const AB = { x: A.x - B.x, y: A.y - B.y };
      const CB = { x: C.x - B.x, y: C.y - B.y };
      const dot = AB.x * CB.x + AB.y * CB.y;
      const magAB = Math.hypot(AB.x, AB.y);
      const magCB = Math.hypot(CB.x, CB.y);
      if (magAB === 0 || magCB === 0) return null;
      const cosTheta = Math.min(1, Math.max(-1, dot / (magAB * magCB)));
      return (Math.acos(cosTheta) * 180) / Math.PI;
    };

    const draw = (poses) => {
      const ctx = canvasRef.current.getContext("2d");
      const w = canvasRef.current.width;
      const h = canvasRef.current.height;
      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-w, 0);
      ctx.drawImage(videoRef.current, 0, 0, w, h);
      ctx.restore();

      if (!poses?.length) return;
      const kps = poses[0].keypoints;
      if (!kps) return;

      const points = {};
      kps.forEach((kp) => {
        const p = kpToPixel(kp, w, h);
        if (p && p.score > 0.35) points[kp.name] = p;
      });

      const line = (p1, p2, color = "green") => {
        if (!p1 || !p2) return;
        ctx.beginPath();
        ctx.moveTo(w - p1.x, p1.y);
        ctx.lineTo(w - p2.x, p2.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
      };

      const relevantKeypoints = [
        "left_shoulder",
        "right_shoulder",
        "left_elbow",
        "right_elbow",
        "left_wrist",
        "right_wrist",
        "left_hip",
        "right_hip",
        "left_knee",
        "right_knee",
      ];

      ctx.fillStyle = "lime";
      Object.entries(points).forEach(([name, p]) => {
        if (relevantKeypoints.includes(name)) {
          ctx.beginPath();
          ctx.arc(w - p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      const getSideScore = (prefix) => {
        const needed = ["shoulder", "elbow", "wrist", "hip", "knee"];
        const parts = needed.map((n) => points[`${prefix}_${n}`]);
        if (parts.some((p) => !p)) return 0;
        return parts.reduce((acc, p) => acc + p.score, 0);
      };

      const leftScore = getSideScore("left");
      const rightScore = getSideScore("right");

      let side = null;
      if (leftScore > rightScore && leftScore > 2.0) side = "left";
      else if (rightScore > leftScore && rightScore > 2.0) side = "right";

      if (!side) {
        setMsg("⚠️ Please stand in side view");

        return;
      }

      const shoulder = points[`${side}_shoulder`];
      const elbow = points[`${side}_elbow`];
      const wrist = points[`${side}_wrist`];
      const hip = points[`${side}_hip`];
      const knee = points[`${side}_knee`];

      const armAngle = calcAngle(shoulder, elbow, wrist);

      const torsoH = Math.abs(shoulder.y - hip.y) || 100;
      const elbowHipDistX = Math.abs(elbow.x - hip.x);
      const isElbowPinned = elbowHipDistX < torsoH * 0.35;

      const hipKneeDistX = Math.abs(hip.x - knee.x);
      const isBodyStable = hipKneeDistX < torsoH * 0.4;

      let color = "yellow";
      let status = "Active";

      if (!isElbowPinned) {
        status = "⚠️ Pin elbow to side!";
        color = "red";
        line(elbow, hip, "red");
        speak("Keep elbow pinned");
      } else if (!isBodyStable) {
        status = "⚠️ Don't swing hips!";
        color = "orange";
        line(hip, knee, "orange");
        speak("Don't swing hips");
      } else {
        if (armAngle > 140) {
          stageRef.current = "DOWN";
          color = "white";
          status = "💪 Curl Up!";
        } else if (armAngle < 90 && stageRef.current === "DOWN") {
          stageRef.current = "UP";
          countRef.current += 1;
          setCount(countRef.current);
          status = "⬇️ Lower Down";
          color = "green";
          speak("Good");
        } else {
          status = stageRef.current === "UP" ? "⬇️ Lower Down" : "💪 Curl Up";
          color = "green";
        }
      }

      setMsg(status);

      line(shoulder, elbow, color);
      line(elbow, wrist, color);
      line(shoulder, hip, "cyan");
      line(hip, knee, isBodyStable ? "cyan" : "orange");

      ctx.fillStyle = "white";
      ctx.font = "18px Arial";

      ctx.fillText(`Reps: ${countRef.current}`, 10, 48);
      ctx.fillText(`Side: ${side.toUpperCase()}`, 10, 72);
    };

    const frameLoop = async () => {
      if (!running) return;
      try {
        const poses = await detector.estimatePoses(videoRef.current);
        draw(poses);
      } catch (err) {
        console.error("Pose detection error:", err);
        setMsg("Error: " + err.message);
      }
      rafId = requestAnimationFrame(frameLoop);
    };

    const start = async () => {
      try {
        await setupVideo();
        await initModel();
        frameLoop();
      } catch (err) {
        setMsg("Initialization error: " + err.message);
      }
    };

    start();

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      if (videoRef.current?.srcObject)
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());

      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 w-full flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        💪 AI Bicep Curls (Side View)
      </h2>

      <div className="flex flex-col xl:flex-row gap-8 w-full max-w-7xl justify-center items-start">
        <div className="w-full xl:w-1/2 flex flex-col items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <span>🎥</span> Reference Form (Placeholder)
            </h3>
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-black aspect-video">
              <video
                src="/biceps_side.mp4"
                className="w-full h-full object-fit "
                autoPlay
                loop
                muted
                playsInline
                controls
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none"></div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                Pro Tips:
              </h4>
              <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>Stand sideways to the camera.</li>
                <li>Keep elbow pinned to your hip.</li>
                <li>Stand straight, do not swing your hips.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full xl:w-1/2 flex flex-col items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>👁️</span> AI Analysis
              </span>
              <div className="flex gap-3">
                <span className="text-sm hidden px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
                  Reps: {count}
                </span>
                {/* <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    feedback.includes("Curl") ||
                    feedback.includes("Lower") ||
                    feedback.includes("Good")
                      ? "bg-green-100 text-green-700"
                      : feedback.includes("⚠️")
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {feedback}
                </span> */}
              </div>
            </h3>

            <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-lg aspect-[4/3] flex items-center justify-center">
              <video
                ref={videoRef}
                className="hidden"
                playsInline
                muted
                autoPlay
              />
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
              />

              <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                <div className="bg-black/70 backdrop-blur-md text-white px-6 py-2 rounded-full font-medium text-lg shadow-lg border border-white/10 transition-all duration-300">
                  {feedback}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BicepsDetector;
