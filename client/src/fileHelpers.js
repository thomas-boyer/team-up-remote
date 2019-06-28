//Find file chunk belonging to user
const findChunk = (file, email) =>
{
  return file.chunks.find( (chunk) =>
    {
      return chunk.email === email;
    });
}

module.exports = { findChunk };