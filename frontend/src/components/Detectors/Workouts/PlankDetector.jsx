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

const PlankDetector = () => {
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
      "left_hip",
      "right_hip",
      "left_knee",
      "right_knee",
      "left_ankle",
      "right_ankle",
    ];

    drawKeypoints(ctx, points, relevantKeypoints, w, "#00ffff", 5, true);

    const leftSide = ["left_shoulder", "left_hip", "left_ankle"];
    const rightSide = ["right_shoulder", "right_hip", "right_ankle"];

    let useSide = null;
    if (points["left_shoulder"] && points["left_hip"] && points["left_ankle"]) {
      useSide = leftSide;
    } else if (
      points["right_shoulder"] &&
      points["right_hip"] &&
      points["right_ankle"]
    ) {
      useSide = rightSide;
    }

    if (!useSide) {
      setMsg("⚠️ Full body not visible");
      return;
    }

    const [shoulder, hip, ankle] = useSide.map((k) => points[k]);
    const hipAngle = calcAngle(shoulder, hip, ankle);

    let spineColor = "#ffea00"; // neon yellow
    let statusMsg = "";

    if (hipAngle > 165) {
      spineColor = "#39ff14"; // neon green
      statusMsg = "✅ Perfect Plank!";
      speak("Perfect", lastSpokenTime);
    } else if (hipAngle < 140) {
      if (hip.y < shoulder.y && hip.y < ankle.y) {
        spineColor = "#ff003c"; // neon red
        statusMsg = "⚠️ Hips too high!";
        speak("Hips too high", lastSpokenTime);
      } else {
        spineColor = "#ff9a00"; // neon orange
        statusMsg = "⚠️ Hips sagging / straighten up!";
        speak("Hips sagging", lastSpokenTime);
      }
    } else {
      spineColor = "#ffea00"; // neon yellow
      statusMsg = "⏸ Align your body straight";
    }

    setMsg(statusMsg);

    drawLine(ctx, shoulder, hip, w, spineColor, 4, true);
    drawLine(ctx, hip, ankle, w, spineColor, 4, true);

    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText(`Hip Angle: ${Math.round(hipAngle)}°`, 10, 24);
  };

  const { videoRef, canvasRef, feedbackRef, toggleCamera } =
    usePoseEngine(processPoses);

  return (
    <DetectorLayout
      title="🧘 AI Plank Detector"
      referenceVideoSrc="/plank_side.mp4"
      proTips={[
        "Keep body in a straight line from head to heels.",
        "Engage your core and glutes.",
        "Keep elbows directly under shoulders (if forearm plank).",
      ]}
      onToggleCamera={toggleCamera}
      videoRef={videoRef}
      canvasRef={canvasRef}
      feedbackRef={feedbackRef}
    />
  );
};

export default PlankDetector;
