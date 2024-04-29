
const express = require("express");
const app = express(); // boş bir express sunucusu oluşturur
const port = 3000;
const cors = require("cors");

app.use(cors());
app.use(express.json());


const jwt = require("jsonwebtoken");
const pg = require("pg");
const { Client } = require("pg");
 
const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'markett',
  user: 'postgres',
  password: 'postgres123',
});

client.connect();

app.get("/", (req, res) => {
    res.send("Hello World")
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});


app.get("/api", (req, res) => {
    res.json({
        message: "welcome to the api"
    });
});



app.post("/api/posts", VerifyToken, (req, res) => {
    jwt.verify(req.token, "secretkey", (err, authData)=>  {
        if(err){
            res.sendStatus(403);
        } else {
            res.json({
                message: "post created",
                authData

            })
        }

    } );

})


app.post("/api/login", (req, res) => {

    const user = {
        nameSurname: "ariKralice",
        email: "ari@gmail.com",
        password: "ari135"
    }

    jwt.sign({user}, "secretkey", { expiresIn: "30s"}, (err, token) => 
    {
        res.json({
            token
        });

    });
});

//FORMAT OF TOKEN
// Authorization: Bearer <access_token>

//Verify Token
function VerifyToken(req, res, next){
    //get auth header value
    const bearerHeader = req.headers["authorization"];

    //check if bearer is undefined
    if(typeof bearerHeader !== "undefined"){
        // Split at the space
        const bearer = bearerHeader.split(" ");
        //Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();


    } else {
        // Forbidden
        res.sendStatus(403);
    }

}


/////// KULLANICI İŞLEMLERİ **************************************////////

// TUM KULLANICILARI LISTELEME
app.get("/users/list/allUsers", (req, res) => {

    var emails = [];
    var passwords = [];
    var userIds = [];
    var nameSurnames = [];

    client.query(`SELECT * FROM "Users"`, 
    (err, ress) =>{
        if (!err){
            for (let i = 0; i < ress.rowCount; i++) {
                userIds.push(ress.rows[i]["userId"]);
                emails.push(ress.rows[i]["userMail"]);
                nameSurnames.push(ress.rows[i]["UserNameSurname"]);
                passwords.push(ress.rows[i]["userPassword"]);
              }

            emails = JSON.parse(JSON.stringify(emails));
            userIds = JSON.parse(JSON.stringify(userIds));
            nameSurnames = JSON.parse(JSON.stringify(nameSurnames));
            passwords = JSON.parse(JSON.stringify(passwords));
            
            res.status("200").json({
                "Id": userIds,
                "Email": emails,
                "Password": passwords,
                "NameSurname": nameSurnames,
            }) 
            
        } else{
            return res.status(404).json({
                message: "Kullanıcı bulunamadı."
            });
        }
        client.end;
    })

});




// ID ILE KULLANICI BILGILERI BULMA
app.get("/users/findUserById/:userId", (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json({
            message: "Kullanıcı Id geçersiz."
        });
    }

    client.query(`SELECT * FROM public."Users" WHERE "userId" = ${userId}`, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Sunucu hatası."
            });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Kullanıcı bulunamadı."
            });
        }

        const user = result.rows[0];
        const email = user.userMail;
        const nameSurname = user.UserNameSurname;
        const password = user.userPassword;

        res.status(200).json({
            "Email": email,
            "Password": password,
            "NameSurname": nameSurname
        });
    });
});





// MAIL ILE KULLANICI ID BULMA

app.get("/users/findUserByMail/:userMail", (req ,res) => {

    const userMail = req.params.userMail;
    console.log(userMail);

    if (!userMail) {
        return res.status(400).json({
            message: "Kullanıcı email geçersiz."
        });
    }

    client.query(`SELECT * FROM public."Users" WHERE "userMail" = '${userMail}'`, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Sunucu hatası."
            });
        }
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Kullanıcı bulunamadı."
            });
        }
        const user = result.rows[0];
        const userId = user.userId;

        res.status(200).json({
            "userId": userId,
        });
    });
});




// PASSWORD ILE KULLANICI ID BULMA

app.get("/users/findUserByPassword/:userPassword", (req ,res) => {

    const userPassword = req.params.userPassword;
    console.log(userPassword);

    if (!userPassword) {
        return res.status(400).json({
            message: "Kullanıcı şifresi geçersiz."
        });
    }

    client.query(`SELECT * FROM public."Users" WHERE "userPassword" = '${userPassword}'`, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Sunucu hatası."
            });
        }
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Kullanıcı bulunamadı."
            });
        }
        const user = result.rows[0];
        const userId = user.userId;

        res.status(200).json({
            "userId": userId,
        });
    });
});





