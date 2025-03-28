# Create a blob object #jt4

Implementing the hash-object command

to do this i used 
- fs.stat
- createHash from node:crypto, that use a buffer to tranform data with update and digest.
- zlib.deflate to compress the file. The zlib lib have multiple librabries that can compress data (brotli, deflate, gzip)
