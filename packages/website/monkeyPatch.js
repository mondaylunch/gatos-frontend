import { readFile, writeFile } from "fs/promises";

readFile("dist/server.js")
  .then(async (file) => {
    console.info("Attempting to patch source...");
    const source = file.toString();

    // Replace default protocol with HTTPS:
    let mod1 = source.replace(
      "let origin = req.headers.origin || `http://${req.headers.host}`;",
      "let origin = req.headers.origin || `https://${req.headers.host}`;"
    );

    if (source === mod1) throw "Patch 1 failed";

    // Uncomment Set-Cookie fix from upstream:
    let mod2 = mod1.replace(
      '// headers.set("Set-Cookie", cookieHeader) // TODO: Remove. Seems to be a bug with Headers in the runtime',
      'headers.set("Set-Cookie", cookieHeader) // TODO: Remove. Seems to be a bug with Headers in the runtime'
    );

    if (mod1 === mod2) throw "Patch 2 failed";

    // Patch in random data to bust cache:
    let mod3 = mod2.replace(
      "/our_last_hope.js",
      `/our_last_hope.js?${Math.random().toString().substring(2)}`
    );

    if (mod2 === mod3) throw "Patch 3 failed";

    await writeFile("dist/server.js", mod3);
    console.info("Finished patching source.");
  })
  .catch(console.error);
