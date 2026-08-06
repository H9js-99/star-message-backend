const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

let client;

async function connectDB() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client.db('starMsg').collection('messages');
}

module.exports = async (req, res) => {
  res.setHeader('Access‑Control‑Allow‑Origin', '*');
  res.setHeader('Access‑Control‑Allow‑Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access‑Control‑Allow‑Headers','Content‑Type');

  if(req.method === 'OPTIONS') return res.status(200).end();

  try{
    const coll = await connectDB();
    if(req.method === 'POST'){
      const body = JSON.parse(req.body);
      await coll.insertOne({content:body.content,createAt:new Date()});
      return res.status(200).json({ok:true});
    }else if(req.method === 'GET'){
      const list = await coll.find().sort({createAt:-1}).limit(50).toArray();
      return res.status(200).json({list});
    }
  }catch(e){
    return res.status(500).json({error:e.message});
  }
  res.status(404).json({msg:"not found"});
};
