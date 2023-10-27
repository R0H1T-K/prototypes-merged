const PDFApi = require('@ilovepdf/ilovepdf-nodejs');
const myPdf = new PDFApi(process.env.PDF_PUBLIC_KEY, process.env.PDF_SECRET_KEY)
const fs = require("fs");
const path = require("path");
const CsvConverter = require("csv-converter-to-pdf-and-html")

class PdfController {
    async convertCsvToPdf (req, res) {
        console.log("csv")
        const converter = new CsvConverter()
        console.log(req.files.file)

        // if(req.files.file.mimetype === "application/pdf"){
        if(req.files.file.mimetype === "text/csv"){
            console.log(req.files.file)
            const fileStr = req.files.file.data;
            const currentTime = new Date().getTime();
            const fileName = req.files.file.name;
            const fileNameWithTime = currentTime+"_"+fileName.replace(/[^a-zA-Z \.]/g, "");
            const fileNameWithTime2 = currentTime+"_";

            fs.writeFile(
                process.cwd() + "/public/" + fileNameWithTime,
                fileStr,
                async function (err) {
                    if(err) {
                        res.send({
                            success: false,
                            message: "something went wrong ,please try again later",
                        });
                    } else {
                        const fileNameWithTime = currentTime + "_" + fileName.replace(/[^a-zA-Z \.]/g, "");
                        const filePath = path.resolve(process.cwd() + "/public/" + fileNameWithTime)
                        const destinationPath = path.resolve(process.cwd() + "/public/" + fileNameWithTime2+"converted.pdf")
                        converter.PDFConverter(filePath, destinationPath).then(e => {
                            console.log("----------- e =------------")
                            res.send({
                                success: true,
                                downloadLink: `${process.env.SERVER}${fileNameWithTime2}converted.pdf`,
                                message: "download link is ready",
                            });
                        }).catch(err => {
                            res.send({
                                success: false,
                                message: "something went wrong ,please try again later",
                            });
                        })
                        return ;
                    }
                }
            )
            return ;
        }
    }

    async spiltPdf(req, res) {
        let data = JSON.parse(req.body.info);
        
        if(
            req.files.file.mimetype === "application/pdf"
        ){

            const fileStr = req.files.file.data;
            const currentTime = new Date().getTime();
            const fileName = req.files.file.name;
            const fileNameWithTime = currentTime+".pdf";

            await fs.writeFile(
                process.cwd() + "/public/" + fileNameWithTime,
                fileStr,
                async function (err) {
                    if(err) {
                        res.send({
                            success: false,
                            message: "something went wrong ,please try again later",
                        });
                    } else {
                        const fileNameWithTime = currentTime + "_" + fileName.replace(/[^a-zA-Z \.]/g, ""); 
                    }
                    return ;
                }
            );

            let a = []
            a = (data.splitData.map(e => e.from+"-"+e.to)).toString();

            const task = await myPdf.newTask('split');
            task.start()
                .then(() => {
                    console.log("split 0")
                    // return task.addFile(`https://www.just.edu.jo/~mqais/CIS99/PDF/Ch.01_Introduction_%20to_computers.pdf`)
                    return task.addFile(`${process.env.SERVER}${fileNameWithTime}`)
                    // return task.addFile('path/to/file1_name.pdf');
                })
                .then(() => {
                    console.log("split 1")
                    return task.process({ ranges: a });
                    // return task.process({ fixed_range: 2 });
                })
                .then(() => {
                    console.log("split 2")
                    return task.download();
                })
                .then((data) => {
                    console.log("split 3")
                    fs.writeFileSync(`${process.cwd()}/public/${fileNameWithTime}_splited_file.zip`, data);
                    res.send({
                        success: true,
                        downloadLink: `${process.env.SERVER}${fileNameWithTime}_splited_file.zip`,
                        message: "download link is ready",
                    });
                });
        } else {
            res.send({
                success: false,
                // error: err,
                message: "Only accept .pdf file",
            });  
        }
        return;
    }

    async mergePdf(req, res) {
        console.log("merge pdf");
        console.log(req.files.file.name);

        if(
            req.files.file.mimetype === "application/pdf" ||
            req.files.file2.mimetype === "application/pdf"
        ){
            // if(req.files.file.mimetype === "text/csv"){
            const fileStr = req.files.file.data;
            const currentTime = new Date().getTime();
            const fileName = req.files.file.name;
            const fileNameWithTime = currentTime+"_"+fileName.replace(/[^a-zA-Z \.]/g, "");

            await fs.writeFile(
                process.cwd() + "/public/" + fileNameWithTime,
                fileStr,
                async function (err) {
                    if(err) {
                        res.send({
                            success: false,
                            message: "something went wrong ,please try again later",
                        });
                    } else {
                        const fileNameWithTime = currentTime + "_" + fileName.replace(/[^a-zA-Z \.]/g, ""); 
                    }
                    return ;
                }
            );

            
            const fileStr2 = req.files.file2.data;
            const currentTime2 = new Date().getTime();
            const fileName2 = req.files.file2.name;
            const fileNameWithTime2 = currentTime2+"_"+fileName2.replace(/[^a-zA-Z \.]/g, "");

            await fs.writeFile(
                process.cwd() + "/public/" + fileNameWithTime2,
                fileStr2,
                async function (err) {
                    if(err) {
                        res.send({
                            success: false,
                            message: "something went wrong ,please try again later",
                        });
                    } else {
                        const fileNameWithTime = currentTime + "_" + fileName.replace(/[^a-zA-Z \.]/g, "");
                    }
                    return ;
                }
            );

            const task = await myPdf.newTask('merge');
            // const task = await myPdf.newTask('split');
                    task.start()
                    .then(() => {
                        console.log("stap 0")
                        return task.addFile(`${process.env.SERVER}${fileNameWithTime}`)
                        // return task.addFile(`https://www.just.edu.jo/~mqais/CIS99/PDF/Ch.01_Introduction_%20to_computers.pdf`)
                    })
                    .then(() => {
                        console.log("stap 1")
                        return task.addFile(`${process.env.SERVER}${fileNameWithTime2}`)
                        // return task.addFile(`https://www.just.edu.jo/~mqais/CIS99/PDF/Ch.01_Introduction_%20to_computers.pdf`)
                    })
                    .then(() => {
                        console.log("stap 2")
                        return task.process();
                    })
                    .then(() => {
                        console.log("stap 3")
                        return task.download();
                    })
                    .then((data) => {
                        console.log("we r on last stap")
                        fs.writeFileSync(`${process.cwd()}/public/${"merge_"+fileNameWithTime}`, data)
                        res.send({
                            success: true,
                            downloadLink: `${process.env.SERVER}${"merge_"+fileNameWithTime}`,
                            message: "download link is ready",
                        });
                    })
                    .catch(err => {
                        res.send({
                            success: false,
                            error: err,
                            message: "something went wrong ,please try again later",
                        });
                    })

        } else {
            res.send({
                success: false,
                // error: err,
                message: "Only accept .pdf file",
            });  
        }

    }
}

module.exports = new PdfController();