import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

var url = "https://en.wikipedia.org/w/api.php"; 

var params = {
    action: "query",
    prop: "images",
    titles: "Albert Einstein",
    format: "json"
};

url = url + "?origin=*";
Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

fetch(url)
    .then(function(response){return response.json();})
    .then(function(response) {
        var pages = response.query.pages;
        for (var page in pages) {
            for (var img of pages[page].images) {
                console.log(img.title);
            }
        }
    })
    .catch(function(error){console.log(error);});