import React, { useRef, useState } from "react";
import DetectorLayout from "../DetectorLayout";
import { usePoseEngine } from "../../../hooks/usePoseEngine";
import {
  calcAngle,
  kpToPixel,
  drawLine,
  drawKeypoints,
  speak,
} from "../../../utils/poseUtils";

const BicepsDetector = () => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const stageRef = useRef(null);
  const lastSpokenTime = useRef(0);

  const processPoses = (poses, canvas, video, setMsg) => {
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-w, 0);
    ctx.drawImage(video, 0, 0, w, h);
    ctx.restore();

    if (!poses?.length || !poses[0].keypoints) return;

    const points = {};
    poses[0].keypoints.forEach((kp) => {
      const p = kpToPixel(kp, w, h);
      if (p && p.score > 0.35) points[kp.name] = p;
    });

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

    drawKeypoints(ctx, points, relevantKeypoints, w, "#00ffff", 5, true);

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

    const shoulderHipDistX = Math.abs(shoulder.x - hip.x);
    const isShoulderStable = shoulderHipDistX < torsoH * 0.15;

    let color = "#ffea00"; // neon yellow
    let status = "Active";

    if (!isElbowPinned) {
      status = "⚠️ Pin elbow to side!";
      color = "#ff003c"; // neon red
      drawLine(ctx, elbow, hip, w, "#ff003c", 4, true);
      speak("Keep elbow pinned", lastSpokenTime);
    } else if (!isBodyStable) {
      status = "⚠️ Don't swing hips!";
      color = "#ff9a00"; // neon orange
      drawLine(ctx, hip, knee, w, "#ff9a00", 4, true);
      speak("Don't swing hips", lastSpokenTime);
    } else if (!isShoulderStable) {
      status = "⚠️ Keep shoulders steady!";
      color = "#ff003c"; // neon red
      drawLine(ctx, shoulder, hip, w, "#ff003c", 4, true);
      speak("Keep shoulders steady", lastSpokenTime);
    } else {
      if (armAngle > 140) {
        stageRef.current = "DOWN";
        color = "#ffffff"; // bright white
        status = "💪 Curl Up!";
      } else if (armAngle < 90 && stageRef.current === "DOWN") {
        stageRef.current = "UP";
        countRef.current += 1;
        setCount(countRef.current);
        status = "⬇️ Lower Down";
        color = "#39ff14"; // neon green
        speak("Good", lastSpokenTime);
      } else {
        status = stageRef.current === "UP" ? "⬇️ Lower Down" : "💪 Curl Up";
        color = "#39ff14"; // neon green
      }
    }

    setMsg(status);

    drawLine(ctx, shoulder, elbow, w, color, 4, true);
    drawLine(ctx, elbow, wrist, w, color, 4, true);
    drawLine(ctx, shoulder, hip, w, "#00ffff", 4, true);
    drawLine(ctx, hip, knee, w, isBodyStable ? "#00ffff" : "#ff9a00", 4, true);

    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText(`Reps: ${countRef.current}`, 10, 48);
    ctx.fillText(`Side: ${side.toUpperCase()}`, 10, 72);
  };

  const { videoRef, canvasRef, feedbackRef, toggleCamera } =
    usePoseEngine(processPoses);

  const extraUi = (
    <span className="text-sm hidden px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
      Reps: {count}
    </span>
  );

  return (
    <DetectorLayout
      title="💪 AI Bicep Curls (Side View)"
      referenceVideoSrc="https://res.cloudinary.com/dreocrqpa/video/upload/f_auto,q_auto/v1779028850/biceps_side_htwiat.mp4"
      proTips={[
        "Stand sideways to the camera.",
        "Keep elbow pinned to your hip.",
        "Stand straight, do not swing your hips.",
      ]}
      onToggleCamera={toggleCamera}
      videoRef={videoRef}
      canvasRef={canvasRef}
      feedbackRef={feedbackRef}
      extraUi={extraUi}
    />
  );
};

export default BicepsDetector;
