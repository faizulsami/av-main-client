export const getAvatarUrl = (gender: string) => {
  const genderType = gender?.toLowerCase();
  if (genderType === "male") {
    return `/images/avatar/male-avatar.png`;
  } else if (genderType === "female") {
    return `/images/avatar/female-avatar.jpg`;
  }
};
