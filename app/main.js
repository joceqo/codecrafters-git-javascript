const fs = require("node:fs");
const fsPromises = require('node:fs/promises')
const path = require("node:path");
const util = require('node:util');
const zlib = require('node:zlib')
const deflate = util.promisify(zlib.inflate);



const command = process.argv[2];

switch (command) {
  case "init":{
    createGitDirectory();
    break;
  }
  case "cat-file": {
    const hash = process.argv.at(-1)
    readGitFile(hash);
    break
  }
  default:
    throw new Error(`Unknown command ${command}`);
}

function createGitDirectory() {
  fs.mkdirSync(path.join(process.cwd(), ".git"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "objects"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "refs"), { recursive: true });

  fs.writeFileSync(path.join(process.cwd(), ".git", "HEAD"), "ref: refs/heads/main\n");
  console.log("Initialized git directory");
}

async function readGitFile(hash){
  const content = await fsPromises.readFile(path.join(process.cwd(), ".git", "objects", hash.slice(0, 2), hash.slice(2)));
  const dataUnzipped = await deflate(content)
  const res = dataUnzipped.toString().split('\0')[1];

  process.stdout.write(res);
}

