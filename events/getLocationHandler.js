// // events/getLocationHandler.js
// const jwt = require("jsonwebtoken");
// require("dotenv").config(); // load .env early

// const { PublicAlerts } = require("./helpers/publicAlertsHelper");
// const {
//   loadGeoTiffMaps,
//   getCentegixId,
//   loadCentegixMap,
//   getGeocommData,
//   loadGeoCommMap,
// } = require("./helpers/getLocationHelper");
// const { downloadFileFromS3 } = require("./helpers/s3Helper");

// exports.handler = async function (event, context) {
//   const headers = event.headers || {};
//   console.log("Received headers:", headers);

//   // Normalize header keys to lowercase for consistent access
//   const authHeader = headers.authorization || headers.Authorization;

//   if (!authHeader) {
//     return {
//       statusCode: 401,
//       body: "Unauthorized Access!",
//     };
//   }

//   try {
//     jwt.verify(authHeader.replace("Bearer ", "").trim(), process.env.JWT_SECRET);
//   } catch (err) {
//     console.log(err);
//     return {
//       statusCode: 401,
//       body: "Unauthorized Access!",
//     };
//   }

//   const response = {
//     statusCode: 200,
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ status_code: 200, data: {} }),
//   };

//   try {
//     const params = event.pathParameters || {};
//     const query = event.queryStringParameters || {};

//     const locationID = params.locationID;
//     const type = params.type;

//     if (locationID) {
//       const objController = new PublicAlerts();
//       const objLocation = await objController.loadLocationById(null, null, {
//         locationId: locationID,
//         type: -1,
//       });

//       if (
//         objLocation &&
//         Array.isArray(objLocation.locations) &&
//         objLocation.locations.length > 0 &&
//         objLocation.locations[0]
//       ) {
//         const loc = objLocation.locations[0];

//         const locationResponse = {
//           id: loc.id,
//           name: loc.name,
//           logo: loc.logo,
//           address: loc.address,
//           latitude: loc.latitude,
//           longitude: loc.longitude,
//           polygon: loc.polygon,
//           radius: loc.radius,
//           zoom: loc.zoom,
//         };

//         let responseData = locationResponse;

//         switch (type) {
//           case "1":
//           case 1:
//             // nothing extra
//             break;

//           case "2":
//           case 2: {
//             const geoTiffData = await loadGeoTiffMaps(locationID);
//             if (geoTiffData) responseData.floors = geoTiffData;
//             break;
//           }

//           case "3":
//           case 3: {
//             const centegixId = getCentegixId(locationID);
//             if (centegixId) {
//               const centegixData = await loadCentegixMap(centegixId, locationID);
//               if (centegixData) {
//                 responseData.floors = centegixData.floors;
//                 responseData.assets = centegixData.assets;
//                 responseData.labels = centegixData.labels;
//               }
//             }
//             break;
//           }

//           case "4":
//           case 4:
//             /* ---- original line (unsafe destructure) ----
//             const { gLat, gLng, gRadius } = getGeocommData(locationID);
//             if (gLat && gLng && gRadius) {
//               responseData.site = await loadGeoCommMap(gLat, gLng, gRadius);
//             }
//             ---------------------------------------------- */

//             try {
//               const geoData = getGeocommData(locationID) || {};
//               const { gLat, gLng, gRadius } = geoData;
//               if (gLat && gLng && gRadius) {
//                 responseData.site = await loadGeoCommMap(gLat, gLng, gRadius);
//               }
//             } catch (e) {
//               console.error("Error loading GeoComm data:", e);
//             }
//             break;

//           default: {
//             const url = query.url;
//             if (url) {
//               try {
//                 const { buffer, contentType } = await downloadFileFromS3(url);
//                 if (!buffer || !contentType) throw new Error("Invalid S3 response");

//                 return {
//                   statusCode: 200,
//                   isBase64Encoded: true,
//                   headers: { "Content-Type": contentType },
//                   body: buffer.toString("base64"),
//                 };
//               } catch (error) {
//                 console.error("File not found in S3:", error);
//                 return {
//                   statusCode: 404,
//                   body: JSON.stringify({ error: "File not found in S3" }),
//                 };
//               }
//             }
//             break;
//           }
//         }

//         response.body = JSON.stringify({ status_code: 200, data: responseData });
//       }
//     }
//   } catch (error) {
//     console.error("UNCAUGHT ERROR:", error?.message || error);
//     console.error(error?.stack || "");
//   }

