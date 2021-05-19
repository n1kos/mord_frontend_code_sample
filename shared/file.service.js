import * as axios from "axios";
import { API } from "./config";
import { FileStatus } from "../shared/modeling/model-common";
import { ParseService } from "../shared/services/parse-service";
import { parseDate } from "../shared/math.lib";
import { format, parseISO } from "date-fns";

const parseService = new ParseService();

// To Date() girizei: Wed Jan 01 2020 00:00:00 GMT+0200 (Eastern European Standard Time)
// theloume to format 2020-01-01T00:00:00 ("yyyy-MM-dd HH:mm:ss"),
// opote xrisimopoioume.toISOString()
const date = new Date().toISOString();

const date_string = format(parseISO(date), "yyyy-MM-dd-HHmmss");

const createHrefLink = async function(endpoint, file) {
  //console.log(file);

  if (file) {
    endpoint = `${endpoint}?fileName=${file}`;
  }

  try {
    const response = await axios.get(`${API}/PublicEntities/${endpoint}`, {
      responseType: "blob",
      headers: {
        "content-type": "application/vnd.ms-excel;charset=UTF-8",
      },
    });

    const blob = parseService.parseItem(response, 200);
    console.log(response);

    if (response.headers["content-disposition"]) {
      return {
        blob: blob,
        headers: response.headers,
      };
    } else {
      return blob;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getFiles = async function(endpoint) {
  try {
    const response = await axios.get(`${API}/PublicEntities/${endpoint}`);
    const files = parseService.parseItem(response, 200);
    return files;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getFileStatuses = async function() {
  return FileStatus;
};

const setFileStatus = async function(fileId, fileStatus) {
  const filter = {
    fileId: fileId,
    fileStatus: fileStatus,
  };
  try {
    const response = await axios.put(
      `${API}/PublicEntities/orders/forwards`,
      filter,
    );
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const showExcelFile = function(excelFile, filename) {
  // https://github.com/axios/axios/issues/1660
  const newBlob = new Blob([excelFile], {
    type: "application/vnd.ms-excel",
  });
  const blobUrl = window.URL.createObjectURL(newBlob);
  //const fileName = filename ? filename : "ExportedStatistics" + Date.now();
  let fileName = filename;
  //console.log("filename: " + filename);
  if (filename) {
    if (filename === "MultipleOrdersPlacingTemplate.xls") {
      fileName = filename.replace(
        filename.slice(-4),
        "-" + date_string + filename.slice(-4),
      );
    } //else if (filename.slice(0, 17) === "FinalizedRequests") {
    // fileName = filename;
    //}
  } else {
    //fileName = "ExportedStatistics" + Date.now();
    fileName = "ExportedStatistics" + "-" + date_string;
  }

  //------------------------------

  /*
    if (filename) {
      fileName = filename.replace(
        filename.slice(-4),
        "-" + parseDate(date) + filename.slice(-4),
      );
    } else {
      //fileName = "ExportedStatistics" + Date.now();
      fileName = "ExportedStatistics" + "-" + parseDate(date);
    }
  */

  // @ts-ignore //strict
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blobUrl, fileName); // 兼容ie10
  } else {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = blobUrl;
    a.target = "_blank";
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(blobUrl);
  }
};

export const fileService = {
  createHrefLink,
  getFiles,
  getFileStatuses,
  setFileStatus,
  showExcelFile,
};
