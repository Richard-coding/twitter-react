export const formatInitials = (username?: string) =>
  username
    ? username
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

export default formatInitials;
