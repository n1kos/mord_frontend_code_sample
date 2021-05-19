import * as data from "./el";

const words: {} | any = data.t();

// tranlisterates a keyword to the string that matches. Takes an optional argument to create
// more meaningful results
const t: string | any = (key: string, type: string) => {
  if (!words().messages[key]) {
    return `please add "${key}" : "DEFINITION", to your lang.json`;
  } else {
    let construct: string = "";
    switch (type) {
      // output is question
      case "q":
        construct = words().messages[key] + ";";
        break;
      case "l":
        // leading whitespace
        construct = " " + words().messages[key];
        break;
      case "t":
        // trailing whitespace
        construct = words().messages[key] + " ";
        break;
      case "s":
        // leading and following, both sides
        construct = " " + words().messages[key] + " ";
        break;
      default:
        construct = words().messages[key];
        break;
    }
    return construct;
  }
};

// you may have a variable named X and a transliteration key KeyX.
// in order to avoid duplication in the lang file, this function
// produces the key based on the provided pattern
const p: string | any = (key: string, qualifier: string) => {
  return qualifier + key.charAt(0).toUpperCase() + key.slice(1);
};

export const langService: { t: any; p: any } = {
  t,
  p,
};
