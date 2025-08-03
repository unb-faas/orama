const { BlobServiceClient } = require('@azure/storage-blob');
module.exports = async function (context, req) {
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!AZURE_STORAGE_CONNECTION_STRING) {
      context.res.status(500).send("Azure Storage Connection string not found");
    }
    
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );

    const containerName = "items";
    const containerClient = blobServiceClient.getContainerClient(containerName);
    try {
    const createContainerResponse = await containerClient.create();
    } catch(e){
      console.log(e)
    }
    switch (req.method) {
      case "GET":
        const items = []
        const files = []
        for (const blob of containerClient.listBlobsFlat()) {
          files.push(blob.name)
        }
        for (let i in files){
          const file = files[i]
          const blobClient = await containerClient.getBlobClient(file)
          const downloadResponse = await blobClient.download()
          const downloaded = await streamToBuffer(downloadResponse.readableStreamBody)
          let content = {}
          try{
            content = JSON.parse(downloaded.toString())
          } catch(e){
            context.res.status(500).send(e); 
          }
          content.id = file.replace(".json","")
          items.push(content)
        }
        context.res.status(200).send(items);  
        break;
      case "POST":
        try {
        if (req.body){
          const data = JSON.stringify(req.body)
          const hrTime = process.hrtime()
          let id = hrTime[0] * 1000000 + hrTime[1] / 1000
          id = Math.floor(id)
          const blobName = `${id}.json`
          const blockBlobClient = containerClient.getBlockBlobClient(blobName);
          const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
          context.res.status(200).send({result:`Created new item: ${id}`});  
        } else {
          context.res.status(500).send({error:"body is not defined"});
        }
        } catch(e){
          context.res.status(500).send({result:e})
        }
        break;

      case "DELETE":
        if (req.query.id){
          const id = req.query.id;
          const blockBlobClient = containerClient.getBlockBlobClient(`${id}.json`)
          await blockBlobClient.delete()
          context.res.status(200).send({result:`Deleted item: ${id}`});  
        } else {
          context.res.status(500).send({error:"id is not defined"});
        }
        break;
      default:
        context.res.status(500).send({error:"method not allowed"});
        break;
    }
    return
}

async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on('data', (data) => {
          chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on('end', () => {
          resolve(Buffer.concat(chunks));
      });
      readableStream.on('error', reject);
  });
}