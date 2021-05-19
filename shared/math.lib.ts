import { el } from "date-fns/locale";
import { displayDateFormat } from "../shared/constants";
import { format, parseISO } from "date-fns";
import { langService as t } from "../shared/lang.service";

// @ts-ignore //noimplany
export const getRandomInt: number | any = (min = 0, max = 0): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; // the maximum is exclusive and the minimum is inclusive
};

// for key/value pair enums, where left side is name and right side is id, returns an array of objects of the form {id:, name:}
// @ts-ignore //noimplany
export const mapEnum: object = (obj = {}): object => {
  return (
    Object.keys(obj)
      // @ts-ignore //noimplany
      .filter(key => !isNaN(Number(obj[key])))
      // @ts-ignore //noimplany
      .map(key => ({ id: obj[key], name: key }))
  );
};

// for single member enums, returns the keys
// @ts-ignore //noimplany
export const mapEnumList: object = (obj: object) => {
  // @ts-ignore //noimplany
  return Object.keys(obj).filter(key => !isNaN(Number(obj[key])));
};

// @ts-ignore
export const capitalizeWords: string = (value: string) => {
  return value
    .split(" ")
    .map(function(ele: string): string {
      return ele[0].toUpperCase() + ele.slice(1);
    })
    .join(" ");
};

// @ts-ignore
export const parseDate: string = (givenDate: Date) => {
  if (givenDate == null) {
    return t.t("undefined");
  }
  const formatted: string = format(
    // @ts-ignore
    parseISO(givenDate.toString(), 1),
    displayDateFormat,
    { locale: el },
  );
  const result: string =
    formatted === "Ιαν 01, 0001" ? t.t("undefined") : formatted;
  return result;
};

// @ts-ignore
export const xwwwfurlenc: string = (srcjson: object) => {
  if (typeof srcjson !== "object")
    if (typeof console !== "undefined") {
      console.log('"srcjson" is not a JSON object');
      return null;
    }
  const u = encodeURIComponent;
  var urljson = "";
  var keys = Object.keys(srcjson);
  for (var i = 0; i < keys.length; i++) {
    // console.log(keys);
    // @ts-ignore //npimpl
    const thisEle = srcjson[keys[i]];
    if (Array.isArray(thisEle)) {
      urljson += thisEle
        // @ts-ignore //npimpl
        .map(ele => {
          return u(keys[i]) + "=" + u(ele);
        })
        .join("&");
    } else {
      // @ts-ignore //npimpl
      urljson += u(keys[i]) + "=" + u(srcjson[keys[i]]);
    }
    if (i < keys.length - 1) urljson += "&";
  }
  return urljson;
};

export const mathLib: {} = {
  getRandomInt,
  mapEnum,
  mapEnumList,
  capitalizeWords,
  parseDate,
  xwwwfurlenc,
};
