import React, { useEffect, useState } from "react";
import {
  FaSearchMinus,
  FaSearchPlus,
  FaTimes,
} from "react-icons/fa";
import "./EvidencePreviewModal.css";

const EvidencePreviewModal = ({ file, onClose }) => {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setZoom(1);
  }, [file?.id]);

  if (!file) {
    return null;
  }

  const changeZoom = (step) => {
    setZoom((currentZoom) => {
      const nextZoom = Math.round((currentZoom + step) * 10) / 10;
      return Math.min(3, Math.max(0.5, nextZoom));
    });
  };

  return (
    <div className="evidence-preview-overlay" role="dialog" aria-modal="true">
      <div className="evidence-preview-toolbar">
        <button type="button" onClick={() => changeZoom(-0.2)} aria-label="Zoom out">
          <FaSearchMinus />
        </button>
        <span>{Math.round(zoom * 100)}%</span>
        <button type="button" onClick={() => changeZoom(0.2)} aria-label="Zoom in">
          <FaSearchPlus />
        </button>
        <button type="button" onClick={onClose} aria-label="Close preview">
          <FaTimes />
        </button>
      </div>

      <div className="evidence-preview-stage" onClick={onClose}>
        <img
          src={file.downloadUrl}
          alt={file.fileName}
          style={{ transform: `scale(${zoom})` }}
          onClick={(event) => event.stopPropagation()}
        />
      </div>
    </div>
  );
};

export default EvidencePreviewModal;
