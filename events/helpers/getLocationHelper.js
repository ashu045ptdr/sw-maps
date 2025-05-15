
async function loadGeoTiffMaps(locationID) {
  // Replace with your actual GeoTiff fetching logic
  return [
    { floor: "1", imageUrl: `https://example.com/geotiff/${locationID}/floor1.tiff` },
    { floor: "2", imageUrl: `https://example.com/geotiff/${locationID}/floor2.tiff` },
  ];
}

function getCentegixId(locationID) {
  // Return some ID or null
  return locationID === "123" ? "centegix-abc" : null;
}

async function loadCentegixMap(centegixId, locationID) {
  // Simulate fetching Centegix map data
  return {
    floors: [{ floor: "ground", url: `https://example.com/centegix/${centegixId}/floor.png` }],
    assets: [{ id: "asset1", name: "Asset One" }],
    labels: [{ id: "label1", text: "Label One" }],
  };
}

function getGeocommData(locationID) {
  // Return geo coords and radius
  return {
    gLat: 40.7128,
    gLng: -74.006,
    gRadius: 500,
  };
}

async function loadGeoCommMap(lat, lng, radius) {
  // Simulate loading geo communication site data
  return {
    siteName: "GeoComm Site",
    coordinates: { lat, lng },
    radius,
  };
}

module.exports = {
  loadGeoTiffMaps,
  getCentegixId,
  loadCentegixMap,
  getGeocommData,
  loadGeoCommMap,
};
