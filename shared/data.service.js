import * as axios from "axios";
import { API } from "./config";
import { regions, roles } from "../shared/constants";
import { mathLib } from "../shared/math.lib";
import { ParseService } from "../shared/services/parse-service";

const parseService = new ParseService();

const getNewOrder = async function(order) {
  if (order == null) {
    console.log("order is null");
    return [];
  }
  
  order.orderDetails.map((_order, i) => {
    // ftiaxnw ta property tou order
    if (_order.quantity > 0) {
      order.orderDetailsInfo.push({
        quantity: parseInt(_order.quantity, 10),
        productType: _order.productType,
      });
    } else {
      console.log(`no product for ${_order.productType} at ${i}`);
    }
  });

  const orderMut = {
    publicEntityCode: order.publicEntityCode,
    recipientLastName: order.recipientLastName,
    recipientFirstName: order.recipientFirstName,
    orderDetails: order.orderDetailsInfo,
    mobile: order.mobile,
    regionalUnitId: order.regionalUnitId,
    city: order.city,
    postalCode: order.postalCode,
    address: order.address,
    addressNo: parseInt(order.addressNo, 10),
    floor: order.floor,
    lot: order.lot,
    comments: order.comments,
  };

  try {
    const response = await axios.post(
      `${API}/PublicEntities/orders/`,
      orderMut,
    );

    return order;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getPublicEntities = async function(filter) {
  try {
    const urlParams = mathLib.xwwwfurlenc(filter);
    const response = await axios.get(`${API}/PublicEntities?${urlParams}`);
    const publicEntities = parseService.parseList(response);
    return publicEntities;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getRegions = async function() {
  try {
    return regions;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getUserRoles = async function() {
  try {
    return roles;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getNewUser = async function(user) {
  if (user == null) {
    console.log("user is null");
    return [];
  }
  
 const userMut = {
    firstName: user.firstName,
    lastName: user.lastName,
    mobile: user.mobile,
    tel1: user.telephone,
    email: user.email,
    userName: user.username,
    pwd: user.password,
    userRoleId: user.userRoleId,
    isActive: user.isActive,
    comments: user.comments,
  };

  try {
    const response = await axios.post(
      `${API}/users/`,
      userMut,
    );

    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};


const getNewPassword = async function(password) {
  if (password == null) {
    console.log("password is null");
    return [];
  }
  
 const passwordMut = {
    userName: password.username,
    newPassword: password.newPassword,
    oldPassword: password.oldPassword,
  };

  try {
    const response = await axios.post(
      `${API}/users/passwordChange/`,
      passwordMut,
    );

    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};



export const dataService = {
  getRegions,
  getNewOrder,
  getPublicEntities,
  getUserRoles,
  getNewUser,
  getNewPassword,
};
