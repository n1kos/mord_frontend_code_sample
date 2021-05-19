export class ParseService {
  checkServerSuccess(response: object) {
    // @ts-ignore
    return response.status < 200 && response.status > 201;
  }

  // @ts-ignore //noimplany
  public parseResponse = response => {
    if (this.checkServerSuccess(response)) {
      throw Error(response.message);
    }
    return response.data;
  };

  // @ts-ignore //noimplany
  public parseItem = (response, code) => {
    if (response.status !== code) throw Error(response.message);
    let item = response.data;
    if (typeof item != "object") {
      item = undefined;
    }
    return item;
  };
  
  // @ts-ignore //noimplany
  parseList = response => {
    if (response.status !== 200) {
      throw Error(response.message);
    }
    if (!response.data) {
      return [];
    }
    let list = response.data;
    if (typeof list !== "object") {
      list = [];
    }
    return list;
  };
}
