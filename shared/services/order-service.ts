import {
  ViewStagedOrderResponse,
  ViewOrderHeadersResponse,
  ViewOrderResult,
} from "./../modeling/model-results";
import axios, { AxiosResponse } from "axios";
import { API } from "../config";
import { ParseService } from "./parse-service";
import { mathLib } from "../math.lib";
import { AccessConfig, HttpVerbs } from "../modeling/model-common";

export class OrderService {
  parseService: ParseService = new ParseService();

  public async hitEndpoint(config: AccessConfig): Promise<any> {
    let response: [] | null = null;
    let urlEndPoint: string = (config.endpoint = `${API}/PublicEntities/${config.endpoint}`);
    let accessFunction: any = null;
    let postParams: {} = {};
    switch (config.accessMethod) {
      // we need tp configure different type of handling, depending on the method.
      // when we "get" we need to make a filter, but when we post we just need to pass
      // the object. we also need to add headers, when needed
      case HttpVerbs.get:
        accessFunction = axios.get;
        if (
          Object.entries(config.params).length > 0 &&
          config.params.constructor === Object
        ) {
          // @ts-ignore
          const urlParams : {} = mathLib.xwwwfurlenc(config.params);
          urlEndPoint += `?${urlParams}`;
        }
        break;
      case HttpVerbs.post:
        accessFunction = axios.post;
        postParams = config.params;
        break;
      case HttpVerbs.put:
        accessFunction = axios.put;
        postParams = config.params;
        break;
      case HttpVerbs.delete:
        accessFunction = axios.delete;
        postParams = {
          headers: { "Content-Type": "application/json" },
          data: config.params,
        };
        break;
      default:
        break;
    }

    try {
      // we need to send params when pust/delete but not when get
      // @ts-ignore
      // prettier-ignore
      response = postParams === {} ? await accessFunction(urlEndPoint) : await accessFunction(urlEndPoint, postParams);
      let result:
        | ViewOrderResult[]
        | ViewStagedOrderResponse
        | ViewOrderHeadersResponse
        | []
        | null;
      // @ts-ignore
      if (response.data && response.data !== "") {
        result = this.parseService.parseResponse(response);
        console.log(result);
        return result;
      } else {
        // @ts-ignore
        return response.statusText;
      }
    } catch (error) {
      // we need to handle errors better. some components expect "null" when an error happened,
      // some expect []. for the moment, i ll see if there is a pattern depending on the accessmethof
      console.error(error);
      return null;
    }
  }
  // to update den exei parse type kai gyrizei [] sto la8os ki einai put kai to notreceive einai put kai den exei parse
  // alla gyrizei null. pffff

  /***
  sends a query request to an api end-point. It is the query part for hitting an api end-point based on the 
  Command Query Separation principle

  @T : generic that represents the type that is sent to the end-point with AccessConfig.params (e.g GetOrderHeadersRequest)
  @R : generic that represents the type that will be returned by the end-point (e.g ViewOrderHeadersResponse)
  @config : the configuration info for accessing the end-point
  ***/
  public async queryEndPoint<T, R>(config: AccessConfig): Promise<R> {
    let urlEndPoint: string = (config.endpoint = `${API}/PublicEntities/${config.endpoint}`);

    // @ts-ignore
    const urlParams : {} = mathLib.xwwwfurlenc(config.params);
    urlEndPoint += `?${urlParams}`;

    // the response from axios is an AxiosResponse<R>. That is an AxiosResponse, that contains
    // the R type we declared as the response of the end-point (e.g AxiosResponse<ViewOrderHeadersResponse>)
    let resp: AxiosResponse<R> = {} as AxiosResponse<R>;

    try {
      resp = await axios.request<T, AxiosResponse<R>>({
        method: HttpVerbs.get, // quering an end-point is a get
        url: urlEndPoint,
      });
    } catch (error) {
      console.error(error);

      throw error;
    } finally {
      // tODO: maybe is not necessary, check it again
      if (resp.status < 200 && resp.status > 201) {
        throw new Error(resp.statusText);
      }
    }

    // return the data part of the AxiosResponse<R> object that is, return the R
    return resp.data;
  }
}
