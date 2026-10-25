const bcrypt = require("bcrypt");

async function run() {
  const hash = await bcrypt.hash("ubaid@500", 8);
  console.log(hash);
  console.log(await bcrypt.compare("ubaid@500", hash));
  console.log(await bcrypt.compare("uba500", hash));
}

run();
