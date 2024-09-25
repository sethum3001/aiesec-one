"use client";

import React from "react";
import Papa from "papaparse";

import { useEffect, useState } from "react";

const acceptableFileTypes =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv";

const Members: React.FC = () => {
  const [message, setMessage] = useState("");

  // Function to send API request with EXPA IDs
  const sendAPIRequest = async (expaIds: string[]) => {
    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ expaIds })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API response:", data);
        // Handle API response as needed
      } else {
        throw new Error("Failed to send API request: " + response.status);
      }
    } catch (error) {
      console.error("API request failed:", error);
      // Handle error gracefully
    }
  };

  //Parse CSV
  const parseCSVFile = (file: File) => {
    Papa.parse(file, {
      skipEmptyLines: true,
      header: true,
      error: function (error) {
        console.error("CSV parsing error:", error);
      },

      complete: function (results) {
        console.log("Finished parsing CSV:", results.data);
        const expaIds = results.data
          .map((row) => row.expa_id)
          .filter((id) => id);
        console.log("EXPA IDs extracted from CSV:", expaIds);

        // Send API request with extracted EXPA IDs
        if (expaIds.length > 0) {
          sendAPIRequest(expaIds);
          console.log("send request worked");
        } else {
          console.warn("No EXPA IDs found in CSV");
        }
      }
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      parseCSVFile(file);
    }
  };

  return (
    <div>
      <h1>Upload CSV File</h1>
      <input
        type="file"
        name="file"
        accept={acceptableFileTypes}
        onChange={handleFileChange}
      />
      <p>Supported file types: CSV, Excel (.xlsx, .xls)</p>
    </div>
  );
};

export default Members;
