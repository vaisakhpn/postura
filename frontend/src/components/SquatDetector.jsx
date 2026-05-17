// src/components/SquatDetector.jsx
import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as posedetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/pose";

const SquatDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const feedbackRef = useRef(null);
  const debug = true;

  const lastSpokenTime = useRef(0); // For voice throttling

  useEffect(() => {
    let detector = null;
    let rafId = null;
    let running = true;

    const setMsg = (m) => {
      if (debug) console.log("[SquatDetector]", m);
      if (feedbackRef.current) {
        feedbackRef.current.innerText = m;
      }
    };

    // 🗣️ Voice Feedback Helper
    const speak = (text) => {
      const now = Date.now();
      if (now - lastSpokenTime.current > 3000) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
        lastSpokenTime.current = now;
      }
    };

    const setupVideo = async () => {
      setMsg("Requesting camera permission...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });
      videoRef.current.srcObject = stream;

      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().then(resolve).catch(resolve);
        };
      });

      canvasRef.current.width = videoRef.current.videoWidth || 640;
      canvasRef.current.height = videoRef.current.videoHeight || 480;
      setMsg(
        `Camera ready: ${canvasRef.current.width}x${canvasRef.current.height}`,
      );
    };

    const initBackendAndModel = async () => {
      await tf.setBackend("webgl");
      await tf.ready();
      setMsg("Loading BlazePose model...");
      detector = await posedetection.createDetector(
        posedetection.SupportedModels.BlazePose,
        {
          runtime: "mediapipe",
          solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/pose",
          modelType: "lite",
        },
      );
      setMsg("Model loaded");
    };

    const kpToPixel = (kp, width, height) => {
      if (!kp) return null;
      if (kp.x <= 1 && kp.y <= 1) {
        return { x: kp.x * width, y: kp.y * height, score: kp.score ?? 0 };
      }
      return kp;
    };

    const calcAngle = (A, B, C) => {
      const AB = { x: A.x - B.x, y: A.y - B.y };
      const CB = { x: C.x - B.x, y: C.y - B.y };
      const dot = AB.x * CB.x + AB.y * CB.y;
      const magAB = Math.hypot(AB.x, AB.y);
      const magCB = Math.hypot(CB.x, CB.y);
      if (magAB === 0 || magCB === 0) return null;
      const cosTheta = Math.min(1, Math.max(-1, dot / (magAB * magCB)));
      return (Math.acos(cosTheta) * 180) / Math.PI;
    };

    const calcTorsoLean = (shoulder, hip) => {
      const dx = shoulder.x - hip.x;
      const dy = hip.y - shoulder.y;
      const angle = Math.atan2(Math.abs(dx), Math.abs(dy)) * (180 / Math.PI);
      return angle;
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

      if (!poses || !poses.length) return;
      const kps = poses[0].keypoints;
      if (!kps) return;

      const points = {};
      kps.forEach((kp) => {
        const p = kpToPixel(kp, w, h);
        if (p && p.score > 0.35) points[kp.name] = p;
      });

      const line = (p1, p2, color = "yellow") => {
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
        "left_hip",
        "right_hip",
        "left_knee",
        "right_knee",
        "left_ankle",
        "right_ankle",
      ];

      ctx.fillStyle = "lime";
      Object.entries(points).forEach(([name, p]) => {
        if (relevantKeypoints.includes(name)) {
          ctx.beginPath();
          ctx.arc(w - p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      const shoulder = points["left_shoulder"] || points["right_shoulder"];
      const hip = points["left_hip"] || points["right_hip"];
      if (shoulder && hip) {
        const torsoAngle = calcTorsoLean(shoulder, hip);
        let torsoFeedback = "";

        if (torsoAngle > 35) {
          torsoFeedback = `⚠️ Leaning too far (${Math.round(torsoAngle)}°)`;
          line(shoulder, hip, "red");
          speak("Lift your chest");
        } else if (torsoAngle > 20) {
          torsoFeedback = `⚠️ Slight lean (${Math.round(torsoAngle)}°)`;
          line(shoulder, hip, "orange");
        } else {
          torsoFeedback = `✅ Good posture (${Math.round(torsoAngle)}°)`;
          line(shoulder, hip, "blue");
        }

        ctx.fillStyle = "white";
        ctx.font = "18px Arial";
        ctx.fillText(torsoFeedback, 10, 48);
      }

      const leftOK =
        points["left_hip"] && points["left_knee"] && points["left_ankle"];
      const rightOK =
        points["right_hip"] && points["right_knee"] && points["right_ankle"];
      const use = leftOK
        ? ["left_hip", "left_knee", "left_ankle"]
        : rightOK
          ? ["right_hip", "right_knee", "right_ankle"]
          : null;
      if (!use) return;

      const A = points[use[0]],
        B = points[use[1]],
        C = points[use[2]];
      const angle = calcAngle(A, B, C);
      if (!angle) return;

      ctx.fillStyle = "white";
      ctx.fillText(`Knee angle: ${Math.round(angle)}°`, 10, 24);

      if (angle < 65) {
        setMsg("⚠️ Too deep — raise a bit!");
        line(A, C, "red");

        // speak("Raise up");
      } else if (angle >= 65 && angle <= 100) {
        setMsg("✅ Good squat posture!");
        line(A, C, "green");

        speak("Good"); // Throttled positive reinforcement
      } else {
        setMsg("⬇️ Go lower for better squat!");
        line(A, C, "orange");

        speak("Go lower");
      }
    };

    const frameLoop = async () => {
      if (!running) return;
      try {
        const poses = await detector.estimatePoses(videoRef.current);
        draw(poses);
      } catch (err) {
        console.error("estimatePoses error:", err);
        setMsg("Error: " + err.message);
      }
      rafId = requestAnimationFrame(frameLoop);
    };

    const start = async () => {
      try {
        await setupVideo();
        await initBackendAndModel();
        frameLoop();
      } catch (err) {
        console.error("Init error:", err);
        setMsg("Startup error: " + err.message);
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
        🏋️ AI Posture Correction - Squat
      </h2>

      <div className="flex flex-col xl:flex-row gap-8 w-full max-w-7xl justify-center items-start">
        <div className="w-full xl:w-1/2 flex flex-col items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <span>📸</span> Reference Form
            </h3>
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-gray-100 dark:bg-black aspect-[3/4]">
              <img
                src="/squat_front.jpeg"
                className="w-full h-full object-contain"
                alt="Squat Reference"
              />
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                Pro Tips:
              </h4>
              <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>Keep your back straight and chest up.</li>
                <li>Lower hips until thighs are parallel to the floor.</li>
                <li>Ensure knees don't cave inward.</li>
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
              {/* <span
                className={`text-sm px-3 py-1 rounded-full font-medium ${
                  feedback.includes("✅")
                    ? "bg-green-100 text-green-700"
                    : feedback.includes("⚠️") || feedback.includes("⬇️")
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {feedback.includes("✅")
                  ? "Good Form"
                  : feedback.includes("⚠️") || feedback.includes("⬇️")
                    ? "Correction Needed"
                    : "Active"}
              </span> */}
            </h3>

            <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-lg aspect-[3/4] flex items-center justify-center">
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
                <div 
                  ref={feedbackRef}
                  className="bg-black/70 backdrop-blur-md text-white px-6 py-2 rounded-full font-medium text-lg shadow-lg border border-white/10 transition-all duration-300"
                >
                  Initializing camera & model...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SquatDetector;
