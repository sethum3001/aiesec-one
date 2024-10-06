// src/app/members/ImportMembersModal.tsx
import { Modal, Box, Button } from "@mantine/core";
import React, { useState } from "react";
import Papa from "papaparse";

type ImportMembersModalProps = {
  opened: boolean;
  onClose: () => void;
};

const ImportMembersModal: React.FC<ImportMembersModalProps> = ({
  opened,
  onClose
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const acceptableFileTypes =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (file) {
      setUploadedFile(file);
      parseCSVFile(file); // Assuming this function exists
    }
  };

  const downloadFile = () => {
    if (uploadedFile) {
      const downloadUrl = URL.createObjectURL(uploadedFile);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = uploadedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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
      }
    });
  };

  return (
    <Modal size={"55rem"} opened={opened} onClose={onClose} withCloseButton={false} centered>
      <Box>
        <div
          style={{
            backgroundColor: "#1C7ED6",
            height: 60,
            border: "none",
            marginTop: -20,
            marginRight: -20,
            marginLeft: -20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            color: "#fff",
            fontSize: "18px",
            fontWeight: "bold"
          }}
        >
          Import Members
        </div>

        <div style={{ height: 400 }}>
          <div
            style={{
              margin: "20px 50px",
              height: 325,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              border: "2px dashed grey"
            }}
          >
            <h1 style={{ margin: "50px 0", color: "grey" }}>Upload CSV File</h1>
            <input
              type="file"
              name="file"
              accept={acceptableFileTypes}
              onChange={handleFileChange}
            />
            <p style={{ color: "grey" }}>Supported file types: CSV, Excel (.xlsx, .xls)</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ marginLeft: "50px" }}>
              <span style={{ fontSize: "14px" }}>Download the Template: </span>
              <Button
                onClick={downloadFile}
                style={{
                  height: "34px",
                  fontSize: "14px",
                  marginLeft: "10px",
                  fontWeight: 300
                }}
              >
                Download
              </Button>
            </div>

            <div style={{ marginRight: "50px" }}>
              <Button
                onClick={onClose}
                variant="outline"
                style={{
                  height: "34px",
                  fontSize: "14px",
                  marginRight: "20px",
                  fontWeight: 300
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => parseCSVFile(uploadedFile!)}
                style={{
                  height: "34px",
                  fontSize: "14px",
                  marginLeft: "20px",
                  fontWeight: 300
                }}
              >
                Import
              </Button>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ImportMembersModal;
