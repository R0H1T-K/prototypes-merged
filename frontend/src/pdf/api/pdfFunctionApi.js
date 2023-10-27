import BaseApi from "./baseApi";

const ConvertCsvToPdf = async (data) => {
    return await BaseApi({
        url: `/convertCsvToPdf`,
        data: data,
        method: "post"
    });
}

const MergePdfApi = async (data) => {
    return await BaseApi({
        url: `/mergePdf`,
        data: data,
        method: "post"
    });
}

const SpiltPdfApi = async (data) => {
    return await BaseApi({
        url: `/spiltPdf`,
        data: data,
        method: "post"
    })
}

export {
    ConvertCsvToPdf,
    MergePdfApi,
    SpiltPdfApi
}