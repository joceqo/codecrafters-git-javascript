# Read a blob object #ic4

Add support for reading a blob.

the 3 types of git objects:
- Blobs, these are used to store file data.
Blobs only store the contents of a file, not its name or permissions.
- Trees, These are used to store directory structures. The information stored can include things like what files/directories are in a tree, their names and permissions.
- Commits, these are used to store commit data.The information stored can include things like the commit message, author, committer, parent commit(s) and more.

All Git objects are identifiable by a 40-character SHA-1 hash, also known as the "object hash".

Here's an example of an object hash: e88f7a929cd70b0274c4ea33b209c97fa845fdbc.

## Git Object Storage

Git objects are stored in the `.git/objects` directory. The path to an object is derived from its hash.

The path for the object with the hash e88f7a929cd70b0274c4ea33b209c97fa845fdbc would be:

  ./.git/objects/e8/8f7a929cd70b0274c4ea33b209c97fa845fdbc
You'll see that the file isn't placed directly in the ./git/objects directory. Instead, it's placed in a directory named with the first two characters of the object's hash. The remaining 38 characters are used as the file name.

Each Git object has its own format for storage.

## Blob Object Storage

Each Git Blob is stored as a separate file in the .git/objects directory. The file contains a header and the contents of the blob object, compressed using Zlib.

The format of a blob object file looks like this (after Zlib decompression):

  blob <size>\0<content>
<size> is the size of the content (in bytes)

\0 is a null byte

<content> is the actual content of the file

For example, if the contents of a file are hello world, the blob object file would look like this (after Zlib decompression):

  blob 11\0hello world

##
