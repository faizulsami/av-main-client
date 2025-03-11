/* eslint-disable @typescript-eslint/no-explicit-any */
// export interface CallInvitation {
//   // caller: string;
//   // callee: string;
//   roomId: string;
//   from: string;
//   to: string;
//   type: "video" | "audio";
//   signal?: any;
// }
import { Instance } from "simple-peer";

export interface CallParticipant {
  username: string;
  role: "mentor" | "mentee";
}

export interface CallInvitation {
  signal: Instance;
  receiverUsername: string;
  callerSocketId: string;
}
