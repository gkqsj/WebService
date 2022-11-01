const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db', { useNewUrlParser: true, useUnifiedTopology: true });
require('./models/TBA_DESTINATION');
const JSONtoCSV = require("json2csv").parse;
const FileSystem = require("fs");

// A partir de agora, todas as operações com o banco de dados chamarão métodos em "TBA_DESTINATION"
let TBA_DESTINATION = mongoose.model('TBA_DESTINATION');

// Deleta todas as entradas do banco de dados, "{}" representa o filtro, se não há nada no filtro, está selecionará todos os elementos na tabela
TBA_DESTINATION.deleteMany({}, (err, result) => {
    if (err) { console.log(err) }
});

// Insere entradas inciais, recebe parâmetros de ID e DESTINATION
TBA_DESTINATION.insertMany([
    { DTN_ID: "001", DTN_DESTINATION: 'Batata' },
    { DTN_ID: "002", DTN_DESTINATION: 'Banana' },
    { DTN_ID: "003", DTN_DESTINATION: 'Pera' },
    { DTN_ID: "004", DTN_DESTINATION: 'Alface' },
    { DTN_ID: "005", DTN_DESTINATION: 'Bola' },
    { DTN_ID: "006", DTN_DESTINATION: 'Macaco' },
    { DTN_ID: "007", DTN_DESTINATION: 'Leão' },
    { DTN_ID: "008", DTN_DESTINATION: 'Celta' },
    { DTN_ID: "009", DTN_DESTINATION: 'Maçã' },
    { DTN_ID: "00a", DTN_DESTINATION: 'Cama' },
    { DTN_ID: "00b", DTN_DESTINATION: 'Lençol' },
    { DTN_ID: "00c", DTN_DESTINATION: 'Uva' },
    { DTN_ID: "00d", DTN_DESTINATION: 'Abacaxi' },
    { DTN_ID: "00e", DTN_DESTINATION: 'Sopa' },
    { DTN_ID: "00f", DTN_DESTINATION: 'Árvore' },
    { DTN_ID: "00g", DTN_DESTINATION: 'Zebra' },
    { DTN_ID: "00h", DTN_DESTINATION: 'Pão' },
    { DTN_ID: "00i", DTN_DESTINATION: 'Comida' },
    { DTN_ID: "fn49bfp", DTN_DESTINATION: 'Agua' },
    { DTN_ID: "vn34034", DTN_DESTINATION: 'Carne' },
    { DTN_ID: "0f29cwae", DTN_DESTINATION: 'Cebola' },
    { DTN_ID: "2n4hpgh", DTN_DESTINATION: 'Laranja' },
    { DTN_ID: "pf9w4unvp9", DTN_DESTINATION: 'Laranja' },
    { DTN_ID: "v30p8mh", DTN_DESTINATION: 'Laranja' },
    { DTN_ID: "5408h", DTN_DESTINATION: 'Laranja' },
    { DTN_ID: "jfrish", DTN_DESTINATION: 'Laranja' },
    { DTN_ID: "328yrn8", DTN_DESTINATION: 'Laranja' },
    { DTN_ID: "bj045", DTN_DESTINATION: 'Laranja' },
    { DTN_ID: "v5409chm", DTN_DESTINATION: 'Laranja' },
    { DTN_ID: "23vun", DTN_DESTINATION: 'Laranja' },
    { DTN_ID: "g0c52mgh", DTN_DESTINATION: 'Laranja' },
    { DTN_ID: "v359o8hon", DTN_DESTINATION: 'Laranja' },
    { DTN_ID: "2f408h", DTN_DESTINATION: 'Laranja' },
    { DTN_ID: "2408mch", DTN_DESTINATION: 'Laranja' },
    { DTN_ID: "g0m5", DTN_DESTINATION: 'Laranja' },
    { DTN_ID: "bp048hc", DTN_DESTINATION: 'Laranja' },
    { DTN_ID: "094c3m5", DTN_DESTINATION: 'Laranja' },
    { DTN_ID: "89c25g", DTN_DESTINATION: 'Laranja' },
    { DTN_ID: "pgc9p4", DTN_DESTINATION: 'Laranja' },
    { DTN_ID: "938g5n", DTN_DESTINATION: 'Laranja' },
    { DTN_ID: "058hm85gc", DTN_DESTINATION: 'Laranja' },
    { DTN_ID: "f7od238", DTN_DESTINATION: 'Laranja' }
]);

app.listen(3000, () => console.log('listening at 3000'));

// Serve ao cliente tudo na pasta "public"
app.use(express.static('public'));

// Função que cria um endpoint "{baseUrl}/test", usada para testar, retorna todas as entradas da tabela
/*
app.get('/test', (req, res) => {
    TBA_DESTINATION.find((err, entry) => {
        res.send(entry);
        console.log(entry);
    })
}); */


