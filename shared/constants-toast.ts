const superToastDefAnimate: object = { in: "fadeIn", out: "fadeOut" };

import { langService as t } from "./lang.service";
import { ToastType } from "vue-toasted";

export const superOk: ToastType | object = {
  message: t.t("saveOk"),
  type: "is-success",
  dismissible: true,
  animate: superToastDefAnimate,
  duration: 2500,
  position: "bottom-right",
};

export const superNotOk: ToastType | object = {
  message: t.t("saveNotOk"),
  type: "is-danger",
  dismissible: true,
  pauseOnHover: true,
  closeOnClick: true,
  animate: superToastDefAnimate,
  duration: 4500,
  position: "center",
};

export const superRequestOk: ToastType | object = {
  message: t.t("requestsFinalOk"),
  type: "is-success",
  dismissible: true,
  animate: superToastDefAnimate,
  duration: 2500,
  position: "bottom-right",
};

export const superRequestNotOk: ToastType | object = {
  message: t.t("requestsFinalFail"),
  type: "is-danger",
  dismissible: true,
  pauseOnHover: true,
  closeOnClick: true,
  animate: superToastDefAnimate,
  duration: 4500,
  position: "center",
};

export const superFileCreatedOk: ToastType | object = {
  message: t.t("fileCreatedOk"),
  type: "is-success",
  dismissible: true,
  animate: superToastDefAnimate,
  duration: 2500,
  position: "bottom-right",
};

export const superFileCreatedNotOk: ToastType | object = {
  message: t.t("fileCreatedFail"),
  type: "is-danger",
  dismissible: true,
  pauseOnHover: true,
  closeOnClick: true,
  animate: superToastDefAnimate,
  duration: 4500,
  position: "center",
};
