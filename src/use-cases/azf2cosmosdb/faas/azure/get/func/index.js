const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");
const dbContext = require("./data/databaseContext");

module.exports = async function (context, req) {
  try {

    const { endpoint, key, databaseId, containerId } = config;
    const client = new CosmosClient({ endpoint, key });
    const database = client.database(databaseId);
    const container = database.container(containerId);

    // Make sure Tasks database is already setup. If not, create it.
    await dbContext.create(client, databaseId, containerId);

    switch (req.method) {
      case "GET":
        // query to return all items
        const querySpec = {
          query: "SELECT * from c"
        };

        // read all items in the Items container
        const { resources: items } = await container.items
          .query(querySpec)
          .fetchAll();
        
        context.res.status(200).send(items);  
        break;
      case "POST":
        if (req.body){
          const newItem = req.body
          const { resource: createdItem } = await container.items.create(newItem);
          context.res.status(200).send({result:`Created new item: ${createdItem.id} - ${createdItem.description}`});  
        } else {
          context.res.status(500).send({error:"body is not defined"});
        }
        break;

      case "DELETE":
        if (req.query.id){
          const id = req.query.id;
          const { resource: result } = await container.item(id).delete();
          context.res.status(200).send({result:`Deleted item: ${id}`});  
        } else {
          context.res.status(500).send({error:"id is not defined"});
        }
        break;
      default:
        context.res.status(500).send({error:"method not allowed"});
        break;
    }
    return;
    } catch (err) {
      console.error(new Error(err.message));
      context.res.status(500).send(err.message);
    }
}