import React from "react";
import { Link, useLocation } from "react-router-dom";
const Sidebar = () => {

    const location = useLocation();

    return (<>
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{width: "280px", height: "100%"}}>
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                {/* <svg className="bi me-2" width="40" height="32"><use xlink:href="#bootstrap"></use></svg> */}
                <span className="fs-4">PDF</span>
            </a>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <Link 
                        className={`nav-link ${
                            location.pathname === "/convert-to-pdf"?"active":""
                        }`} 
                        to="/convert-to-pdf"
                    >Convert Csv To Pdf</Link>
                </li>
                <li>
                    <Link className={`nav-link ${
                            location.pathname === "/split-pdf"?"active":""
                        }`} to="/split-pdf" >Split Pdf</Link>
                </li>
                <li>
                    <Link className={`nav-link ${
                            location.pathname === "/merge-pdf"?"active":""
                        }`} to="/merge-pdf">Merge Pdf</Link>
                </li>
            </ul>
        </div>
    </>)
}

export default Sidebar