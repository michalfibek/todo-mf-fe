import type { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";

type PopupState = {
  message: string | null;
  type: "error" | "success" | "info";
  visible: boolean;
};

const initialState: PopupState = {
  message: null,
  type: "info",
  visible: false,
};

export const popupSlice = createAppSlice({
  name: "popup",
  initialState,
  reducers: {
    showPopup: (
      state,
      action: PayloadAction<{
        message: string;
        type?: "error" | "success" | "info";
      }>,
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type || "info";
      state.visible = true;
    },
    hidePopup: state => {
      state.message = null;
      state.type = "info";
      state.visible = false;
    },
  },
});

export const { showPopup, hidePopup } = popupSlice.actions;

export default popupSlice.reducer;
