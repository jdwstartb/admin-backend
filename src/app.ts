import * as Drash from "https://deno.land/x/drash@v2.6.0/mod.ts";

// Create your resource

class HomeResource extends Drash.Resource {
    public paths = ["/"];

    public GET(request: Drash.Request, response: Drash.Response): void {
        return response.json({
            hello: "world",
            time: new Date(),
        });
    }
}

// Create and run your server

const server = new Drash.Server({
    hostname: "admin_backend_deno",
    port: 1667,
    protocol: "http",
    resources: [HomeResource],
});

server.run();

console.log(`Server running at ${server.address}.`);
