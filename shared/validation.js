import {
  extend
} from "vee-validate";
import {
  langService as t
} from "./lang.service";

extend("onlyGreekCaps", {
  validate: value => value.toString().match(/^[ ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ]+$/u),
  message: t.t("onlyGreekCaps"),
});

extend("onlyGreekTitleCaps", {
  validate: value => value.toString().match(/^[ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ]+$/u),
  message: t.t("onlyGreekTitleCaps"),
});

extend("onlyGreekCapsSomePunctuation", {
  validate: value =>
    value.toString().match(/^[ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ .0-9-]+$/u),
  message: t.t("onlyGreekCapsSomePunctuation"),
});

extend("onlyGreekMobile", {
  validate: value => value.match(/^69\d+/),
  message: t.t("onlyGreekMobile"),
});

extend("onlyGreekCapsSpaceNumber", {
  validate: value =>
    value.toString().match(/^[ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ 0-9]+$/u),
  message: t.t("onlyGreekCapsSpaceNumber"),
});

/* 
extend("onlyGreekLatinTitleCaps", {
  validate: value =>
    value
    .toString()
    .match(/^[ABCDEFGHIJKLMNOPQRSTUVWXYZΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ]+$/u),
  message: t.t("onlyGreekLatinTitleCaps"),
});
*/

extend("onlyGreekLatinCaps", {
  validate: value =>
    value
    .toString()
    .match(/^[ ABCDEFGHIJKLMNOPQRSTUVWXYZΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ]+$/u),
  message: t.t("onlyGreekLatinCaps"),
});

extend("onlyLatinAlphaNumCaps", {
  validate: value =>
    value
    .toString()
    .match(/^[a-z0-9]+$/u),
  message: t.t("onlyLatinAlphaNumCaps"),
});


extend("onlyGreekLatinCapsSomePunctuation", {
  validate: value =>
    value
    .toString()
    .match(/^[ABCDEFGHIJKLMNOPQRSTUVWXYZΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ .0-9-]+$/u),
  message: t.t("onlyGreekLatinCapsSomePunctuation"),
});

extend("onlyGreekTitleCapsNumbers", {
  validate: value =>
    value.toString().match(/^[ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ 0-9]+$/u),
  message: t.t("onlyGreekTitleCapsNumbers"),
});

// check the 4 packets (passing 2nd param to the rule, the sum of the packets)
// swsto sta multiple validations
extend("onlyAllowedProducts", {
  validate: function (packet, sumPackets) {
    return sumPackets > 0 && packet <= 100
  },
  message: t.t("onlyAllowedProducts"),
});
