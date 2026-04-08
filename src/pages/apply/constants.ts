export const INIT = {
  // Step 1 인적사항
  name: "",
  gender: "",
  birthdate: "",
  phone: "",
  sns: "",
  email: "",
  // Step 2 활동 & 소통
  interviewTimes: [],
  mtAvailable: "",
  howKnow: "",
  mainContact: "",
  scaleDesignTool: null,
  mainDesign: "",
  scaleCameraTool: null,
  mainProject: "",
  // Step 3 자기소개
  q1_intro: "",
  q2_motivation: "",
  q3_drink: "",
  q4_contribution: "",
  qEtc: "",
  privacyAgree: false,
};

export const stepVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};
