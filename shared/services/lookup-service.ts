import axios, { AxiosRequestConfig, AxiosPromise } from "axios";
import { API } from "../config";
import { ParseService } from "./parse-service";

export class LookUpService {
  parseService: ParseService = new ParseService();

  public async lookup(key: string): Promise<any> {
    let response: [] | null = null;
    try {
      response = await axios.get(`${API}/lookups/${key}/`);
      const results: [] | any = this.parseService.parseResponse(response);
      return results;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
