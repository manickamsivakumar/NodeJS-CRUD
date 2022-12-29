const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  passwword: "",
  database: "students",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("./public"));
app.set('view engine', 'ejs');
app.get("/", (req, res) => {
  var sql = 'select *,DATE_FORMAT(dob,"%d-%m-%Y") as date from tbl_students';
    db.query(sql, (err,results) => {
        if (err) {
          res.send('Something Went Wrong!..');
        } else {
          res.render(path.join(__dirname, "list.ejs"), {results});
         }
     });
});
app.get("/deleteuser", (req, res) => {
  var id = req.query.id;
  var sql = `delete from tbl_students where id=${id}`;
  db.query(sql, (error) => {
    if (!error) {
      res.redirect('/');
    }
  })
 
});

app.get("/getuser", (req, res) => {
  //res.send(req.query.id);

  var sql = `select *,DATE_FORMAT(dob,"%Y-%m-%d") as date from tbl_students where id=${req.query.id}`;
  db.query(sql, (err,results) => {
      if (err) {
        res.render([]);
      } else {
        console.log(results);
        res.render(path.join(__dirname, "index.ejs"), results[0]);
       }
   });
  
})
app.get('/add', (req, res) => {
  res.render(path.join(__dirname, "index.ejs"), {id:0,name:'',email:'',date:'',gender:'',phoneno:''});
})

app.post("/post", (req, res) => {
  
  var { id, name, email, phone, gender, dob } = req.body;
  if (id == 0) {
    var sql = `insert into tbl_students (name,dob,email,phoneno,gender) values('${name}','${dob}','${email}','${phone}','${gender}')`;  
  } else {
    var sql = `update tbl_students set name="${name}",dob="${dob}" , gender="${gender}", phoneno="${phone}" ,email='${email}'  where id=${id}`;
  }
  db.query(sql, (err) => {
        if (err) {
             res.json('failure')
        } else {
            res.json('success')
         }
     });
});

app.listen(3500);
