// Operações — full duplicates table with filters

const Operacoes = () => {
  const [filter, setFilter] = React.useState("todos");

  const allOps = [
    {
      num: "000.182-3",
      sacado: "Construtora Horizonte",
      cnpj: "12.345.678/0001-90",
      emissao: "12/05/2026",
      venc: "28/05/2026",
      status: "warning",
      label: "Em análise",
      bruto: "12.430,50",
      liquido: "12.163,82",
      taxa: "1,49%",
    },
    {
      num: "000.178-1",
      sacado: "Mercado Estrela",
      cnpj: "23.456.789/0001-12",
      emissao: "08/05/2026",
      venc: "15/05/2026",
      status: "success",
      label: "Aprovado",
      bruto: "8.920,00",
      liquido: "8.732,55",
      taxa: "1,45%",
    },
    {
      num: "000.171-5",
      sacado: "Indústria Real",
      cnpj: "34.567.890/0001-34",
      emissao: "01/05/2026",
      venc: "02/06/2026",
      status: "success",
      label: "Liquidado",
      bruto: "24.180,75",
      liquido: "23.640,38",
      taxa: "1,52%",
    },
    {
      num: "000.169-2",
      sacado: "TechFlow Soluções",
      cnpj: "45.678.901/0001-56",
      emissao: "28/04/2026",
      venc: "21/05/2026",
      status: "danger",
      label: "Rejeitado",
      bruto: "5.640,30",
      liquido: "—",
      taxa: "—",
    },
    {
      num: "000.165-7",
      sacado: "Distribuidora Sul",
      cnpj: "56.789.012/0001-78",
      emissao: "25/04/2026",
      venc: "10/06/2026",
      status: "info",
      label: "Enviado",
      bruto: "18.205,00",
      liquido: "17.804,99",
      taxa: "1,49%",
    },
    {
      num: "000.160-9",
      sacado: "Atacadão Brasil",
      cnpj: "67.890.123/0001-90",
      emissao: "20/04/2026",
      venc: "04/05/2026",
      status: "success",
      label: "Liquidado",
      bruto: "42.500,00",
      liquido: "41.640,12",
      taxa: "1,38%",
    },
    {
      num: "000.158-3",
      sacado: "Logística Norte",
      cnpj: "78.901.234/0001-11",
      emissao: "18/04/2026",
      venc: "02/05/2026",
      status: "success",
      label: "Liquidado",
      bruto: "6.310,00",
      liquido: "6.181,55",
      taxa: "1,41%",
    },
    {
      num: "000.155-4",
      sacado: "Comércio Veredas",
      cnpj: "89.012.345/0001-23",
      emissao: "15/04/2026",
      venc: "12/05/2026",
      status: "warning",
      label: "Em análise",
      bruto: "9.870,40",
      liquido: "9.683,22",
      taxa: "1,49%",
    },
  ];

  const filters = [
    { id: "todos", label: "Todos", count: allOps.length },
    { id: "enviado", label: "Enviado", count: allOps.filter((o) => o.status === "info").length },
    { id: "analise", label: "Em análise", count: allOps.filter((o) => o.status === "warning").length },
    { id: "aprovado", label: "Aprovado / Liquidado", count: allOps.filter((o) => o.status === "success").length },
    { id: "rejeitado", label: "Rejeitado", count: allOps.filter((o) => o.status === "danger").length },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Filter bar */}
      <Card padding={0} style={{ overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 18px",
            gap: 18,
            borderBottom: "1px solid var(--border-subtle)",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 4 }}>
            {filters.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  style={{
                    display: "inline-flex",
                    gap: 8,
                    alignItems: "center",
                    padding: "6px 12px",
                    borderRadius: "var(--radius-md)",
                    fontSize: 12.5,
                    fontWeight: 500,
                    border: "1px solid",
                    cursor: "pointer",
                    borderColor: active ? "var(--srm-blue-200)" : "transparent",
                    background: active ? "var(--srm-blue-50)" : "transparent",
                    color: active ? "var(--srm-blue-700)" : "var(--fg-2)",
                    transition: "all var(--motion-fast)",
                  }}
                >
                  {f.label}
                  <span
                    style={{
                      fontSize: 10.5,
                      padding: "1px 6px",
                      borderRadius: 999,
                      background: active ? "var(--srm-blue-500)" : "var(--srm-neutral-100)",
                      color: active ? "white" : "var(--fg-2)",
                      fontVariantNumeric: "tabular-nums",
                      fontWeight: 600,
                    }}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>
          <div style={{ flex: 1 }} />
          <Button variant="secondary" size="sm" icon="calendar">
            Mai 2026
          </Button>
          <Button variant="secondary" size="sm" icon="filter">
            Filtros
          </Button>
          <Button variant="secondary" size="sm" icon="download">
            Exportar
          </Button>
        </div>

        {/* Table */}
        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Duplicata", "Sacado", "Emissão", "Vencimento", "Status", "Bruto", "Taxa", "Líquido", ""].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      textAlign: ["Bruto", "Líquido", "Taxa"].includes(h) ? "right" : "left",
                      padding: "10px 16px",
                      fontWeight: 500,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "var(--fg-3)",
                      background: "var(--bg-surface-alt)",
                      borderBottom: "1px solid var(--border-subtle)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allOps.map((op, i) => (
                <tr
                  key={op.num}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--srm-blue-50)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "var(--bg-surface-alt)" : "white")}
                >
                  {[
                    <strong style={{ color: "var(--fg-1)" }}>Nº {op.num}</strong>,
                    <div>
                      <div style={{ color: "var(--fg-1)", fontWeight: 500 }}>{op.sacado}</div>
                      <div style={{ fontSize: 11.5, color: "var(--fg-3)", fontVariantNumeric: "tabular-nums" }}>{op.cnpj}</div>
                    </div>,
                    op.emissao,
                    op.venc,
                    <Badge tone={op.status}>{op.label}</Badge>,
                    `R$ ${op.bruto}`,
                    op.taxa + (op.taxa !== "—" ? " a.m." : ""),
                    <strong style={{ color: op.liquido !== "—" ? "var(--srm-success-600)" : "var(--fg-3)" }}>
                      {op.liquido !== "—" ? "R$ " + op.liquido : "—"}
                    </strong>,
                    <button style={{ background: "transparent", border: 0, color: "var(--fg-3)", cursor: "pointer", padding: 4 }}>
                      <Icon name="moreVertical" size={16} />
                    </button>,
                  ].map((cell, j) => (
                    <td
                      key={j}
                      style={{
                        padding: "12px 16px",
                        background: i % 2 === 1 ? "var(--bg-surface-alt)" : "white",
                        borderBottom: i < allOps.length - 1 ? "1px solid var(--border-subtle)" : 0,
                        color: "var(--fg-2)",
                        textAlign: [5, 6, 7].includes(j) ? "right" : "left",
                        fontVariantNumeric: [2, 3, 5, 6, 7].includes(j) ? "tabular-nums" : "normal",
                        whiteSpace: j === 0 ? "nowrap" : "normal",
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            padding: "12px 18px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            fontSize: 12.5,
            color: "var(--fg-2)",
          }}
        >
          <span>
            Mostrando <strong>1 a 8</strong> de <strong>23</strong> operações
          </span>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 4 }}>
            <Button variant="ghost-neutral" size="sm" icon="arrowLeft" disabled>
              Anterior
            </Button>
            <Button variant="ghost-neutral" size="sm" iconRight="arrowRight">
              Próxima
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

Object.assign(window, { Operacoes });
