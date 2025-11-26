// src/components/SquatDetector.jsx
import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as posedetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/pose";

const SquatDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [feedback, setFeedback] = useState("Initializing camera & model...");
  const debug = true;

  useEffect(() => {
    let detector = null;
    let rafId = null;
    let running = true;

    const setMsg = (m) => {
      if (debug) console.log("[SquatDetector]", m);
      setFeedback(m);
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
        `Camera ready: ${canvasRef.current.width}x${canvasRef.current.height}`
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
        }
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
      // 🆕 Calculate torso lean relative to vertical
      const dx = shoulder.x - hip.x;
      const dy = hip.y - shoulder.y; // vertical distance
      const angle = Math.atan2(Math.abs(dx), Math.abs(dy)) * (180 / Math.PI);
      return angle; // 0 = straight vertical, higher = leaning forward
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

      ctx.fillStyle = "lime";
      Object.values(points).forEach((p) => {
        ctx.beginPath();
        ctx.arc(w - p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // 🆕 Draw torso line (shoulder → hip)
      const shoulder = points["left_shoulder"] || points["right_shoulder"];
      const hip = points["left_hip"] || points["right_hip"];
      if (shoulder && hip) {
        const torsoAngle = calcTorsoLean(shoulder, hip);
        let torsoFeedback = "";

        if (torsoAngle > 35) {
          torsoFeedback = `⚠️ Leaning too far (${Math.round(torsoAngle)}°)`;
          line(shoulder, hip, "red");
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

      // 🦵 Leg angle detection (same as before)
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
      } else if (angle >= 65 && angle <= 100) {
        setMsg("✅ Good squat posture!");
        line(A, C, "green");
      } else {
        setMsg("⬇️ Go lower for better squat!");
        line(A, C, "orange");
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
    };
  }, []);

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-2xl font-semibold mb-2">
        🏋️ AI Posture Correction - Squat
      </h2>
      <p className="text-lg mb-3 text-center">{feedback}</p>

      <div className="relative" style={{ width: 640 }}>
        <video ref={videoRef} style={{ display: "none" }} />
        <canvas ref={canvasRef} style={{ borderRadius: 12 }} />
      </div>
    </div>
  );
};

export default SquatDetector;
