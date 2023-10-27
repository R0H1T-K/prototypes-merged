import React from "react";
import Sidebar from "../sideBar/sidebar";
import ViewPdf from "../modules";
import { toast } from "react-toastify";
const SplitPdf = () => {
    return(<>
        <div className="pdf-container">
            <div className="sidebar-body"><Sidebar /></div>
            <div className="main-body">

                <ViewPdf />

            </div>
        </div>
    </>)
}

export default SplitPdf;