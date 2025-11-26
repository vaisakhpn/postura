import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as posedetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/pose";

const PushUpDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [feedback, setFeedback] = useState("Initializing camera...");
  const debug = false;

  useEffect(() => {
    let detector = null;
    let rafId = null;
    let running = true;

    const setMsg = (msg) => {
      if (debug) console.log("[PushUpDetector]", msg);
      setFeedback(msg);
    };

    // 🎥 Setup Camera
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

    // ⚙️ Initialize Backend + Model
    const initModel = async () => {
      await tf.setBackend("webgl");
      await tf.ready();
      detector = await posedetection.createDetector(
        posedetection.SupportedModels.BlazePose,
        {
          runtime: "mediapipe",
          solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/pose",
          modelType: "lite",
        }
      );
      setMsg("Model loaded!");
    };

    // 📏 Helper Functions
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

      // mirror camera view
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

      const line = (p1, p2, color = "yellow") => {
        if (!p1 || !p2) return;
        ctx.beginPath();
        ctx.moveTo(w - p1.x, p1.y);
        ctx.lineTo(w - p2.x, p2.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
      };

      // draw all keypoints
      ctx.fillStyle = "lime";
      Object.values(points).forEach((p) => {
        ctx.beginPath();
        ctx.arc(w - p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // === ELBOW ANGLE DETECTION ===
      const useArm =
        points["left_shoulder"] && points["left_elbow"] && points["left_wrist"]
          ? ["left_shoulder", "left_elbow", "left_wrist"]
          : points["right_shoulder"] &&
            points["right_elbow"] &&
            points["right_wrist"]
          ? ["right_shoulder", "right_elbow", "right_wrist"]
          : null;
      if (!useArm) return;
      const [A, B, C] = useArm.map((k) => points[k]);
      const elbowAngle = calcAngle(A, B, C);

      // === SPINE ALIGNMENT ===
      const shoulder = points["left_shoulder"] || points["right_shoulder"];
      const hip = points["left_hip"] || points["right_hip"];
      const knee = points["left_knee"] || points["right_knee"];
      const spineAngle = calcAngle(shoulder, hip, knee);

      // === HIP SAGGING / HIGH CHECK ===
      let hipFeedback = "";
      if (shoulder && hip) {
        const diffY = hip.y - shoulder.y;
        if (diffY < -20) hipFeedback = "⚠️ Hips too high!";
        else if (diffY > 120) hipFeedback = "⚠️ Hips sagging!";
      }

      // === COLOR SELECTION LOGIC ===
      let armColor = "yellow";
      let spineColor = "cyan";

      if (elbowAngle > 160 && spineAngle > 150 && !hipFeedback) {
        armColor = "green";
        spineColor = "green";
        setMsg("✅ Top position – straight body, full extension!");
      } else if (elbowAngle < 90) {
        armColor = "red";
        spineColor = "orange";
        setMsg("⬇️ Lower down – chest closer to floor!");
      } else if (hipFeedback) {
        armColor = "orange";
        spineColor = "red";
        setMsg(hipFeedback);
      } else {
        armColor = "orange";
        spineColor = "yellow";
        setMsg("⏸ Mid-range – keep spine neutral!");
      }

      // === DRAW LINES WITH COLOR FEEDBACK ===
      line(A, B, armColor);
      line(B, C, armColor);
      line(shoulder, hip, spineColor);
      line(hip, knee, spineColor);

      // === DISPLAY ANGLES ===
      ctx.fillStyle = "white";
      ctx.font = "18px Arial";
      ctx.fillText(`Elbow: ${Math.round(elbowAngle)}°`, 10, 24);
      if (spineAngle) ctx.fillText(`Spine: ${Math.round(spineAngle)}°`, 10, 48);
      if (hipFeedback) ctx.fillText(hipFeedback, 10, 72);
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
    };
  }, []);

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-2xl font-semibold mb-2">🤸 AI Push-Up Detector</h2>
      <p className="text-lg mb-3 text-center">{feedback}</p>

      <div className="relative" style={{ width: 640 }}>
        <video ref={videoRef} style={{ display: "none" }} />
        <canvas ref={canvasRef} style={{ borderRadius: 12 }} />
      </div>
    </div>
  );
};

export default PushUpDetector;
