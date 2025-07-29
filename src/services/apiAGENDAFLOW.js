const { default: axios } = require("axios");

const apiAGENDAFLOW = axios.create({
    baseURL: 'http://localhost:3001'
})

export default apiAGENDAFLOW