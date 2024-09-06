const jwt = require("jsonwebtoken");
const axios = require("axios"); // You may need to install axios
const os = require("os");
const mongoose = require("mongoose");
const { jwtSecret, charactersString } = require("../config/setting");
const { log } = require("console");

function decodeToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

const FilterOptions = (sort = "updatedAt:desc", page, limit, filter) => {
  var query = {};

  if (filter) {
    const filterObj = JSON.parse(filter);
    // const startwith = generateMatchQuery(filterObj["match"])

    delete filterObj?.["match"];
    delete filterObj?.["startwith"];

    for (const key in filterObj) {
      query[key] = filterObj[key];
    }


  }
  let statusFilter = { status: { $ne: "INACTIVE" } };

  if (query.status != "" && query.status) {
    statusFilter = { ...statusFilter, status: query.status };
  }

  query = { ...query, ...statusFilter };

  removeEmptyKeys(query);
  var sortOptions = {};

  if (sort) {
    const [sortKey, sortOrder] = sort.split(":");
    sortOptions[sortKey] = sortOrder === "desc" ? -1 : 1;
  }

  var skip = 0;

  if (limit) {
    skip = (parseInt(page) - 1) * parseInt(limit);
  }

  const options = {
    skip: (Number(page) - 1) * Number(limit),
    limit: parseInt(limit),
    sort: sortOptions,
  };
  return {
    options: options,
    query: query,
  };
};

const FilterOptionsSearch = (sort = "updatedAt:desc", page, limit, filter) => {
  var query = {};

  if (filter) {
    const filterObj = JSON.parse(filter);
    const currObj = parseAndExtractValues(filterObj, ["categories", "salePrice", "rating", "brandName", "discount", "isAvailable", "tags"])
    const advFilter = generateQuery(currObj)
    const regex = new RegExp(filterObj.search, "i");
    const search = {

      // { title: { $regex: regex } }, // Case-insensitive title match
      // { slug: { $regex: regex } }, // Case-insensitive slug match
      // { brandName: { $regex: regex } }, // Case-insensitive brandName match

    }
    delete filterObj?.["discount"];
    delete filterObj?.["search"];
    for (const key in filterObj) {
      query[key] = filterObj[key];
    }
    let statusFilter = { status: { $ne: "INACTIVE" } };

    if (query.status != "" && query.status) {
      statusFilter = { ...statusFilter, status: query.status };
    }

    query = { ...query, ...statusFilter, ...advFilter, ...search };
    delete query?.["rating"];
    removeEmptyKeys(query);
  }

  var sortOptions = {};

  if (sort) {
    const [sortKey, sortOrder] = sort.split(":");
    sortOptions[sortKey] = sortOrder === "desc" ? -1 : 1;
  }

  var skip = 0;

  if (limit) {
    skip = (parseInt(page) - 1) * parseInt(limit);
  }

  const options = {
    skip: (page - 1) * limit,
    limit: parseInt(limit),
    sort: sortOptions,
  };
  const extra = {
    rating: query.minValue
  }

  delete query?.["minValue"];
  return {
    options: options,
    query: query,
    extra: extra
  };
};






function getAppIdAndEntity(url) {
  const [pathPart] = url.split("?");
  const parts = pathPart.split("/");
  const tableIndex = parts.indexOf("table");
  if (
    tableIndex !== -1 &&
    tableIndex > 0 &&
    tableIndex < parts.length - 1 &&
    parts[tableIndex - 1] &&
    !parts[tableIndex - 1].includes("/") &&
    parts[tableIndex + 1] &&
    !parts[tableIndex + 1].includes("/")
  ) {
    const appId = parts[tableIndex - 1];
    const entity = parts[tableIndex + 1];
    return {
      app_id: appId,
      entity: entity,
    };
  } else {
    // "table" not found or doesn't have exactly one '/' on each side
    return null;
  }
}




