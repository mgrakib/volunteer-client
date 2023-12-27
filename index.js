const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5001;
const moment = require('moment')

app.use(cors());
app.use(express.json())

// ;
// volunteerAdmin;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nvffntx.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();
		const dataCollection = client.db("volunteerEvent").collection("data");
		const userCollection = client.db("volunteerEvent").collection("user");
		const ticketCollection = client.db("supportSystem").collection("ticket");
		const routineCollection = client.db("school-management").collection("routines");





		// get all-event data 
		app.get("/get-data", async (req, res) => {
			const result = await routineCollection.find().toArray()

			res.json({ result });
		});
		// get all-event data 


		app.get("/tickets", async (req, res) => {



			const response = await routineCollection.aggregate([
				{
					$match: {
						date: {
							$gte: new Date(moment().format('yyyy-MM-DD')),
							$lte: new Date(moment().add(1, 'days').format('yyyy-MM-DD'))
						}
					}
				},
				{ $group: { _id: { class: '$smClass', section: '$section' }, data: { $push: '$$ROOT' } } },
				{ $group: { _id: '$_id.class', data: { $push: { k: '$_id.section', v: '$data' } } } },
				{ $project: { _id: 1, data: { $arrayToObject: '$data' } } },
				{ $group: { _id: null, data: { $push: { k: '$_id', v: '$data' } } } },
				{ $project: { _id: 0, data: { $arrayToObject: '$data' } } }
			]).toArray()

			res.send(response);
		});













		// $and: [
		// 	{ experiences: { $exists: true } },
		// 	{
		// 		$expr: {
		// 			$gte: [{ $size: '$experiences' }, 2]
		// 		}
		// 	}
		// ]

		// {
		// 	hobby: {
		// 		$all: [
		// 			"Hiking",
		// 			"Photography",
		// 			"Dancing"]
		// 	}
		// }


		// const result = await userCollection.find({
		// 	$and: [
		// 		{ age: { $gt: 25 } },
		// 		{ designation: { $eq: "Software Developer"}}
		// 	]
		// }).toArray()


		// const result = await userCollection.find({
		// 	age: { $gt: 25 },
		// 	designation: { $eq: "Software Developer" }
		// }).toArray()

		// const result = await userCollection.find({
		// 	$and: [
		// 		{ designation: 'Software Engineer' },
		// 		{ experience_years:3 },
		// 	]
		// }).toArray()

		// const result = await userCollection.find({
		// 	designation: 'Software Engineer',
		// 	experience_years: 3
		// }).toArray()













		// add an event
		app.post('/add-event', async (req, res) => {
			const event = req.body;
			const result = await eventCollection.insertOne(event);
			res.send(result);
		})

		app.get('/', (req, res) => {
			res.send('')
		})


		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Hello World!");
});


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});