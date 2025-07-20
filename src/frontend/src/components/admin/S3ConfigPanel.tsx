import React, { useState, useEffect } from "react";
import { Settings, Save, AlertCircle, CheckCircle } from "lucide-react";
import PhysicalArtService from "../../services/physicalArtService";

interface S3ConfigFormData {
  bucket_name: string;
  region: string;
  access_key_id: string;
  secret_access_key: string;
  endpoint?: string;
}

const S3ConfigPanel: React.FC = () => {
  const [config, setConfig] = useState<S3ConfigFormData>({
    bucket_name: "",
    region: "",
    access_key_id: "",
    secret_access_key: "",
    endpoint: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    try {
      const configured = await PhysicalArtService.isS3Configured();
      setIsConfigured(configured);
    } catch (error) {
      console.error("Failed to check S3 configuration:", error);
      setIsConfigured(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const success = await PhysicalArtService.setS3Config({
        bucket_name: config.bucket_name.trim(),
        region: config.region.trim(),
        access_key_id: config.access_key_id.trim(),
        secret_access_key: config.secret_access_key.trim(),
        endpoint: config.endpoint?.trim() || undefined,
      });

      if (success) {
        setMessage({
          type: "success",
          text: "S3 configuration saved successfully!",
        });
        setIsConfigured(true);
      } else {
        setMessage({ type: "error", text: "Failed to save S3 configuration." });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to save configuration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="s3-config-panel">
      <div className="config-header">
        <div className="header-content">
          <Settings size={24} />
          <div>
            <h2>S3 Storage Configuration</h2>
            <p>Configure S3 storage for physical art photo uploads</p>
          </div>
        </div>

        {isConfigured !== null && (
          <div
            className={`status-indicator ${isConfigured ? "configured" : "not-configured"}`}
          >
            {isConfigured ? (
              <>
                <CheckCircle size={16} />
                <span>Configured</span>
              </>
            ) : (
              <>
                <AlertCircle size={16} />
                <span>Not Configured</span>
              </>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="config-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="bucket_name" className="form-label">
              Bucket Name *
            </label>
            <input
              id="bucket_name"
              name="bucket_name"
              type="text"
              value={config.bucket_name}
              onChange={handleInputChange}
              placeholder="my-artwork-bucket"
              className="form-input"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="region" className="form-label">
              Region *
            </label>
            <input
              id="region"
              name="region"
              type="text"
              value={config.region}
              onChange={handleInputChange}
              placeholder="us-east-1"
              className="form-input"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="access_key_id" className="form-label">
              Access Key ID *
            </label>
            <input
              id="access_key_id"
              name="access_key_id"
              type="text"
              value={config.access_key_id}
              onChange={handleInputChange}
              placeholder="AKIAIOSFODNN7EXAMPLE"
              className="form-input"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="secret_access_key" className="form-label">
              Secret Access Key *
            </label>
            <input
              id="secret_access_key"
              name="secret_access_key"
              type="password"
              value={config.secret_access_key}
              onChange={handleInputChange}
              placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
              className="form-input"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="endpoint" className="form-label">
              Custom Endpoint (Optional)
            </label>
            <input
              id="endpoint"
              name="endpoint"
              type="url"
              value={config.endpoint}
              onChange={handleInputChange}
              placeholder="https://s3.custom-provider.com"
              className="form-input"
              disabled={isLoading}
            />
            <p className="form-help">
              Leave empty for AWS S3. Use for S3-compatible services.
            </p>
          </div>
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.type === "success" ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-save wireframe-button primary"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner small"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Configuration
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default S3ConfigPanel;
