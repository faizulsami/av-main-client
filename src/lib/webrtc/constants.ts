export const SOCKET_EVENTS = {
  // Call signaling
  CALL_INITIATE: "call:initiate",
  CALL_INCOMING: "call:incoming",
  CALL_ACCEPT: "call:accept",
  CALL_REJECT: "call:reject",
  CALL_END: "call:end",

  // WebRTC signaling
  WEBRTC_OFFER: "webrtc:offer",
  WEBRTC_ANSWER: "webrtc:answer",
  WEBRTC_ICE: "webrtc:ice",
} as const;

export const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  {
    urls: `stun:stun.anonymousvoicesav.com`,
  },
  {
    urls: `turn:stun.anonymousvoicesav.com`,
    username: process.env.NEXT_PUBLIC_TURN_SERVER_USERNAME,
    credential: process.env.NEXT_PUBLIC_TURN_SERVER_PASSWORD,
  }
];

export type MediaStreamConstraints = {
  audio?: boolean | MediaTrackConstraints;
  video?: boolean | MediaTrackConstraints;
};
