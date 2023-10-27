import React, { useState, useEffect } from "react";
import Sidebar from "../sideBar/sidebar";
import { MergePdfApi } from "../api/pdfFunctionApi";
import {Form, Button, Spinner} from 'react-bootstrap';
import { toast } from "react-toastify";
const MergePdf = () => {

    const [uploadedfile, setFile] = useState({})
    const [uploadedfile2, setFile2] = useState({})
    const [downloadLink, setDownloadLink] = useState("")
    const [spin, setSpin] = useState(false);
    // useEffect(() => {

    // },[])

    const uploadPdfFile = async () => {
        setSpin(true);
        let pdf = new FormData();
        if(uploadedfile[0] && uploadedfile2[0]){
            pdf.append("file", uploadedfile[0]);
            pdf.append("file2", uploadedfile2[0]);
            let api = await MergePdfApi(pdf);
            console.log("-----api-----", api);
            if(api.success){
                setDownloadLink(api.downloadLink);
                setSpin(false)
                toast.success('Download link is available', {
                    // position: "top-right",
                    // autoClose: 5000,
                    // hideProgressBar: false,
                    // closeOnClick: true,
                    // pauseOnHover: true,
                    // draggable: true,
                    // progress: undefined,
                    // theme: "light",
                    });
            } else {
                setSpin(false);
                toast.error(api.message, {
                    // position: "top-right",
                    // autoClose: 5000,
                    // hideProgressBar: false,
                    // closeOnClick: true,
                    // pauseOnHover: true,
                    // draggable: true,
                    // progress: undefined,
                    // theme: "light",
                    });
            }   
        } else {
            setSpin(false);
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
                    <Form.Label>Upload 1st Pdf File</Form.Label>
                    <Form.Control 
                        type="file"
                        accept=".pdf" 
                        onChange={(e) => setFile(e.target.files)}
                    />
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Upload 2nd Pdf File</Form.Label>
                    <Form.Control 
                        type="file"
                        accept=".pdf" 
                        onChange={(e) => setFile2(e.target.files)}
                    />
                </Form.Group>
                <Button 
                    type="button" 
                    onClick={uploadPdfFile}
                    disabled={spin}

                    >Merge {spin?
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

export default MergePdf;