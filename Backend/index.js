import express from "express"
import cors from "mysql"

const app = express()

// const db = mysql.createConnection({
//     host:"localhost",
//     user:"root",
//     password: "",
//     database:""
// })



app.use(express.json()) 
app.use(cors())

// I f there is a auth problem
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'DefaultPassowrd'
app.get("/", (req,res)=>{
    res.json("hello this is the backend")
})
// Example endpoint to get data
app.get('/api/items', (req, res) => {
    const q = 'SELECT * FROM items'
    db.query(q, (err, results) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });

app.listen(8800, ()=>{
    console.log("Connected to backend!")
})