


import CryptoJS from "crypto-js";
import axios from "axios";

const API_KEY = "TtsnymqBhk7WtEBgXhEbj9lRnsxKJjDo8ELyZmBrnc3L487Glj2ikQTM5jxC34m8GvHUMjLRwftfx8ZBglUbg"
const API_SECRET = "tIBOTy2G7Rf7dekFuW9KFNDhg8WdywIuAPoRIWNZny72tRrgR8tOOTrhirleYuwTn6YvAJO1SwrGppFxOVDA"

const client = new Spot(API_KEY, API_SECRET);

// const spotTradingSymbol = await client.spotTradingSymbols({ symbol });
// const queryAssets = await client.queryAssets();
const symbolPriceTicker = await client.symbolPriceTicker({ symbol });


console.log(symbolPriceTicker)