async function getLocationInfo(ip) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return {
      ip: response.data.query,
      city: response.data.city,
      region: response.data.regionName,
      country: response.data.country,
      zip: response.data.zip,
    };
  } catch (error) {
    // console.error("Error getting location info:", error);
    return {
      ip: ip,
    };
  }
}

function removeEmptyKeys(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (value === null || value === undefined || value === "") {
        delete obj[key];
      }
    }
  }
}

const generateMatchQuery = (query) => {
  const dynamicQuery = {};
  Object.keys(query).forEach((key) => {
    // Use RegExp only if the property exists in the query
    if (query[key]) {
      dynamicQuery[key] = new RegExp(query[key], "i");
    }
  });
  return dynamicQuery;
};

function generateRandomString(length) {
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersString.length);
    result += charactersString.charAt(randomIndex);
  }

  return result;
}

async function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  let ipAddress, IPv4, IPv6;

  // Iterate over network interfaces
  Object.keys(interfaces).forEach((interfaceName) => {
    const interfaceInfo = interfaces[interfaceName];

    // Iterate over addresses for the current interface
    interfaceInfo.forEach((address) => {
      if (address.family === "IPv4" && !address.internal) {
        // Found a non-internal IPv4 address
        IPv4 = address.address
      } else if (address.family === 'IPv6' && !address.internal) {
        // Found a non-internal IPv6 address
        IPv6 = address.address
      }
    });
  });

  return { IPv4, IPv6 };
}

function getPublicIpAddress() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api64.ipify.org", // You can use other services like 'api.ipify.org' or 'api.ident.me'
      path: "/?format=json",
      method: "GET",
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const result = JSON.parse(data);
          resolve(result.ip);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}

function parseAndExtractValues(filterObj, keys) {
  const filterObjData = {};
  keys.forEach(key => {
    if (filterObj[key]) {
      filterObjData[key] = Object.values(filterObj[key]);
    }
  });

  return filterObjData;
}

const generateQuery = (filterkeys) => {
  var currObj = {}
  if (filterkeys.salePrice) {
    currObj = {
      ...currObj, salePrice: {
        $gte: Number(filterkeys.salePrice[0]),
        $lte: Number(filterkeys.salePrice[1]),
      }
    }

  }
  if (filterkeys.categories) {
    currObj = {
      ...currObj, categories: filterkeys.categories
    }

  }
  if (filterkeys.brandName) {
    currObj = {
      ...currObj, brandName: filterkeys.brandName
    }

  }
  if (filterkeys.tags) {
    currObj = {
      ...currObj, tags: filterkeys.tags
    }

  }
  if (filterkeys.isAvailable) {
    currObj = {
      ...currObj, isAvailable: filterkeys.isAvailable
    }
  }
  // if (filterkeys.rating) {
  //   const numberArray = filterkeys.rating.map(Number);
  //   const minValue = Math.max(...numberArray);

  //   currObj = {
  //     ...currObj, "reviews": { $exists: true, $not: { $size: 0 } }, minValue
  //   }

  // }
  if (filterkeys.discount) {
    const numberArray = filterkeys.discount.map(Number);
    const minValue = Math.min(...numberArray);
    currObj = {
      ...currObj,
      $expr: {
        $gte: [
          { $multiply: [100, { $divide: [{ $subtract: ['$price', '$salePrice'] }, '$price'] }] },
          minValue
        ]
      }
    },
    {
      $expr: {
        $lte: [
          { $multiply: [100, { $divide: [{ $subtract: ['$price', '$salePrice'] }, '$price'] }] },
          100
        ]
      }

    }
  }



  return currObj
}


module.exports = {
  decodeToken,
  FilterOptions,
  getLocationInfo,
  removeEmptyKeys,
  FilterOptionsSearch,
  generateRandomString,
  getLocalIpAddress,
  getPublicIpAddress, getAppIdAndEntity
};
