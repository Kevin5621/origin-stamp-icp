import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload, CheckCircle, AlertCircle, FileText } from "lucide-react";

/**
 * S3TestPanel Component
 *
 * Tests S3 integration by reading configuration from environment variables.
 * Requires the following environment variables in .env file:
 * - S3_ACCESS_KEY: S3/AWS access key
 * - S3_SECRET_KEY: S3/AWS secret key
 * - S3_REGION: S3 region (e.g., ap-southeast-1)
 * - S3_ENDPOINT: S3 endpoint URL (e.g., https://s3.csalab.dev/)
 * - S3_BUCKET_NAME: S3 bucket name (e.g., assets)
 */

interface TestResult {
  step: string;
  success: boolean;
  message: string;
  data?: any;
}

const S3TestPanel: React.FC = () => {
  const { t } = useTranslation("settings");
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Read S3 config from environment variables
  const s3Config = {
    bucket_name: process.env.S3_BUCKET_NAME || "",
    region: process.env.S3_REGION || "",
    access_key_id: process.env.S3_ACCESS_KEY || "",
    secret_access_key: process.env.S3_SECRET_KEY || "",
    endpoint: [process.env.S3_ENDPOINT || ""] as [] | [string], // Candid optional type
  };

  // Validation to ensure all required S3 config is present
  const isS3ConfigValid = () => {
    return (
      s3Config.bucket_name &&
      s3Config.region &&
      s3Config.access_key_id &&
      s3Config.secret_access_key &&
      s3Config.endpoint[0]
    );
  };

  const addTestResult = (
    step: string,
    success: boolean,
    message: string,
    data?: any,
  ) => {
    setTestResults((prev) => [...prev, { step, success, message, data }]);
  };

  const testS3Configuration = async () => {
    setIsTesting(true);
    setTestResults([]);

    // Check if S3 configuration is valid
    if (!isS3ConfigValid()) {
      addTestResult(
        "S3 Config Validation",
        false,
        "Missing S3 environment variables. Please check .env file for S3_ACCESS_KEY, S3_SECRET_KEY, S3_REGION, S3_ENDPOINT, and S3_BUCKET_NAME",
      );
      setIsTesting(false);
      return;
    }

    try {
      // Step 1: Test S3 Config Setup
      addTestResult(
        "S3 Config",
        true,
        "Using S3 configuration from environment variables",
      );

      // Step 2: Set S3 Config to Backend
      addTestResult(
        t("s3_test.backend_config"),
        true,
        t("s3_test.setting_config"),
      );

      // Import backend from declarations
      const { backend } = await import("../../../../declarations/backend");

      try {
        const configResult = await backend.set_s3_config(s3Config);
        if (configResult) {
          addTestResult(
            t("s3_test.backend_config"),
            true,
            "S3 configuration set successfully",
          );
        } else {
          addTestResult(
            t("s3_test.backend_config"),
            false,
            "Failed to set S3 configuration",
          );
          return;
        }
      } catch (error) {
        addTestResult(
          t("s3_test.backend_config"),
          false,
          `Error setting config: ${error}`,
        );
        return;
      }

      // Step 3: Verify S3 Config
      try {
        const isConfigured = await backend.get_s3_config_status();
        if (isConfigured) {
          addTestResult(
            t("s3_test.config_verify"),
            true,
            t("s3_test.config_verified"),
          );
        } else {
          addTestResult(
            t("s3_test.config_verify"),
            false,
            t("s3_test.config_not_found"),
          );
          return;
        }
      } catch (error) {
        addTestResult(
          t("s3_test.config_verify"),
          false,
          `Error verifying config: ${error}`,
        );
        return;
      }

      // Step 4: Create Test Session
      try {
        // First ensure user exists (using test user)
        const loginResult = await backend.register_user("testuser", "testpass");
        if (
          !loginResult.success &&
          !loginResult.message.includes("already exists")
        ) {
          addTestResult(
            t("s3_test.user_setup"),
            false,
            `Failed to setup user: ${loginResult.message}`,
          );
          return;
        }
        addTestResult(t("s3_test.user_setup"), true, t("s3_test.user_ready"));

        const sessionId = await backend.create_physical_art_session(
          "testuser",
          t("s3_test.test_artwork"),
          "Testing S3 upload functionality",
        );

        if (typeof sessionId === "object" && "Ok" in sessionId) {
          addTestResult(
            t("s3_test.session"),
            true,
            `${t("s3_test.session_created")}: ${sessionId.Ok}`,
          );

          // Step 5: Test File Upload if file selected
          if (selectedFile) {
            await testFileUpload(sessionId.Ok);
          } else {
            addTestResult(
              t("s3_test.file_upload"),
              true,
              "No file selected - skipping upload test",
            );
          }
        } else {
          addTestResult(
            t("s3_test.session"),
            false,
            `${t("s3_test.failed_to_create_session")}: ${sessionId}`,
          );
        }
      } catch (error) {
        addTestResult(
          t("s3_test.session"),
          false,
          `${t("s3_test.error_creating_session")}: ${error}`,
        );
      }
    } catch (error) {
      addTestResult(
        t("s3_test.test_error"),
        false,
        `Unexpected error: ${error}`,
      );
    } finally {
      setIsTesting(false);
    }
  };

  const testFileUpload = async (sessionId: string) => {
    if (!selectedFile) return;

    try {
      // Import backend
      const { backend } = await import("../../../../declarations/backend");

      // Step 5a: Generate presigned URL
      const uploadFileData = {
        filename: selectedFile.name,
        content_type: selectedFile.type,
        file_size: BigInt(selectedFile.size),
      };

      const urlResult = await backend.generate_upload_url(
        sessionId,
        uploadFileData,
      );

      if (typeof urlResult === "object" && "Ok" in urlResult) {
        const uploadUrl = urlResult.Ok;
        addTestResult(
          t("s3_test.presigned_url"),
          true,
          `URL generated: ${uploadUrl.substring(0, 50)}...`,
        );

        // Step 5b: Test direct S3 upload (simulate)
        try {
          // Create FormData for S3 upload
          const formData = new FormData();
          formData.append("file", selectedFile);

          // Try to upload to S3 (this might need CORS configuration)
          const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            body: selectedFile,
            headers: {
              "Content-Type": selectedFile.type,
            },
          });

          if (uploadResponse.ok) {
            addTestResult(
              "S3 Upload",
              true,
              `File uploaded successfully (${uploadResponse.status})`,
            );

            // Step 5c: Confirm upload to backend
            const confirmResult = await backend.upload_photo_to_session(
              sessionId,
              uploadUrl,
            );

            if (typeof confirmResult === "object" && "Ok" in confirmResult) {
              addTestResult(
                t("s3_test.upload_confirm"),
                true,
                t("s3_test.upload_confirmed"),
              );
            } else {
              addTestResult(
                t("s3_test.upload_confirm"),
                false,
                `Failed to confirm: ${confirmResult}`,
              );
            }
          } else {
            addTestResult(
              "S3 Upload",
              false,
              `Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`,
            );
          }
        } catch (uploadError) {
          addTestResult("S3 Upload", false, `Upload error: ${uploadError}`);
        }
      } else {
        addTestResult(
          t("s3_test.presigned_url"),
          false,
          `Failed to generate URL: ${urlResult}`,
        );
      }
    } catch (error) {
      addTestResult(
        t("s3_test.upload_process"),
        false,
        `Upload process error: ${error}`,
      );
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  return (
    <div className="s3-test-panel">
      <div className="test-header">
        <h3>S3 Upload Test Panel</h3>
        <p>Test S3 configuration and upload functionality</p>
      </div>

      <div className="test-config">
        <h4>S3 Configuration</h4>
        {isS3ConfigValid() ? (
          <div className="config-display">
            <div>
              <strong>Bucket:</strong> {s3Config.bucket_name}
            </div>
            <div>
              <strong>Region:</strong> {s3Config.region}
            </div>
            <div>
              <strong>Endpoint:</strong> {s3Config.endpoint[0]}
            </div>
            <div>
              <strong>Access Key:</strong>{" "}
              {s3Config.access_key_id.substring(0, 8)}...
            </div>
          </div>
        ) : (
          <div className="config-display error">
            <div>⚠️ Missing S3 environment variables in .env file</div>
            <div>
              Required: S3_ACCESS_KEY, S3_SECRET_KEY, S3_REGION, S3_ENDPOINT,
              S3_BUCKET_NAME
            </div>
          </div>
        )}
      </div>

      <div className="file-selector">
        <h4>Test File (Optional)</h4>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="file-input"
        />
        {selectedFile && (
          <div className="selected-file">
            <FileText size={16} />
            <span>
              {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </span>
          </div>
        )}
      </div>

      <div className="test-actions">
        <button
          onClick={testS3Configuration}
          disabled={isTesting || !isS3ConfigValid()}
          className="btn-test primary"
          title={
            !isS3ConfigValid()
              ? "S3 configuration is missing or incomplete"
              : ""
          }
        >
          {isTesting ? (
            <>
              <div className="loading-spinner small"></div>
              Testing...
            </>
          ) : (
            <>
              <Upload size={16} />
              Run S3 Test
            </>
          )}
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="test-results">
          <h4>Test Results</h4>
          <div className="results-list">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`result-item ${result.success ? "success" : "error"}`}
              >
                <div className="result-icon">
                  {result.success ? (
                    <CheckCircle size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                </div>
                <div className="result-content">
                  <div className="result-step">{result.step}</div>
                  <div className="result-message">{result.message}</div>
                  {result.data && (
                    <pre className="result-data">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default S3TestPanel;
