/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CallInvitation {
  // caller: string;
  // callee: string;
  roomId: string;
  from: string;
  to: string;
  type: "video" | "audio";
  signal: any;
}

export interface CallParticipant {
  username: string;
  role: "mentor" | "mentee";
}
