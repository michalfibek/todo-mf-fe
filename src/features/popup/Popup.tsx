import { hidePopup } from "./popupSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import type { RootState } from "../../app/store";
import { useEffect } from "react";

export const Popup = ({ popupTimeout = 5000 }) => {
  const { message, type, visible } = useAppSelector(
    (state: RootState) => state.popup,
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (popupTimeout && visible) {
      const timer = setTimeout(() => {
        dispatch(hidePopup());
      }, popupTimeout);

      return () => clearTimeout(timer);
    }
  }, [visible, dispatch, popupTimeout]);

  if (!visible) return null;

  const handleClose = () => {
    dispatch(hidePopup());
  };

  const popupTypeClass =
    type === "error"
      ? "bg-red-500"
      : type === "success"
        ? "bg-green-500"
        : "bg-blue-500";

  return (
    <div
      className={`fixed top-2 left-1/2 transform -translate-x-1/2 text-white px-5 py-2.5 rounded-lg z-[1000] shadow-lg cursor-pointer bg-opacity-90 ${popupTypeClass}`}
      style={{ animation: "fadeIn 0.3s ease" }}
      onClick={handleClose}
    >
      {message}
    </div>
  );
};
