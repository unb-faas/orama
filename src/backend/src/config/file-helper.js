const fs = require("fs");
const sharp = require("sharp");

exports.compressImage = async (file, size) => {
  const newPath = file.path.split(".")[0] + ".webp";
  const newFilename = newPath.split("uploads/")[1];

  const data = await sharp(file.path)
    .resize(size)
    .toFormat("webp")
    .webp({
      quality: 80,
    })
    .toBuffer();
  fs.access(file.path, (err) => {
    if (!err) {
      fs.unlink(file.path, (err_1) => {
        if (err_1) console.log(err_1);
      });
    }
  });
  fs.writeFile(newPath, data, (err_2) => {
    if (err_2) {
      throw err;
    }
  });
  return newFilename;
};
