const fs = require("fs");
const path = require("path");
const crypto = require("crypto");


const SERVER_ROOT =
    path.join(
        __dirname,
        "dev-server",
        "tempest"
    );


function sha256(filePath) {

    const data =
        fs.readFileSync(filePath);

    return crypto
        .createHash("sha256")
        .update(data)
        .digest("hex");
}


function scanFolder(folderName, extension) {

    const folderPath =
        path.join(
            SERVER_ROOT,
            folderName
        );


    if (!fs.existsSync(folderPath)) {

        return [];
    }


    return fs
        .readdirSync(folderPath)
        .filter(
            (file) => {

                const filePath =
                    path.join(
                        folderPath,
                        file
                    );

                return (
                    fs.statSync(filePath).isFile() &&
                    file
                        .toLowerCase()
                        .endsWith(extension)
                );
            }
        )
        .sort()
        .map(
            (file) => {

                const filePath =
                    path.join(
                        folderPath,
                        file
                    );


                const stats =
                    fs.statSync(filePath);


                return {

                    file,

                    path:
                        `${folderName}/${file}`,

                    size:
                        stats.size,

                    sha256:
                        sha256(filePath)
                };
            }
        );
}


const manifest = {

    game:
        "Tempest Origins",

    version:
        "0.1.0",

    minecraft:
        "1.21.11",

    fabric:
        "0.19.5",

    generatedAt:
        new Date().toISOString(),

    mods:
        scanFolder(
            "mods",
            ".jar"
        ),

    shaderpacks:
        scanFolder(
            "shaderpacks",
            ".zip"
        ),

    resourcepacks:
        scanFolder(
            "resourcepacks",
            ".zip"
        )
};


const manifestPath =
    path.join(
        SERVER_ROOT,
        "manifest.json"
    );


fs.writeFileSync(
    manifestPath,
    JSON.stringify(
        manifest,
        null,
        4
    ),
    "utf8"
);


console.log(
    `Manifest généré : ${manifestPath}`
);

console.log(
    `${manifest.mods.length} mods`
);

console.log(
    `${manifest.shaderpacks.length} shaderpacks`
);

console.log(
    `${manifest.resourcepacks.length} resourcepacks`
);
