const jwt = require("jsonwebtoken");
const axios = require("axios"); // You may need to install axios
const os = require("os");

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
    skip: (page - 1) * limit,
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
    //  const advance= advanceQueryHandling(filter)
    // const startwith = generateMatchQuery(filterObj["match"])

    const advFilter = generateQuery(currObj)
    delete filterObj?.["match"];
    delete filterObj?.["startwith"];

    for (const key in filterObj) {
      query[key] = filterObj[key];
    }
    let statusFilter = { status: { $ne: "INACTIVE" } };

    if (query.status != "" && query.status) {
      statusFilter = { ...statusFilter, status: query.status };
    }

    query = { ...query, ...statusFilter, ...advFilter };

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
  return {
    options: options,
    query: query,
  };
};




const advanceQueryHandling = (filter) => {
  var query = {};

  if (filter) {
    const filterObj = JSON.parse(filter);

    const Obj = parseAndExtractValues(filterObj, ["categories", "salePrice", "rating", "brandName", "discount", "isAvailable", "tags"])
    for (const key in filterObj) {
      query[key] = filterObj[key];
    }

    let statusFilter = { status: { $ne: "INACTIVE" } };

    if (query.status != "" && query.status) {
      statusFilter = { ...statusFilter, status: query.status };
    }

    query = { ...query, ...statusFilter };

    removeEmptyKeys(query);
  }


  return {

    query: query,
  };
};








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
    console.error("Error getting location info:", error);
    return {};
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
  getPublicIpAddress, advanceQueryHandling
};
