import React, {useEffect, useState} from "react";
import ViewPdfs from "./viewPdf";
import PdfController from "./viewPdfController";
import { Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { SpiltPdfApi } from "../api/pdfFunctionApi";
import { toast } from "react-toastify";
const ViewPdf = () => {

    const [spin, setSpin] = useState(false);
    const [pdfDetails, setPdfDetails] = useState({
        totalPages: 0,
        splitData: [{
            from: 0,
            to: 0
        }]
    })
    const [fillAddress, setFillAddress] = useState('');
    const [uploadedfile, setFile] = useState({})
    const [downloadLink, setDownloadLink] = useState("")

    const updatePdfDetails = (data) => {
        let d = {...pdfDetails}
        d[data.name] = data.value;
        setPdfDetails(d);
    }

    const getPageNumber = (data) => {
        console.log(data);
        let d = {...pdfDetails}
        if(d.totalPages == 0){
            d.totalPages = data;
            d.splitData[0] = {
                from: 1,
                to: data
            }
            setPdfDetails(d);
        }
    }

    const spiltDataapi = async () => {
        setSpin(true);
        let pdf = new FormData();
        pdf.append("file", uploadedfile[0]);
        pdf.append("info", JSON.stringify(pdfDetails));
        let api = await SpiltPdfApi(pdf);
        if(api.success){
            setSpin(false);
            toast.success(api.message)
            fetch(api.downloadLink).then(response => {
                response.blob().then(blob => {
                    // Creating new object of PDF file
                    const fileURL = window.URL.createObjectURL(blob);
                    // Setting various property values
                    let alink = document.createElement('a');
                    alink.href = fileURL;
                    alink.download = api.downloadLink;
                    alink.click();
                })
            });

            toast.success("file is downloaded")

        } else {
            setSpin(false);
            toast.error(api.message)
        }
    } 

    return(<>
        <div className="" style={{
                height: "100%", 
                display: "flex" 
            }}>
            <div className="main_body" style={{
                flex: "auto", 
                padding: "10px",
                overflowY: "auto",
                overflowX: "clip"
            }}>

                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Upload Pdf File</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".pdf"
                                onChange={(e) => {
                                    setPdfDetails({
                                        totalPages: 0,
                                        splitData: [{
                                            from: 0,
                                            to: 0
                                        }]
                                    })
                                    setFile(e.target.files)
                                }} 
                            />
                        </Form.Group>
                        {
                            downloadLink?
                            <Button 
                                style={{marginLeft: "20px"}}
                                // onClick={downloadfile}
                                
                            >Download</Button>
                            :null
                        }
                    </Col>
                </Row>
                {
                    Object.keys(uploadedfile).length ? pdfDetails.splitData.map((e, index) => {
                        return (
                            <ViewPdfs 
                                pdf={uploadedfile} 
                                PageNumber={getPageNumber}
                                fromto={e}
                                idx = {index+1}
                            />
                        )
                    }):null
                }

                
            </div>
            <div className="rigth_side_bar" style={{float: "right", height: "100%"}}>
                {
                    pdfDetails.totalPages ?
                    <PdfController 
                        PdfDetails={updatePdfDetails} 
                        currentDetails={pdfDetails} 
                        spins = {spin}
                        action={spiltDataapi}
                    />:null
                }
                
            </div>
            
            
        </div>
    </>)

}

export default ViewPdf;