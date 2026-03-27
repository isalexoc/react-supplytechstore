import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { FaSync } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Meta from "../../components/Meta";
import {
  useGetExchangeRateStatusQuery,
  useUpsertDailyExchangeRateMutation,
  useDeleteDailyExchangeRateMutation,
  useSyncExchangeRateFromLiveMutation,
  useUpdateExchangeExtraPointsMutation,
} from "../../slices/settingsApiSlice";

function caracasDateKey(d = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Caracas",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  if (!y || !m || !day) return d.toISOString().slice(0, 10);
  return `${y}-${m}-${day}`;
}

const ExchangeRateScreen = () => {
  const todayKey = useMemo(() => caracasDateKey(), []);
  const [dateKey, setDateKey] = useState(todayKey);
  const [bsPerUsd, setBsPerUsd] = useState("");
  const [note, setNote] = useState("");
  const [localMsg, setLocalMsg] = useState(null);

  const {
    data: status,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetExchangeRateStatusQuery(dateKey);

  const [upsert, { isLoading: saving }] = useUpsertDailyExchangeRateMutation();
  const [removeLock, { isLoading: deleting }] =
    useDeleteDailyExchangeRateMutation();
  const [syncFromLive, { isLoading: syncing }] =
    useSyncExchangeRateFromLiveMutation();
  const [updateExtraPoints, { isLoading: savingExtraPts }] =
    useUpdateExchangeExtraPointsMutation();
  const [extraPointsInput, setExtraPointsInput] = useState("");

  useEffect(() => {
    setLocalMsg(null);
  }, [dateKey]);

  useEffect(() => {
    if (status == null) return;
    if (
      status.extraPercentagePointsFromDb != null &&
      Number.isFinite(status.extraPercentagePointsFromDb)
    ) {
      setExtraPointsInput(String(status.extraPercentagePointsFromDb));
    } else {
      setExtraPointsInput("");
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const n = parseFloat(String(bsPerUsd).trim().replace(",", "."));
    if (!Number.isFinite(n) || n <= 0) return;
    try {
      await upsert({
        bsPerUsd: n,
        dateKey,
        note: note.trim(),
      }).unwrap();
      setBsPerUsd("");
    } catch {
      /* RTK surfaces error */
    }
  };

  const handleClearLock = async () => {
    if (
      !window.confirm(
        "¿Quitar la tasa fijada para esta fecha y usar la tasa en vivo (API)?"
      )
    ) {
      return;
    }
    try {
      await removeLock(dateKey).unwrap();
    } catch {
      /* handled */
    }
  };

  const handleRefetchStatus = async () => {
    setLocalMsg(null);
    const result = await refetch();
    if (result.error) {
      setLocalMsg({
        variant: "danger",
        text: "No se pudieron refrescar los datos. Intente de nuevo.",
      });
      return;
    }
    setLocalMsg({
      variant: "success",
      text: "Datos de BCV / USDT / tasa en vivo actualizados en pantalla.",
    });
  };

  const handleSyncFromLive = async () => {
    setLocalMsg(null);
    try {
      await syncFromLive({ dateKey }).unwrap();
      setLocalMsg({
        variant: "success",
        text: `Tasa fijada para ${dateKey} con el valor en vivo actual (misma fórmula que el cron).`,
      });
    } catch (e) {
      setLocalMsg({
        variant: "danger",
        text: e?.data?.message || e?.error || "No se pudo aplicar la tasa en vivo.",
      });
    }
  };

  const handleSaveExtraPoints = async (e) => {
    e.preventDefault();
    setLocalMsg(null);
    const trimmed = extraPointsInput.trim();
    try {
      if (trimmed === "") {
        const data = await updateExtraPoints({ extraPercentagePoints: null }).unwrap();
        setLocalMsg({
          variant: "success",
          text:
            "Puntos extra restaurados al predeterminado (3%)." +
            (data.todaysLockedRateRefreshed
              ? " La tasa fijada de hoy se recalculó; los precios en el sitio usan ya el nuevo valor."
              : " Recarga el catálogo o las fichas de producto si aún ves el precio anterior."),
        });
        return;
      }
      const n = parseFloat(trimmed.replace(",", "."));
      if (!Number.isFinite(n)) {
        setLocalMsg({
          variant: "danger",
          text: "Introduce un número válido (ej. 3.5 o 4.5).",
        });
        return;
      }
      const data = await updateExtraPoints({ extraPercentagePoints: n }).unwrap();
      setLocalMsg({
        variant: "success",
        text:
          `Puntos extra guardados: ${n}% (se suman a la brecha USDT/BCV en la fórmula).` +
          (data.todaysLockedRateRefreshed
            ? " La tasa fijada de hoy se actualizó; los precios reflejan el cambio."
            : " Recarga la página del producto o del catálogo si el precio no se actualiza."),
      });
    } catch (err) {
      setLocalMsg({
        variant: "danger",
        text: err?.data?.message || err?.error || "No se pudo guardar.",
      });
    }
  };

  if (isLoading && !status) {
    return <Loader />;
  }

  const effectiveRate = status?.effective?.rate;
  const liveRate = status?.liveRate;
  const locked = status?.locked;

  return (
    <>
      <Meta title="Admin — Tasa del día" />
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Volver
      </Link>
      <h1>Tasa Bs/USD (día)</h1>
      <p className="text-muted">
        La tasa puede fijarse por día calendario (Caracas). Si hay tasa fijada, el sitio y los PDF
        usan ese valor todo el día; si no, la tasa en vivo es{" "}
        <strong>BCV × (1 + (brecha mercado + puntos extra) / 100)</strong>: la brecha mercado viene de
        USDT vs BCV (o paralelo si no hay USDT). Los <strong>puntos extra</strong> sobre BCV son
        editables abajo (predeterminado 3%; puedes usar 3.5, 4.5, etc.).
      </p>
      <p className="text-muted small">
        Cada día a las <strong>06:00</strong> (hora{" "}
        <strong>America/Caracas</strong>) el servidor guarda automáticamente la tasa en vivo de ese
        momento como tasa fijada del día; puedes cambiarla aquí después si hace falta. Para
        desactivar el cron en un entorno de prueba, usa la variable{" "}
        <code>DISABLE_DAILY_EXCHANGE_CRON=1</code>.
      </p>

      {error && (
        <Message variant="danger">
          {error?.data?.message || error?.error || String(error)}
        </Message>
      )}
      {localMsg && (
        <Message variant={localMsg.variant}>{localMsg.text}</Message>
      )}

      <Row className="g-3 mb-4">
        <Col md={6}>
          <Card body>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
              <h5 className="mb-0">Estado</h5>
              <div className="d-flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline-secondary"
                  size="sm"
                  disabled={isFetching || syncing}
                  onClick={handleRefetchStatus}
                  title="Volver a cargar BCV, USDT y tasa en vivo (no guarda en la base de datos)"
                >
                  <FaSync /> Refrescar datos
                </Button>
                <Button
                  type="button"
                  variant="outline-primary"
                  size="sm"
                  disabled={syncing || isFetching || liveRate == null}
                  onClick={handleSyncFromLive}
                  title="Guardar la tasa en vivo actual como tasa fijada para la fecha seleccionada"
                >
                  {syncing ? "Aplicando…" : "Actualizar tasa desde en vivo"}
                </Button>
              </div>
            </div>
            {isFetching && <Loader />}
            {!isFetching && status && (
              <>
                <p className="mb-1">
                  <strong>Fecha (Caracas):</strong> {status.dateKey}{" "}
                  {status.dateKey === status.caracasToday ? (
                    <span className="text-muted">(hoy)</span>
                  ) : null}
                </p>
                <p className="mb-1">
                  <strong>Tasa usada por SupplyTech:</strong>{" "}
                  {effectiveRate != null ? (
                    <>
                      <span className="text-success fw-semibold">
                        {effectiveRate.toFixed(4)} Bs/USD
                      </span>{" "}
                      <span className="text-muted">
                        ({status.effective?.source === "locked" ? "fijada" : "en vivo"})
                      </span>
                    </>
                  ) : (
                    "—"
                  )}
                </p>
                <p className="mb-1">
                  <strong>Tasa en vivo (API):</strong>{" "}
                  {liveRate != null ? `${liveRate.toFixed(4)} Bs/USD` : "—"}
                </p>
                <p className="mb-1 small">
                  <strong>BCV:</strong>{" "}
                  {status.dolarApi?.bcv != null
                    ? `${status.dolarApi.bcv.toFixed(4)} Bs/USD`
                    : "—"}{" "}
                  · <strong>USDT (Binance P2P):</strong>{" "}
                  {status.dolarApi?.usdt != null
                    ? `${status.dolarApi.usdt.toFixed(4)} Bs/USDT`
                    : "—"}{" "}
                  · <strong>Paralelo (ref.):</strong>{" "}
                  {status.dolarApi?.paralelo != null
                    ? `${status.dolarApi.paralelo.toFixed(4)}`
                    : "—"}
                </p>
                <p className="mb-0 small text-muted">
                  Brecha mercado (USDT/BCV o paralelo):{" "}
                  {status.dolarApi?.gapMarket === "usdt"
                    ? "BCV vs USDT"
                    : status.dolarApi?.gapMarket === "paralelo"
                      ? "BCV vs paralelo"
                      : "—"}
                  {status.dolarApi?.gapPercentMarket != null && (
                    <>
                      {" "}
                      · Brecha: {status.dolarApi.gapPercentMarket.toFixed(2)}% · +
                      <strong>{status.extraPercentagePoints ?? 3}%</strong> puntos extra (sobre BCV)
                    </>
                  )}
                </p>
                {locked && (
                  <>
                    <p className="mt-2 mb-1 small">
                      <strong>Tasa fijada:</strong>{" "}
                      <span className="text-success fw-semibold">
                        {locked.bsPerUsd.toFixed(4)}
                      </span>{" "}
                      Bs/USD
                      {locked.updatedAt && (
                        <>
                          {" "}
                          · actualizada {new Date(locked.updatedAt).toLocaleString("es-VE")}
                        </>
                      )}
                      {locked.updatedBy?.name && <> · {locked.updatedBy.name}</>}
                    </p>
                    {status.dolarApi?.bcv != null &&
                      status.dolarApi?.gapPercent != null && (
                        <p className="mb-0 small text-muted">
                          Desglose (BCV + BCV × (brecha + puntos extra) / 100):{" "}
                          {status.dolarApi.bcv.toFixed(4)} + {status.dolarApi.bcv.toFixed(4)} × (
                          {status.dolarApi.gapPercent.toFixed(2)} + {status.extraPercentagePoints ?? 3}) /
                          100 ={" "}
                          <span className="text-success fw-semibold">
                            {locked.bsPerUsd.toFixed(4)}
                          </span>{" "}
                          Bs/USD
                        </p>
                      )}
                  </>
                )}
              </>
            )}
          </Card>
        </Col>
        <Col md={6}>
          <Card body className="mb-3">
            <h5 className="mb-2">Puntos % extra sobre BCV</h5>
            <p className="small text-muted mb-3">
              Se suman a la <strong>brecha mercado</strong> (USDT vs BCV) en la fórmula. Predeterminado{" "}
              <strong>3</strong>. Ejemplos: <strong>3.5</strong>, <strong>4.5</strong>. Deja vacío y
              guarda para volver al 3%.
            </p>
            <Form onSubmit={handleSaveExtraPoints}>
              <Form.Group className="mb-2" controlId="extraPoints">
                <Form.Label>Puntos extra %</Form.Label>
                <Form.Control
                  type="text"
                  inputMode="decimal"
                  placeholder="Vacío = 3% predeterminado · ej. 3.5 o 4.5"
                  value={extraPointsInput}
                  onChange={(e) => setExtraPointsInput(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex flex-wrap gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={savingExtraPts}
                >
                  {savingExtraPts ? "Guardando…" : "Guardar puntos extra"}
                </Button>
                <Button
                  type="button"
                  variant="outline-secondary"
                  size="sm"
                  disabled={savingExtraPts || status?.extraPercentagePointsFromDb == null}
                  onClick={async () => {
                    setExtraPointsInput("");
                    setLocalMsg(null);
                    try {
                      await updateExtraPoints({ extraPercentagePoints: null }).unwrap();
                      setLocalMsg({
                        variant: "success",
                        text: "Puntos extra restaurados al predeterminado (3%).",
                      });
                    } catch (err) {
                      setLocalMsg({
                        variant: "danger",
                        text: err?.data?.message || err?.error || "Error al restaurar.",
                      });
                    }
                  }}
                >
                  Restaurar 3% predeterminado
                </Button>
              </div>
            </Form>
          </Card>
          <Card body>
            <h5 className="mb-3">Fijar o actualizar</h5>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-2" controlId="dateKey">
                <Form.Label>Fecha (YYYY-MM-DD)</Form.Label>
                <Form.Control
                  type="date"
                  value={dateKey}
                  onChange={(e) => setDateKey(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2" controlId="bsPerUsd">
                <Form.Label>Bs por USD</Form.Label>
                <Form.Control
                  type="text"
                  inputMode="decimal"
                  placeholder={effectiveRate != null ? String(effectiveRate) : "ej. 45.50"}
                  value={bsPerUsd}
                  onChange={(e) => setBsPerUsd(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="note">
                <Form.Label>Nota (opcional)</Form.Label>
                <Form.Control
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Motivo o referencia interna"
                />
              </Form.Group>
              <div className="d-flex flex-wrap gap-2">
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? "Guardando…" : "Guardar tasa"}
                </Button>
                <Button
                  type="button"
                  variant="outline-danger"
                  disabled={deleting || !locked}
                  onClick={handleClearLock}
                >
                  Quitar tasa fijada
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ExchangeRateScreen;
