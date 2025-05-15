class PublicAlerts {
  constructor() {
    // You can add any setup here if needed
  }

  async loadLocationById(req, res, { locationId, type }) {
    // Simulate a DB/API call - replace with real data fetching logic
    // Returning mock data
    return {
      locations: [
        {
          id: locationId,
          name: "Test Location",
          logo: "https://example.com/logo.png",
          address: "123 Test St, Test City",
          latitude: 40.7128,
          longitude: -74.006,
          polygon: null,
          radius: 100,
          zoom: 15,
        },
      ],
    };
  }
}

module.exports = {
  PublicAlerts,
};
