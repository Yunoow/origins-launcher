const http = require("http");
const fs = require("fs");
const path = require("path");


const PORT = 8080;

const SERVER_ROOT =
    path.join(
        __dirname,
        "dev-server"
    );


const MIME_TYPES = {

    ".json":
        "application/json",

    ".jar":
        "application/java-archive",

    ".zip":
        "application/zip",

    ".txt":
        "text/plain"
};


const server =
    http.createServer(
        (request, response) => {

            const requestUrl =
                decodeURIComponent(
                    request.url.split("?")[0]
                );


            const relativePath =
                requestUrl === "/"
                    ? ""
                    : requestUrl.replace(/^\/+/, "");


            const filePath =
                path.join(
                    SERVER_ROOT,
                    relativePath
                );


            if (
                !filePath.startsWith(
                    SERVER_ROOT
                )
            ) {

                response.writeHead(403);
                response.end("Forbidden");
                return;
            }


            if (
                !fs.existsSync(filePath) ||
                fs.statSync(filePath).isDirectory()
            ) {

                response.writeHead(404);
                response.end("Not Found");
                return;
            }


            const extension =
                path.extname(filePath)
                    .toLowerCase();


            response.writeHead(
                200,
                {
                    "Content-Type":
                        MIME_TYPES[extension] ||
                        "application/octet-stream",

                    "Content-Length":
                        fs.statSync(filePath).size
                }
            );


            fs.createReadStream(filePath)
                .pipe(response);
        }
    );


server.listen(
    PORT,
    "127.0.0.1",
    () => {

        console.log(
            `Serveur Tempest démarré sur http://localhost:${PORT}`
        );

        console.log(
            `Manifest : http://localhost:${PORT}/tempest/manifest.json`
        );
    }
);