import React from "react";
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import CsvToPdf from "../pages/CsvToPdf";
import MergePdf from "../pages/mergePdf";
import SplitPdf from "../pages/splitPdf";
import "../assets/index.css";

const PdfRouter = () => {
    return(<>
        <Routes>
            <Route path="/convert-to-pdf" element={<CsvToPdf />} />
            <Route path="/split-pdf" element={<SplitPdf />} />
            <Route path="/merge-pdf" element={<MergePdf />} />
        </Routes>
    </>)
}

export default PdfRouter;