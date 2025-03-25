export const getAvatarUrl = (gender: string) => {
  const genderType = gender?.toLowerCase();
  if (genderType === "male") {
    return `/images/avatar/man.png`;
  } else if (genderType === "female") {
    return `/images/avatar/woman.png`;
  }
};