//   /* ---- original return with potential undefined body ---- */
//   // response.body already set in success path; ensure it’s never undefined
//   if (!response.body) {
//     response.body = JSON.stringify({ status_code: 500, message: "Something went wrong" });
//   }
//   return response;
// };


// events/getLocationHandler.js
const jwt = require("jsonwebtoken");
require("dotenv").config(); // load .env early

const { PublicAlerts } = require("./helpers/publicAlertsHelper");
const {
  loadGeoTiffMaps,
  getCentegixId,
  loadCentegixMap,
  getGeocommData,
  loadGeoCommMap,
} = require("./helpers/getLocationHelper");

const { getS3FileUrl } = require("./s3CredentialsHandler");

exports.handler = async function (event, context) {
  const headers = event.headers || {};
  console.log("Received headers:", headers);

  // Normalize header keys to lowercase for consistent access
  const authHeader = headers.authorization || headers.Authorization;

  if (!authHeader) {
    return {
      statusCode: 401,
      body: "Unauthorized Access!",
    };
  }

  try {
    jwt.verify(authHeader.replace("Bearer ", "").trim(), process.env.JWT_SECRET);
  } catch (err) {
    console.log(err);
    return {
      statusCode: 401,
      body: "Unauthorized Access!",
    };
  }

  const response = {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status_code: 200, data: {} }),
  };

  try {
    const params = event.pathParameters || {};
    const query = event.queryStringParameters || {};

    const locationID = params.locationID;
    const type = params.type;

    if (locationID) {
      const objController = new PublicAlerts();
      const objLocation = await objController.loadLocationById(null, null, {
        locationId: locationID,
        type: -1,
      });

      if (
        objLocation &&
        Array.isArray(objLocation.locations) &&
        objLocation.locations.length > 0 &&
        objLocation.locations[0]
      ) {
        const loc = objLocation.locations[0];

        const locationResponse = {
          id: loc.id,
          name: loc.name,
          logo: loc.logo,
          address: loc.address,
          latitude: loc.latitude,
          longitude: loc.longitude,
          polygon: loc.polygon,
          radius: loc.radius,
          zoom: loc.zoom,
        };

        let responseData = locationResponse;

        switch (type) {
          case "1":
          case 1:
            // nothing extra
            break;

          case "2":
          case 2: {
            const geoTiffData = await loadGeoTiffMaps(locationID);
            if (geoTiffData) responseData.floors = geoTiffData;
            break;
          }

          case "3":
          case 3: {
            const centegixId = getCentegixId(locationID);
            if (centegixId) {
              const centegixData = await loadCentegixMap(centegixId, locationID);
              if (centegixData) {
                responseData.floors = centegixData.floors;
                responseData.assets = centegixData.assets;
                responseData.labels = centegixData.labels;
              }
            }
            break;
          }

          case "4":
          case 4:
            try {
              const geoData = getGeocommData(locationID) || {};
              const { gLat, gLng, gRadius } = geoData;
              if (gLat && gLng && gRadius) {
                responseData.site = await loadGeoCommMap(gLat, gLng, gRadius);
              }
            } catch (e) {
              console.error("Error loading GeoComm data:", e);
            }
            break;

          default: {
            const url = query.url;
            if (url) {
              try {
                // Commented out old code returning base64 content:
                /*
                const { buffer, contentType } = await downloadFileFromS3(url);
                if (!buffer || !contentType) throw new Error("Invalid S3 response");

                return {
                  statusCode: 200,
                  isBase64Encoded: true,
                  headers: { "Content-Type": contentType },
                  body: buffer.toString("base64"),
                };
                */

                // New: Return the S3 file URL (path) instead of base64 or file data
                const filePath = getS3FileUrl(url);

                return {
                  statusCode: 200,
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ filePath }),
                };
              } catch (error) {
                console.error("File not found in S3:", error);
                return {
                  statusCode: 404,
                  body: JSON.stringify({ error: "File not found in S3" }),
                };
              }
            }
            break;
          }
        }

        response.body = JSON.stringify({ status_code: 200, data: responseData });
      }
    }
  } catch (error) {
    console.error("UNCAUGHT ERROR:", error?.message || error);
    console.error(error?.stack || "");
  }

  if (!response.body) {
    response.body = JSON.stringify({ status_code: 500, message: "Something went wrong" });
  }
  return response;
};
