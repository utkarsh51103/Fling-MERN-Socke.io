// apiclient.js
import axios from "axios";

const apiclient = axios.create({
    baseURL: "http://localhost:5001",
});

console.log("Base Url:", apiclient.defaults.baseURL);


export default apiclient;