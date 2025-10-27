import express from 'express';
const solarSystem = (await import('npm-solarsystem')).default;
import fetch from 'node-fetch';
import { getAsteroids } from 'npm-solarsystem';

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

//root route
//this is a function declaration syntax style, so we can make it asynchronous
app.get('/', async (req, res) => {
   let url = "https://pixabay.com/api/?key=5589438-47a0bca778bf23fc2e8c5bf3e&per_page=50&orientation=horizontal&q=solar%20system";
   let response = await fetch(url);
   let data = await response.json()
   console.log(data);

   let random_num = Math.floor(Math.random() * data.hits.length);
   console.log(random_num);

   let randomImage = data.hits[random_num].webformatURL;
   res.render('home.ejs', {randomImage})
});

//POD route
app.get("/nasa_pod", async (req, res) => {
   try {
     // Get today’s date in YYYY-MM-DD format
      let today = new Date();

    // Subtract 1 year
      let lastYear = new Date(
         today.getFullYear()-1,
         today.getMonth(),
         today.getDate()
      );

      // Format: YYYY-MM-DD
      let formattedDate = lastYear.toISOString().split("T")[0];
      let url = `https://api.nasa.gov/planetary/apod?api_key=9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD&date=${formattedDate}`
      let response = await fetch(url);
      let data = await response.json();
 
      res.render("nasa_pod.ejs", {nasaPhoto: data});
   } catch (error) {
      console.error(error + " nasa pod");
   }
 });


// asteroid route
app.get('/asteroids', (req, res) => {
   let asteroidInfo = solarSystem.getAsteroids();
   res.render('asteroids.ejs', {asteroidInfo})
});

// comet route
app.get('/comets', (req, res) => {
   let cometInfo = solarSystem.getComets();
   res.render('comets.ejs', {cometInfo})
});
//planet route (template)
app.get('/planet', (req, res) => {
   let planet_name = req.query.planetName;
   let planetInfo = solarSystem[`get${planet_name}`]();
   console.log(planet_name);
   //special cases for these planets because the images from npm aren't working
   if (planet_name == "Mars") {
      res.render('mars.ejs', {planetInfo, planet_name})
   } else if (planet_name == "Jupiter"){
      res.render('jupiter.ejs', {planetInfo, planet_name})
   } else if (planet_name == "Pluto"){
      res.render('pluto.ejs',{planetInfo, planet_name})
   }else {
      res.render('planetInfo.ejs', {planetInfo, planet_name})
   }
});

app.listen(3000, () => {
   console.log('server started');
});