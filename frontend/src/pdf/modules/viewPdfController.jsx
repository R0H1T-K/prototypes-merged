import React, {useEffect, useState} from "react";
import {
    Tabs, 
    Tab, 
    InputGroup, 
    Row, 
    Col, 
    Button, 
    CloseButton, 
    Form,
    Spinner
} from "react-bootstrap"
const PdfController = (props) => {

    const [numberOfSplit, setnumberOfSplit] = useState([
        {
            from: 1,
            to: 1
        }
    ]);

    useEffect(()=>{
        setnumberOfSplit([
            {
                from: 1,
                to: props.currentDetails.totalPages
            }
        ])
    },[props.currentDetails.totalPages])

    const addSlot = () => {
        let slot = [...numberOfSplit];
        if(slot.length < 10){
            
            let limit = props.currentDetails.splitData[props.currentDetails.splitData.length-1].to;

            if(props.currentDetails.totalPages > limit){
                slot.push({
                    from: Number(limit)+1,
                    to: Number(props.currentDetails.totalPages)
                });
            } else {
                slot.push({
                    from: Number(props.currentDetails.totalPages),
                    to: Number(props.currentDetails.totalPages)
                });
            }

            setnumberOfSplit(slot);
            props.PdfDetails({name: "splitData", value: slot})
        }
    }

    const removeSlot = (index) => {
        let slot = [...numberOfSplit];
        slot.splice(index, 1);
        setnumberOfSplit(slot);
        props.PdfDetails({name: "splitData", value: slot})
    }

    const  handleChanges = (data) => {
        let d = [...numberOfSplit];
        // {value: event.target.value, oldData: data, index: index, name: ""}
        if(d[data.index].from >= 1 && d[data.index].to <= props.currentDetails.totalPages){
            d[data.index][data.name] = data.value;
            setnumberOfSplit(d);
            props.PdfDetails({name: "splitData", value: d})
        }

    }

    const numberCard = (data, index) => {
        return (
            <>

                <Row>
                    <Col>
                        Range: {index+1}
                        {
                            index ?
                            <CloseButton
                                style={{
                                    float: "right",
                                    fontSize: "13px",
                                    backgroundColor: "#d3d3d3"
                                }}
                                onClick={() => removeSlot(index)}
                            />:null
                        }
                        

                    </Col>
                </Row>

                <Row>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>from</InputGroup.Text>
                            <input 
                                className="form-control" 
                                type="number" 
                                min={1} 
                                value={data.from} 
                                onChange={(event)=>handleChanges({value: event.target.value, oldData: data, index: index, name: "from"})}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>to</InputGroup.Text>
                            <input 
                                className="form-control" 
                                type="number" 
                                min={data.from} 
                                value={data.to} 
                                onChange={(event)=>handleChanges({value: event.target.value, oldData: data, index: index, name: "to"})}
                            />
                        </InputGroup>
                    </Col>
                </Row>

            </>
        )
    }

    return(<>
        <div className="d-flex flex-column flex-shrink-0 bg-light" style={{width: "300px", height: "100%"}}>
            <div style={{
                maxHeight: "72vh",
                overflowY: "auto",
                overflowX: "clip",
                width: "100%"
            }}>
                <div 
                    className="d-flex align-items-center mb-3 mb-md-0  link-dark text-decoration-none"
                    style={{
                        justifyContent: "center"
                    }}
                >
                    {/* <svg className="bi me-2" width="40" height="32"><use xlink:href="#bootstrap"></use></svg> */}
                    <span className="fs-4">Split</span>
                </div>
                <hr />

                <div style={{
                    marginLeft: "12px"
                }}>
                    Custom mode:

                    {/* <Tabs
                        defaultActiveKey="Custom"
                        id="justify-tab-example"
                        className="mb-3"
                        justify
                    > */}
                        {/* <Tab eventKey="Custom" title="Custom"> */}
                            {
                                numberOfSplit.map((e, index) => {
                                    return numberCard(e, index);
                                })
                                
                            }
                            {
                                numberOfSplit.length < 10 ?
                                <Row>
                                    <Col>
                                        <Button 
                                            variant="outline-primary" 
                                            style={{width: "100%"}}
                                            onClick={addSlot}
                                            >Add Range</Button>
                                    </Col>
                                </Row>:null
                            }

                            <Row>
                                <Col style={{
                                    marginTop: "12px",
                                    marginBottom: "20px"
                                }}>
                                    <Form.Check // prettier-ignore
                                        type='checkbox'
                                        label="Merge all ranges in one PDF file."
                                    />
                                </Col>
                            </Row>
                            
                        {/* </Tab> */}
                        {/* <Tab eventKey="Fixed" title="Fixed">
                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                <Form.Label column sm="8">
                                    Split into page ranges of: 
                                </Form.Label>
                                <Col sm="4">
                                <Form.Control type="number" min={1} />
                                </Col>
                            </Form.Group>
                        </Tab> */}
                    {/* </Tabs> */}
                </div>
            </div>
            
            <Button 
                variant="primary" 
                size="lg" 
                style={{width: "100%", margin: "6px"}}
                onClick={props.action}
                >Split PDF {props.spins?
                    <Spinner animation="border" size="sm" variant="light" />:null
                }</Button>
        </div>
    </>)

}

export default PdfController;