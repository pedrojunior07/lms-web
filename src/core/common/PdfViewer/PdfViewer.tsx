import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configurar worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  src: string;
  title?: string;
  onClose?: () => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ src, title, onClose }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("Erro ao carregar PDF:", error);
    setLoading(false);
    setError("Não foi possível carregar o PDF. Tente abrir em nova aba.");
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const goToFirstPage = () => {
    setPageNumber(1);
  };

  const goToLastPage = () => {
    setPageNumber(numPages);
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= numPages) {
      setPageNumber(value);
    }
  };

  return (
    <div className="pdf-viewer-container d-flex flex-column h-100">
      {/* Toolbar */}
      <div className="pdf-toolbar d-flex justify-content-between align-items-center p-2 bg-dark text-white flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <i className="fas fa-file-pdf text-danger"></i>
          <span className="fw-bold text-truncate" style={{ maxWidth: "200px" }}>
            {title || "Documento PDF"}
          </span>
        </div>

        {/* Navegação de páginas */}
        <div className="d-flex align-items-center gap-1">
          <button
            className="btn btn-sm btn-outline-light"
            onClick={goToFirstPage}
            disabled={pageNumber <= 1}
            title="Primeira página"
          >
            <i className="fas fa-angle-double-left"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-light"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            title="Página anterior"
          >
            <i className="fas fa-angle-left"></i>
          </button>
          <div className="d-flex align-items-center mx-2">
            <input
              type="number"
              className="form-control form-control-sm text-center"
              style={{ width: "50px" }}
              value={pageNumber}
              onChange={handlePageInputChange}
              min={1}
              max={numPages}
            />
            <span className="mx-1">/</span>
            <span>{numPages}</span>
          </div>
          <button
            className="btn btn-sm btn-outline-light"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            title="Próxima página"
          >
            <i className="fas fa-angle-right"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-light"
            onClick={goToLastPage}
            disabled={pageNumber >= numPages}
            title="Última página"
          >
            <i className="fas fa-angle-double-right"></i>
          </button>
        </div>

        {/* Controles de zoom */}
        <div className="d-flex align-items-center gap-1">
          <button
            className="btn btn-sm btn-outline-light"
            onClick={zoomOut}
            disabled={scale <= 0.5}
            title="Diminuir zoom"
          >
            <i className="fas fa-search-minus"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-light"
            onClick={resetZoom}
            title="Zoom 100%"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            className="btn btn-sm btn-outline-light"
            onClick={zoomIn}
            disabled={scale >= 3.0}
            title="Aumentar zoom"
          >
            <i className="fas fa-search-plus"></i>
          </button>
        </div>

        {/* Ações */}
        <div className="d-flex align-items-center gap-1">
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline-light"
            title="Abrir em nova aba"
          >
            <i className="fas fa-external-link-alt"></i>
          </a>
          <a
            href={src}
            download
            className="btn btn-sm btn-outline-light"
            title="Baixar PDF"
          >
            <i className="fas fa-download"></i>
          </a>
          {onClose && (
            <button
              className="btn btn-sm btn-outline-light"
              onClick={onClose}
              title="Fechar"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      {/* Área do PDF */}
      <div
        className="pdf-content flex-grow-1 overflow-auto bg-secondary d-flex justify-content-center"
        style={{ minHeight: "400px" }}
      >
        {loading && (
          <div className="d-flex align-items-center justify-content-center w-100">
            <div className="text-center text-white">
              <div className="spinner-border mb-3" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p>Carregando PDF...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="d-flex align-items-center justify-content-center w-100">
            <div className="text-center p-4">
              <i className="fas fa-exclamation-triangle fs-1 text-warning mb-3"></i>
              <h5 className="text-white">{error}</h5>
              <div className="mt-3">
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary me-2"
                >
                  <i className="fas fa-external-link-alt me-2"></i>
                  Abrir em Nova Aba
                </a>
                <a href={src} download className="btn btn-success">
                  <i className="fas fa-download me-2"></i>
                  Baixar PDF
                </a>
              </div>
            </div>
          </div>
        )}

        <Document
          file={src}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          error={null}
          className="py-3"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg"
          />
        </Document>
      </div>

      {/* Barra de status */}
      {!loading && !error && (
        <div className="pdf-status-bar bg-light border-top p-2 d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Página {pageNumber} de {numPages}
          </small>
          <small className="text-muted">Zoom: {Math.round(scale * 100)}%</small>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
