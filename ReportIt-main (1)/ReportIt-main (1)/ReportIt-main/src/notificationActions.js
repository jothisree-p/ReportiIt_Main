import { fetchMyNotifications } from "./api/notifications";

export const openNotifications = async (
  isOpen,
  setIsOpen,
  setNotifications
) => {
  const nextOpen = !isOpen;
  setIsOpen(nextOpen);

  if (!nextOpen) {
    return;
  }

  try {
    const data = await fetchMyNotifications();
    setNotifications(data);
  } catch {
    setNotifications([]);
  }
};
