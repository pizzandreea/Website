const express=require('express');
const fs = require('fs');
const path=require('path');
var app= express();                //am creat serverul
const sharp = require('sharp');
const dns = require('dns');
const { request } = require('https');
const requestIp = require('request-ip');
const { text } = require('express');



app.get("*/galerie.json",function(req,res){
    res.setHeader("Content-Type","text/html");
    res.status(403).render("pages/403");
});


app.set("view engine", "ejs");
console.log("Project is at ", __dirname);
app.use("/resurse", express.static(__dirname+"/resurse"));




function verificaImagini(){
    var textFisier = fs.readFileSync("resurse/json/galerie.json")   //citeste tot fisierul
    var jsi = JSON.parse(textFisier);   //Transformam inobiect

//  preluam ora actuala
    var d = new Date();
    var h = d.getHours();
    

    var caleGalerie = jsi.cale_galerie;
    let vectImagini = []
    let counter = 0;

    for(let im of jsi.imagini){
        var imVeche = path.join(caleGalerie, im.fisier);
        var ext = path.extname(im.fisier);
        var numeFisier = path.basename(im.fisier, ext)
        let imMica = path.join(caleGalerie+"/mic/", numeFisier+"-200"+".webp");
        let imMedie = path.join(caleGalerie+"/mediu/", numeFisier+"-300"+".webp");
        
        console.log(imMica);

        let hours = im.timp;
        var l =  hours[0];
        var r =  hours[1];


        var i;
        // if(counter == 5 || counter == 6){
        //     var imVeche = path.join(caleGalerie, jsi.empty.fisier);
        //     var ext = path.extname(jsi.empty.fisier);
        //     var numeFisier = path.basename(jsi.empty.fisier, ext)
        //     let imMica = path.join(caleGalerie+"/mic/", numeFisier+"-200"+".webp");
        //     let imMedie = path.join(caleGalerie+"/mediu/", numeFisier+"-300"+".webp");
            
        //     vectImagini.push({mare:imVeche, mic:imMica, mediu:imMedie, descriere:jsi.empty.descriere});
                        
        //     counter+=1;

        //     if (!fs.existsSync(imMica))//daca nu exista imaginea, mai jos o voi crea
        // sharp(imVeche)
        // .resize(150) //daca dau doar width(primul param) atunci height-ul e proportional
        // .toFile(imMica, function(err) {
        //     if(err)
        //         console.log("eroare conversie",imVeche, "->", imMica, err);
        // });

        // if(!fs.existsSync(imMedie))
        // sharp(imVeche)
        //     .resize(350)
        //     .toFile(imMedie, function(err){
        //         if(err)
        //         console.group("eroare conversie", imVeche, "->",imMedie, err);
        //     });
        // }
        // else
        if(counter < 12){
            if( l < r){
                for(i = l; i < r ; i++){
                     
                    if(i == h){
                        vectImagini.push({mare:imVeche, mic:imMica, mediu:imMedie,descriere:im.descriere});
                        
                        counter+=1;
                    }
                }
            }
            else{
                for(i = l; i < 24 ; i++){
                     
                    if(i == h){
                        vectImagini.push({mare:imVeche, mic:imMica, mediu:imMedie,descriere:im.descriere});
                        
                        counter+=1;
                    }
                }
                for(i = 0; i <= r ; i++){
                     
                    if(i == h){
                        vectImagini.push({mare:imVeche, mic:imMica, mediu:imMedie,descriere:im.descriere});
                        
                        counter+=1;
                    }
                }
            }
                
        }
    

        //adauga in vector un element
        if (!fs.existsSync(imMica))//daca nu exista imaginea, mai jos o voi crea
        sharp(imVeche)
        .resize(150) //daca dau doar width(primul param) atunci height-ul e proportional
        .toFile(imMica, function(err) {
            if(err)
                console.log("eroare conversie",imVeche, "->", imMica, err);
        });

        if(!fs.existsSync(imMedie))
        sharp(imVeche)
            .resize(350)
            .toFile(imMedie, function(err){
                if(err)
                console.group("eroare conversie", imVeche, "->",imMedie, err);
            });

              
    }

    return vectImagini;
}

app.get("/index",function(req, res){

    
    let vectImagini = verificaImagini();
    res.render("pages/index", {imagini:vectImagini,adresa:req.ip}); 
})

app.get("/", function(req, res){
   
    let vectImagini =verificaImagini();
    res.render("pages/index", {imagini:vectImagini,adresa:req.ip}); 
})


app.get("/*",function(req, res) {
    console.log(req.url);
    res.render("pages"+req.url, function(err, rezultatRender) {
    if (err) {
        if (err.message.includes("Failed to lookup view")) {
            res.status (404).render("pages/404")
        } else
        throw err;
        }
    else
    res.send(rezultatRender);
    });
});

verificaImagini();

app.listen(8081);
console.log("Server is on");
