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

const PushUpDetector = () => {
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
      "left_ankle",
      "right_ankle",
    ];

    drawKeypoints(ctx, points, relevantKeypoints, w, "#00ffff", 5, true);

    const shoulder = points["left_shoulder"] || points["right_shoulder"];
    const elbow = points["left_elbow"] || points["right_elbow"];
    const wrist = points["left_wrist"] || points["right_wrist"];
    const hip = points["left_hip"] || points["right_hip"];
    const knee = points["left_knee"] || points["right_knee"];
    const ankle = points["left_ankle"] || points["right_ankle"];

    const bodyAngle = calcAngle(shoulder, hip, ankle);

    let hipFeedback = "";
    if (shoulder && hip && ankle) {
      if (bodyAngle < 140) {
        if (hip.y < shoulder.y && hip.y < ankle.y) {
          hipFeedback = "⚠️ Hips too high!";
          speak("Hips too high", lastSpokenTime);
        } else {
          hipFeedback = "⚠️ Hips sagging!";
          speak("Hips sagging", lastSpokenTime);
        }
      }
    }

    let statusMsg = "Active";
    let spineColor = "#00ffff"; // cyan

    if (hipFeedback) {
      spineColor = "#ff003c"; // neon red
      statusMsg = hipFeedback;
    } else if (bodyAngle > 165) {
      spineColor = "#39ff14"; // neon green
      statusMsg = "✅ Good Form";
    } else {
      spineColor = "#ffea00"; // neon yellow
      statusMsg = "Active";
    }

    setMsg(statusMsg);

    if (shoulder && elbow) drawLine(ctx, shoulder, elbow, w, "#ffffff", 4, true);
    if (elbow && wrist) drawLine(ctx, elbow, wrist, w, "#ffffff", 4, true);
    if (shoulder && hip) drawLine(ctx, shoulder, hip, w, spineColor, 4, true);
    if (hip && knee) drawLine(ctx, hip, knee, w, spineColor, 4, true);
    if (knee && ankle) drawLine(ctx, knee, ankle, w, spineColor, 4, true);

    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    if (bodyAngle)
      ctx.fillText(`Body Angle: ${Math.round(bodyAngle)}°`, 10, 24);
    if (hipFeedback) ctx.fillText(hipFeedback, 10, 48);
  };

  const { videoRef, canvasRef, feedbackRef, toggleCamera } =
    usePoseEngine(processPoses);

  return (
    <DetectorLayout
      title="🤸 AI Push-Up Detector"
      referenceVideoSrc="https://res.cloudinary.com/dreocrqpa/video/upload/f_auto,q_auto/v1779028849/pushup_side_w8cbtm.mp4"
      proTips={[
        "Keep your body in a straight line (head to heels).",
        "Lower chest until elbows are at 90 degrees.",
        "Don't let hips sag or peak too high.",
      ]}
      onToggleCamera={toggleCamera}
      videoRef={videoRef}
      canvasRef={canvasRef}
      feedbackRef={feedbackRef}
    />
  );
};

export default PushUpDetector;
