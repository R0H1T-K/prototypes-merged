import React, {useEffect, useState} from "react";
import Sidebar from "../sideBar/sidebar";
import {Form, Button, Spinner} from 'react-bootstrap';
import { ConvertCsvToPdf } from "../api/pdfFunctionApi";
import { toast } from "react-toastify";
const CsvToPdf = () => {
    const [uploadedfile, setFile] = useState({})
    const [downloadLink, setDownloadLink] = useState("")
    const [spin, setSpin] = useState(false);
    useEffect(() => {

    },[])

    const CsvPdf = async () => {
        let CSV = new FormData();
        console.log(uploadedfile[0])
        if(uploadedfile[0]){
            CSV.append("file", uploadedfile[0]);
            let api = await ConvertCsvToPdf(CSV);
            if(api.success){
                setDownloadLink(api.downloadLink);
                setSpin(false)
                toast.success('Download link is available');
            } else {
                toast.error(api.message);
                setSpin(false)
            }   
        } else {
            setSpin(false)
            toast.error("All field is required");
        }

    }

    const downloadfile = async () => {
        fetch(downloadLink).then(response => {
            response.blob().then(blob => {
                // Creating new object of PDF file
                const fileURL = window.URL.createObjectURL(blob);
                // Setting various property values
                let alink = document.createElement('a');
                alink.href = fileURL;
                alink.download = downloadLink;
                alink.click();
            })
        })
    }

    return(<>
        <div className="pdf-container">
            <div className="sidebar-body"><Sidebar /></div>
            <div className="main-body">
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Upload Csv File</Form.Label>
                    <Form.Control 
                        type="file"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files)} 
                    />
                </Form.Group>

                <Button 
                    type="button" 
                    onClick={CsvPdf}
                    disabled={spin}

                    >Convert {spin?
                                <Spinner animation="border" size="sm" variant="light" />:null
                            }</Button>
                {
                    downloadLink?
                    <Button 
                        style={{marginLeft: "20px"}}
                        onClick={downloadfile}
                        
                    >Download</Button>
                    :null
                }
            </div>
        </div>
    </>)
}

export default CsvToPdf;