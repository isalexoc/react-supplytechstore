import { Modal, ProgressBar, Button, Spinner } from "react-bootstrap";
import { IoMdDownload } from "react-icons/io";

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

/**
 * @param {boolean} show
 * @param {number | null} progress — 0–100 when known; null when indeterminate
 * @param {boolean} indeterminate
 * @param {string} statusLabel
 * @param {number} bytesLoaded — for display when total unknown
 * @param {() => void} onCancel
 * @param {boolean} canCancel
 */
function CatalogDownloadModal({
  show,
  progress,
  indeterminate,
  statusLabel,
  bytesLoaded,
  onCancel,
  canCancel,
}) {
  const showPercent = !indeterminate && progress != null && progress >= 0;

  return (
    <Modal
      show={show}
      centered
      backdrop="static"
      keyboard={false}
      className="catalog-download-modal"
      contentClassName="border-0 shadow-lg"
      dialogClassName="catalog-download-modal__dialog"
    >
      <div className="catalog-download-modal__accent" aria-hidden />
      <Modal.Header className="border-0 pb-0 pt-4 px-4">
        <div className="d-flex align-items-center gap-3 w-100">
          <div className="catalog-download-modal__icon-wrap">
            <IoMdDownload size={28} className="text-primary" aria-hidden />
          </div>
          <div>
            <Modal.Title as="h5" className="mb-0 fw-semibold">
              Descargando catálogo
            </Modal.Title>
            <p className="text-muted small mb-0 mt-1">
              PDF con todos los productos
            </p>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="px-4 pt-3 pb-2">
        <p className="small text-secondary mb-3 lh-base">{statusLabel}</p>
        {indeterminate ? (
          <ProgressBar
            now={100}
            max={100}
            striped
            animated
            variant="primary"
            className="catalog-download-modal__bar"
            aria-label="Descarga en progreso"
          />
        ) : (
          <ProgressBar
            now={showPercent ? progress : 0}
            max={100}
            striped={showPercent}
            animated={showPercent && progress < 100}
            variant="primary"
            className="catalog-download-modal__bar"
            label={showPercent ? `${progress}%` : undefined}
          />
        )}
        <div className="d-flex justify-content-between align-items-center mt-2 small text-muted">
          <span>
            {canCancel ? (
              <>
                <Spinner
                  animation="border"
                  size="sm"
                  className="me-2 align-middle"
                  aria-hidden
                />
                En curso…
              </>
            ) : (
              "Completado"
            )}
          </span>
          {bytesLoaded > 0 && (
            <span className="font-monospace">{formatBytes(bytesLoaded)}</span>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0 px-4 pb-4">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={onCancel}
          disabled={!canCancel}
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CatalogDownloadModal;
export { formatBytes };
