import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as posedetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/pose";

export const usePoseEngine = (processPosesCallback) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const feedbackRef = useRef(null);
  const isSwitchingRef = useRef(false);
  const [facingMode, setFacingMode] = useState("user");

  // Keep callback fresh without triggering re-renders or re-initializations
  const callbackRef = useRef(processPosesCallback);
  useEffect(() => {
    callbackRef.current = processPosesCallback;
  }, [processPosesCallback]);

  const setMsg = (msg) => {
    if (feedbackRef.current) {
      feedbackRef.current.innerText = msg;
    }
  };

  const toggleCamera = async () => {
    isSwitchingRef.current = true;
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newMode },
        audio: false,
      });
      videoRef.current.srcObject = stream;
      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().then(resolve).catch(resolve);
        };
      });
      if (canvasRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth || 640;
        canvasRef.current.height = videoRef.current.videoHeight || 480;
      }
      setTimeout(() => {
        isSwitchingRef.current = false;
      }, 500);
    } catch (err) {
      console.error("Error switching camera:", err);
      isSwitchingRef.current = false;
    }
  };

  useEffect(() => {
    let detector = null;
    let rafId = null;
    let running = true;

    const setupVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      if (canvasRef.current && videoRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth || 640;
        canvasRef.current.height = videoRef.current.videoHeight || 480;
      }
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

    const frameLoop = async () => {
      if (!running) return;
      if (isSwitchingRef.current) {
        rafId = requestAnimationFrame(frameLoop);
        return;
      }
      try {
        if (videoRef.current && videoRef.current.readyState >= 2 && detector) {
          const poses = await detector.estimatePoses(videoRef.current);
          if (canvasRef.current && videoRef.current && callbackRef.current) {
             callbackRef.current(poses, canvasRef.current, videoRef.current, setMsg);
          }
        }
      } catch (err) {
        console.error("Pose detection error:", err);
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
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  return { videoRef, canvasRef, feedbackRef, toggleCamera };
};
