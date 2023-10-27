import axios from "axios";

const BaseApi = async (options) => {
    let authHeader = "";

    const client = axios.create({
        baseURL: "http://66.235.194.119:6974/pdf/",
        headers: {authorization: authHeader}
    });

    return client(options)
    .then(response => {
        return response.data
    })

}


export default BaseApi;