const getLocationHandler = require('./getLocationHandler');

// Define routes
const routes = {
  "/api/location": getLocationHandler.handler
};

exports.handler = async (event) => {
  try {
    const path = event.path || "";

    // Find the matching route
    const matchedRoute = Object.keys(routes).find((routePath) =>
      path.startsWith(routePath)
    );

    if (matchedRoute) {
      return await routes[matchedRoute](event);
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Route not found" }),
    };
  } catch (err) {
    console.error("API Handler Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