///////  İTEM İŞLEMLERİ **************************************////////




//// ID ILE ITEMI BULMA 

app.get("/items/findItemById/:GeneralItemId", (req, res) => {
    const GeneralItemId = req.params.GeneralItemId;

    if (!GeneralItemId || GeneralItemId > 37 || GeneralItemId < 1) {
        return res.status(404).json({
            message: "Geçersiz item Id'si",
        });
    }
    

    let tableName;
    if (GeneralItemId < 10) {
        tableName = "Drinks";
    } else if (GeneralItemId < 19) {
        tableName = "Foods";
    } else if (GeneralItemId < 28) {
        tableName = "HouseCleaning";
    } else {
        tableName = "PersonalHygine";
    }

    const query = `
        SELECT * FROM "${tableName}"
        WHERE "GeneralItemId" = $1
    `;
    
    client.query(query, [GeneralItemId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }

        if (result.rows.length === 0) {
            return res.status(404).send("Item not found");
        }

        const theRow = result.rows[0];
        const itemId = theRow.GeneralItemId;
        const itemName = theRow.ItemName;
        const itemCost = theRow.CostOfItem;
        const itemCount = theRow.CountOfItem;
        const description = theRow.Description;

        res.status(200).json({
            "ItemId": itemId,
            "ItemName": itemName,
            "ItemCost": itemCost,
            "ItemCount": itemCount,
            "Description": description
        });
    });
});





// SEPETE EKLEME

app.post("/items/addBasketItem/:userId", (req, res) => {

    const { GeneralItemId } = req.body;
    const userId = req.params.userId;

    // Check if userId is not provided or invalid
    if (!userId || isNaN(userId)) {
        return res.status(404).json({
            message: "Kullanıcı ID geçersiz veya eksik.",
        });
    }

    // Check if the user exists in the database
    client.query(`
        SELECT * FROM public."Users"
        WHERE "userId" = ${userId};`, (err, result) => {
            if (err) {
                console.error("Error checking user:", err);
                return res.status(500).json({
                    message: "Kullanıcı sorgulanırken bir hata oluştu."
                });
            }

            // If no rows are returned, user does not exist
            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: "Kullanıcı bulunamadı.",
                });
            }

            // User exists, proceed with the updates
            if (!GeneralItemId) {
                return res.status(404).json({
                    message: "Ürün ID geçersiz.",
                });
            }

            if (GeneralItemId > 37 || GeneralItemId < 1) {
                return res.status(404).json({
                    message: "Ürün ID geçersiz bir değere sahip.",
                });
            }

            // Proceed with database queries
            client.query(`
                UPDATE public."Users"
                SET "UserBasketItems" = array_remove("UserBasketItems", -1)
                WHERE "userId" = ${userId};`, (err, result) => {
                    if (err) {
                        console.error("Error removing items from basket:", err);
                        return res.status(500).json({
                            message: "Sepetiniz düzgün bir yapıda değil."
                        });
                    }

                    // Proceed with the next query
                    client.query(`
                        UPDATE public."Users"
                        SET "UserBasketItems" = array_append("UserBasketItems", ${GeneralItemId})
                        WHERE "userId" = ${userId};`, (err, result) => {
                            if (err) {
                                console.error("Error adding item to basket:", err);
                                return res.status(500).json({
                                    message: "Ürün sepete eklenirken bir sorunla karşılaştı."
                                });
                            }

                            console.log("Item successfully added to basket.");
                            res.status(200).json({
                                message: "Başarıyla sepete eklendi."
                            });
                        });
                });
        });
});





// SADECE İÇECEKLERİ LİSTELEME

app.get("/items/list/drinks", (req, res) => {
    client.query(`SELECT * FROM public."Drinks"`, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }

        const drinkItems = result.rows.map(row => ({
            "ItemId": row.GeneralItemId,
            "ItemName": row.ItemName,
            "ItemCost": row.CostOfItem,
            "ItemCount": row.CountOfItem,
            "Description": row.Description
        }));

        res.status(200).json(drinkItems);
    });
});





// SADECE YEMEKLERİ LİSTELEME

