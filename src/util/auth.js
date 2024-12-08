export const getAuthUserId = () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    return null;
  }

  return userId;
};
