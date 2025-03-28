const fs = require("node:fs");
const fsPromises = require('node:fs/promises')
const path = require("node:path");
const util = require('node:util');
const zlib = require('node:zlib');
const {createHash} = require('node:crypto');

const inflate = util.promisify(zlib.inflate);
const deflate = util.promisify(zlib.deflate)

const command = process.argv[2];

switch (command) {
  case "init":{
    createGitDirectory();
    break;
  }
  case "cat-file": {
    const hash = process.argv.at(-1)
    catFile(hash);
    break
  }
  case "hash-object":{
    const path = process.argv.at(-1)
    hashObject(path)
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

async function catFile(hash){
  const content = await fsPromises.readFile(path.join(process.cwd(), ".git", "objects", hash.slice(0, 2), hash.slice(2)));
  const dataUnzipped = await inflate(content)
  const res = dataUnzipped.toString().split('\0')[1];

  process.stdout.write(res);
}

async function getHashKey(path){
  const filesize = await fsPromises.stat(path)
  const file = await fsPromises.readFile(path)
  const fileWithHeader = `blob ${filesize.size}\0${file}`

  const sha256 = createHash('sha1')

  sha256.update(fileWithHeader)

  return [fileWithHeader, sha256.digest('hex').substring(0,40)]
}

async function hashObject(filepath){
  const [file, hash] = await getHashKey(filepath)

  if(process.argv.at(-2) === '-w'){
    await fsPromises.mkdir(path.join(process.cwd(), ".git", "objects", hash.slice(0, 2)), {recursive: true})
    const compressedFile = await deflate(file)
    await fsPromises.writeFile(path.join(process.cwd(), ".git", "objects", hash.slice(0, 2), hash.slice(2)), compressedFile)
  }

  process.stdout.write(hash)
}