function respond(entry, res) {
    if (entry != null) {
        res.json({
            status: "sucess",
            data: entry,
        });
    } else {
        res.json({
            status: "failed",
            data: []
        });
    }
}

function respondBigRequest(res) {
    res.status(400);
    res.send();
}

app.get('/destination', (req, res) => {
    let id = req.query.id;
    let destination = req.query.destination;
    console.log("GET/ id: " + id + " | destination: " + destination);


    if (id == "" && destination == "") {
        TBA_DESTINATION.find((err, entry) => {
            try {
                respond(entry, res);
            } catch (err) {
                console.log(err);
            }
        });
    } else if (id == "") {
        TBA_DESTINATION.find({ DTN_DESTINATION: destination }, (err, entry) => {
            try {
                respond(entry, res);
            } catch (err) {
                console.log(err);
            }
        });
    } else if (destination == "") {
        TBA_DESTINATION.find({ DTN_ID: id }, (err, entry) => {
            try {
                respond(entry, res);
            } catch (err) {
                console.log(err);
            }
        });
    } else {
        TBA_DESTINATION.find({ DTN_ID: id, DTN_DESTINATION: destination }, (err, entry) => {
            try {
                respond(entry, res);
            } catch (err) {
                console.log(err);
            }
        });
    }
});

// Requisição PUT, dependendo do conteúdo em body.add, esta executará uma adição ou uma atualização, no caso da adição, os parâmetros 
// serão especificados na URL e no corpo da requisição, no caso da atualização, apenas o ID é especificado na requisição, os valoers
// a serem alterados serão especificados no corpo da requisição
app.put('/destination/:id', (req, res) => {
    let id = req.params.id;
    let destination = req.body.dest;

    // As operações somente serão realizadas caso o ID e a DESTINATION estejam dentro dos limites de caracteres especificado
    if (id.length <= 20 && destination.length <= 10) {

        //Se true, é uma adição, se false, é uma atualização
        if (req.body.add) {
            console.log("PUT(add)/ id: " + id + " | destination: " + destination);

            TBA_DESTINATION.count({ DTN_ID: id }, function(err, count) {
                if (count > 0) {
                    try {
                        res.status(409);
                        res.send('Entry already exists');
                    } catch (err) {
                        console.log(err);
                        res.send('Unknown Error');
                    }
                } else {
                    TBA_DESTINATION.insertMany([{ DTN_ID: id, DTN_DESTINATION: destination }], (err) => {
                        try {
                            res.status(204);
                            res.send('Successfully added');
                        } catch (err) {
                            console.log(err);
                            res.send('Unknown Error');
                        }
                    });
                }
            });
        } else {
            let changeDestination = req.body.changeDestination;
            let changeId = req.body.changeId;
            console.log("PUT(edit)/ id: " + id + " | destination to be placed: " + changeDestination + " | id to be placed: " + changeId);

            // As operações somente serão realizadas caso o ID e a DESTINATION estejam dentro dos limites de caracteres especificado
            if (changeId.length <= 20 && changeDestination.length <= 10) {

                if (destination != "") {
                    TBA_DESTINATION.count({ DTN_ID: id }, function(err, count) {
                        if (changeId == "") {
                            changeId = id;
                        }
                        if (count > 0) {

                            TBA_DESTINATION.findOneAndUpdate({ DTN_ID: id }, { DTN_ID: changeId, DTN_DESTINATION: changeDestination }, (err, doc) => {
                                if (err) {
                                    res.status(409);
                                    res.send({ error: err });
                                } else {
                                    res.status(204);
                                    res.send('Succesfully edited.');
                                }
                            });

                        } else {
                            res.status(404);
                            res.send('Entry doesnt exists');
                        }
                    });
                } else {
                    res.status(422);
                    res.send('Destination field cannot be empty');
                }
            } else {
                respondBigRequest(res);
            }

        }

    } else {
        respondBigRequest(res);
    }


});

// Requisição DELETE, o ID especificado na requisição represente o ID da entrada a ser deletada"
app.delete('/destination/:id', (req, res) => {
    let id = req.params.id;
    console.log("DELETE/ id: " + id);
    TBA_DESTINATION.deleteOne({ DTN_ID: id }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.status(204)
            res.send(result);
        }
    });
});

// Requisição GET, retorna um download para o cliente com um arquivo .csv com todas as entradas na tabela"
app.get('/csv', (req, res) => {
    console.log("GET(CSV)");

    TBA_DESTINATION.find((err, entry) => {

        const csv = JSONtoCSV(entry, { fields: ["_id", "DTN_ID", "DTN_DESTINATION"] });
        FileSystem.writeFileSync("./myCSV.csv", csv);
        const file = `${__dirname}/myCSV.csv`;
        res.download(file);
    });
});