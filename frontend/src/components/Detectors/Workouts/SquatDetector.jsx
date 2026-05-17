import React, { useRef } from "react";
import DetectorLayout from "../DetectorLayout";
import { usePoseEngine } from "../../../hooks/usePoseEngine";
import {
  calcAngle,
  kpToPixel,
  drawLine,
  drawKeypoints,
  speak,
} from "../../../utils/poseUtils";

const SquatDetector = () => {
  const lastSpokenTime = useRef(0);

  const calcTorsoLean = (shoulder, hip) => {
    const dx = shoulder.x - hip.x;
    const dy = hip.y - shoulder.y;
    const angle = Math.atan2(Math.abs(dx), Math.abs(dy)) * (180 / Math.PI);
    return angle;
  };

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

    if (!poses || !poses.length || !poses[0].keypoints) return;

    const points = {};
    poses[0].keypoints.forEach((kp) => {
      const p = kpToPixel(kp, w, h);
      if (p && p.score > 0.35) points[kp.name] = p;
    });

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

    drawKeypoints(ctx, points, relevantKeypoints, w, "#00ffff", 5, true);

    const shoulder = points["left_shoulder"] || points["right_shoulder"];
    const hip = points["left_hip"] || points["right_hip"];
    if (shoulder && hip) {
      const torsoAngle = calcTorsoLean(shoulder, hip);
      let torsoFeedback = "";

      if (torsoAngle > 35) {
        torsoFeedback = `⚠️ Leaning too far (${Math.round(torsoAngle)}°)`;
        drawLine(ctx, shoulder, hip, w, "#ff003c", 4, true);
        speak("Lift your chest", lastSpokenTime);
      } else if (torsoAngle > 20) {
        torsoFeedback = `⚠️ Slight lean (${Math.round(torsoAngle)}°)`;
        drawLine(ctx, shoulder, hip, w, "#ff9a00", 4, true);
      } else {
        torsoFeedback = `✅ Good posture (${Math.round(torsoAngle)}°)`;
        drawLine(ctx, shoulder, hip, w, "#00ffff", 4, true);
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
      drawLine(ctx, A, C, w, "#ff003c", 4, true);
    } else if (angle >= 65 && angle <= 100) {
      setMsg("✅ Good squat posture!");
      drawLine(ctx, A, C, w, "#39ff14", 4, true);
      speak("Good", lastSpokenTime);
    } else {
      setMsg("⬇️ Go lower for better squat!");
      drawLine(ctx, A, C, w, "#ff9a00", 4, true);
      speak("Go lower", lastSpokenTime);
    }
  };

  const { videoRef, canvasRef, feedbackRef, toggleCamera } =
    usePoseEngine(processPoses);

  return (
    <DetectorLayout
      title="🏋️ AI Posture Correction - Squat"
      referenceVideoSrc="/squat_front.jpeg"
      proTips={[
        "Keep your back straight and chest up.",
        "Lower hips until thighs are parallel to the floor.",
        "Ensure knees don't cave inward.",
      ]}
      onToggleCamera={toggleCamera}
      videoRef={videoRef}
      canvasRef={canvasRef}
      feedbackRef={feedbackRef}
    />
  );
};

export default SquatDetector;
