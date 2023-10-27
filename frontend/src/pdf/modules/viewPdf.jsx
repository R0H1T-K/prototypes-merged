import React, {useEffect, useState} from "react";
import {Form, Button, Spinner, Row, Col} from 'react-bootstrap';
import { jsPDF } from "jspdf";
import {  pdfjs, Document, Page } from "react-pdf"
import '@react-pdf-viewer/core/lib/styles/index.css';
const ViewPdfs = (props) => {

    const doc = new jsPDF();
    const [pdfLink, setPdfLink] = useState("");
    const [url, setUrl] = useState('');

    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState();
    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
            'pdfjs-dist/build/pdf.worker.min.js',
            import.meta.url,
          ).toString();

        props.pdf && props.pdf.length > 0 && setPdfLink(URL.createObjectURL(props.pdf[0]))
    },[props.pdf])

    useEffect(() => {
    },[props.fromto])

    const onDocumentLoadSucess = ({numPages}) => {
        setNumPages(numPages);
        props.PageNumber(numPages);
    }
    return(
        <>
        <Row style={{
            textAlign: "center"
        }}>
            <Col>
                Range {props.idx}
            </Col>
        </Row>
        <Row>
            <Col>
                <div style={{paddingLeft:"20%", paddingRight: "20%"}}>
                    <div className="view_pdf">
                        <Document
                            file={pdfLink} 
                            // options={{ workerSrc: "/pdf.worker.js" }}
                            onLoadSuccess={onDocumentLoadSucess}
                        >
                            <Page pageNumber={Number(props.fromto.from)} width={"200"} />
                        </Document>
                    </div>
                    {
                        props.fromto.from !== props.fromto.to ?
                        <>
                            
                            <div className="view_pdf">
                                <Document
                                    file={pdfLink} 
                                    // options={{ workerSrc: "/pdf.worker.js" }}
                                    onLoadSuccess={onDocumentLoadSucess}
                                >
                                    <Page pageNumber={ Number(props.fromto.to)} width={"200"} />
                                </Document>
                            </div>

                        </>:null
                    }
                </div>
            </Col>
        </Row>

        </>
    )

}

export default ViewPdfs;