app.get("/items/list/foods", (req, res) => {
    client.query(`SELECT * FROM public."Foods"`, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }

        const foodItems = result.rows.map(row => ({
            "ItemId": row.GeneralItemId,
            "ItemName": row.ItemName,
            "ItemCost": row.CostOfItem,
            "ItemCount": row.CountOfItem,
            "Description": row.Description
        }));

        res.status(200).json(foodItems);
    });
});



// SADECE EV TEMİZLİK MALZEMELERİ LİSTELEME

app.get("/items/list/houseCleaning", (req, res) => {
    client.query(`SELECT * FROM public."HouseCleaning"`, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }

        const houseCleaningItems = result.rows.map(row => ({
            "ItemId": row.GeneralItemId,
            "ItemName": row.ItemName,
            "ItemCost": row.CostOfItem,
            "ItemCount": row.CountOfItem,
            "Description": row.Description
        }));

        res.status(200).json(houseCleaningItems);
    });
});



// SADECE KİŞİSEL TEMİZLİK MALZEMELERİ LİSTELEME

app.get("/items/list/personalHygine", (req, res) => {
    client.query(`SELECT * FROM public."PersonalHygine"`, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }

        const personalHygieneItems = result.rows.map(row => ({
            "ItemId": row.GeneralItemId,
            "ItemName": row.ItemName,
            "ItemCost": row.CostOfItem,
            "ItemCount": row.CountOfItem,
            "Description": row.Description
        }));

        res.status(200).json(personalHygieneItems);
    });
});




// SEPETTEN ÜRÜN SİLME

app.delete("/items/removeBasketItem/:userId", (req, res) => {
    const { GeneralItemId } = req.body;
    const userId = req.params.userId;

    if (!GeneralItemId || GeneralItemId > 37 || GeneralItemId < 1) {
        return res.status(400).json({
            message: "Item Id geçerli değil."
        });
    }

    if (!userId) {
        return res.status(400).json({
            message: "User Id geçerli değil."
        });
    }

    // Check if userId exists in the database
    client.query(`SELECT * FROM public."Users" WHERE "userId" = ${userId}`, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Sunucu hatası."
            });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Kullanıcı bulunamadı."
            });
        }

        // If the user exists, proceed with updating the basket
        client.query(`
            UPDATE public."Users"
            SET "UserBasketItems" = array_remove("UserBasketItems", ${GeneralItemId})
            WHERE "userId" = ${userId}; `,
            (updateErr, updateRes) => {
                if (updateErr) {
                    console.error(updateErr);
                    return res.status(500).json({
                        message: "Sepetten ürün silmede sorun yaşandı."
                    });
                }
                console.log(updateRes.rows);

                // If the basket becomes empty, replace the last item with -1
                if (updateRes.rowCount === 0) {
                    client.query(`
                        UPDATE public."Users"
                        SET "UserBasketItems" = array[-1]
                        WHERE "userId" = ${userId};
                    `);
                }

                res.status(200).json({
                    message: "Ürün başarıyla sepetinizden silindi."
                });
            });
    });
});




// SEPETTEN SATIN ALMA

app.delete("/items/buyBasket/:userId", (req, res) => {

    const userId = req.params.userId;

    if (!userId){
        return res.status(404).json({
            message: "User Id geçerli değil."
        });
    }

    client.query(`
    UPDATE "Users"
    SET "UserBasketItems" = ARRAY[-1]
    WHERE "userId" = ${userId};
    `, (err, res) =>{
        if(!err){
            console.log(res.rows);
        } else{
            console.log(err.message);
            return res.status(404).json({
                message: "Satın almada bazı sorunlar yaşandı."
            });
        }

        client.end;
    })

    res.status(200).json({
        message: "Başarıyla satın alındı."
    });
});





// SEPETI GORUNTULEME

app.get("/items/list/basketItems/:userId", (req, res)=> {

    var basketItems = [];

    const userId = req.params.userId;
    
    if (!userId){
        return res.status(404).json({
            message: "User Id geçerli değil."
        });
    }
    
    client.query(`SELECT "UserBasketItems" FROM public."Users" WHERE "userId" = '${userId}'`, 
    (err, ress) =>{
        if (!err){
            basketItems = ress.rows[0].UserBasketItems;
            console.log(basketItems)
            
            res.status(200).json({
                basketItems: basketItems
            });
            
        } else{
            return res.status(404).json({
                message: "Kullanıcı bulunamadı."
            });
        }
        client.end;
    });
});


