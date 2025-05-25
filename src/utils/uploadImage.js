const uploadImageToFirebase = async (image, bucket, folder = "cakes") => {
  if (!image || !image.hapi) return null;

  const filename = image.hapi.filename;
  const contentType = image.hapi.headers["content-type"];
  const extension = filename.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;
  const file = bucket.file(fileName);

  const stream = file.createWriteStream({
    metadata: { contentType },
    public: true,
    resumable: false,
  });

  await new Promise((resolve, reject) => {
    image
      .pipe(stream)
      .on("error", reject)
      .on("finish", resolve);
  });

  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
};

module.exports = uploadImageToFirebase;
