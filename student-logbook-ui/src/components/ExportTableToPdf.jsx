// components/ExportTableToPDF.js
import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const ExportTableToPDF = () => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/export-pdf", {
        responseType: "blob", // Very important to get binary data
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "logbook-report.pdf");
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`btn-secondary text-white px-4 py-2 rounded shadow mb-4 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? "Downloading..." : "Export as PDF"}
    </button>
  );
};

export default ExportTableToPDF;
