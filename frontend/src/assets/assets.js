import logo from "./logooo.svg";
import header_img from "./header_img.png";
import p3 from "./p3.png";
import p1 from "./p1.png";
import p2 from "./p2.png";
import p4 from "./p4.png";
import pushup from "./pushup.svg";
import squat from "./squats-2.svg";
import planks from "./plankss.svg";
import biceps from "./biceps.svg";

export const assets = {
  logo,
  header_img,
  p1,
  p2,
  p3,
  p4,
};
export const workouts = [
  {
    _id: "w1",
    name: "Pushup",
    icon: pushup,
    about:
      "Builds chest, shoulders, arms, and core strength. Essential for upper body power and endurance",
  },
  {
    _id: "w2",
    name: "Squat",
    icon: squat,
    about:
      "Targets legs and glutes. Builds lower body strength and improves mobility",
  },
  {
    _id: "w3",
    name: "Planks",
    icon: planks,
    about: "Strengthens core muscles. Improves posture and stability",
  },
  {
    _id: "w4",
    name: "Bicep Curls",
    icon: biceps,
    about: "Isolates arm muscles. Builds bicep strength and definition",
  },
];
