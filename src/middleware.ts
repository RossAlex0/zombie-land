export const middleware = (request: Request) => {
  console.log("Middleware executed for:", request.url);
  return new Response("Middleware executed successfully");
};
