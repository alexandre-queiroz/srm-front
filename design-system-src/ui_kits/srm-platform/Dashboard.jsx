// Dashboard — cedente home screen

const Dashboard = ({ onNewOperation, onOpenOperation }) => {
  const operations = [
    { num: "000.182-3", sacado: "Construtora Horizonte", venc: "28/04/2026", status: "warning", label: "Em análise", valor: "12.430,50" },
    { num: "000.178-1", sacado: "Mercado Estrela", venc: "15/05/2026", status: "success", label: "Aprovado", valor: "8.920,00" },
    { num: "000.171-5", sacado: "Indústria Real", venc: "02/06/2026", status: "success", label: "Liquidado", valor: "24.180,75" },
    { num: "000.169-2", sacado: "TechFlow Soluções", venc: "21/05/2026", status: "danger", label: "Rejeitado", valor: "5.640,30" },
    { num: "000.165-7", sacado: "Distribuidora Sul", venc: "10/06/2026", status: "info", label: "Enviado", valor: "18.205,00" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <KPI label="Total a receber" value="R$ 1.284.430,50" delta="+8,4%" meta="23 duplicatas em aberto" />
        <KPI label="Antecipado em maio" value="R$ 642.180,25" delta="+12,1%" meta="14 operações liquidadas" />
        <KPI label="Taxa média" value="1,49% a.m." delta="−0,13 p.p." deltaTone="success" meta="vs. 1,62% em abr" />
        <KPI label="Em análise" value="3 op." delta="48h+" deltaTone="danger" meta="aguardando aprovação" />
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(260px, 1fr)", gap: 16 }}>
        {/* Operations table */}
        <Card padding={0} style={{ overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Operações recentes</div>
              <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>Últimas 5 duplicatas enviadas</div>
            </div>
            <div style={{ flex: 1 }} />
            <Button variant="ghost" size="sm" iconRight="arrowRight">
              Ver todas
            </Button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Duplicata", "Sacado", "Vencimento", "Status", "Valor"].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      textAlign: i === 4 ? "right" : "left",
                      padding: "10px 24px",
                      fontWeight: 500,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "var(--fg-3)",
                      background: "var(--bg-surface-alt)",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {operations.map((op, i) => (
                <tr key={op.num} style={{ cursor: "pointer" }} onClick={onOpenOperation}>
                  <td style={{ padding: "12px 24px", borderBottom: i < operations.length - 1 ? "1px solid var(--border-subtle)" : 0 }}>
                    <strong style={{ color: "var(--fg-1)" }}>Nº {op.num}</strong>
                  </td>
                  <td
                    style={{
                      padding: "12px 24px",
                      borderBottom: i < operations.length - 1 ? "1px solid var(--border-subtle)" : 0,
                      color: "var(--fg-2)",
                    }}
                  >
                    {op.sacado}
                  </td>
                  <td
                    style={{
                      padding: "12px 24px",
                      borderBottom: i < operations.length - 1 ? "1px solid var(--border-subtle)" : 0,
                      color: "var(--fg-2)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {op.venc}
                  </td>
                  <td style={{ padding: "12px 24px", borderBottom: i < operations.length - 1 ? "1px solid var(--border-subtle)" : 0 }}>
                    <Badge tone={op.status}>{op.label}</Badge>
                  </td>
                  <td
                    style={{
                      padding: "12px 24px",
                      borderBottom: i < operations.length - 1 ? "1px solid var(--border-subtle)" : 0,
                      textAlign: "right",
                      fontWeight: 500,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    R$ {op.valor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Side column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Quick action card */}
          <Card
            padding={20}
            style={{
              background: "linear-gradient(135deg, var(--srm-blue-50) 0%, white 100%)",
              border: "1px solid var(--srm-blue-100)",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: "var(--srm-blue-500)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="upload" size={20} stroke={1.7} />
            </div>
            <h3 style={{ margin: "12px 0 4px", fontSize: 16, fontWeight: 600 }}>Nova antecipação</h3>
            <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--fg-2)", lineHeight: 1.45 }}>
              Envie uma duplicata em 3 passos e receba o crédito em até 1 hora útil.
            </p>
            <Button variant="primary" size="sm" iconRight="arrowRight" onClick={onNewOperation}>
              Antecipar duplicata
            </Button>
          </Card>

          {/* Alert card */}
          <Card padding={18} style={{ display: "flex", gap: 12, background: "var(--srm-warning-50)", borderColor: "#EFD58E" }}>
            <Icon name="clock" size={20} stroke={1.7} style={{ color: "var(--srm-warning-600)", flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--srm-warning-700)" }}>3 operações pendentes</div>
              <div style={{ fontSize: 12, color: "var(--srm-warning-700)", opacity: 0.85, lineHeight: 1.4, marginTop: 2 }}>
                Aguardando documentação do sacado. Revise para evitar atrasos.
              </div>
              <a href="#" style={{ fontSize: 12, color: "var(--srm-warning-700)", fontWeight: 600, marginTop: 6, display: "inline-block" }}>
                Resolver pendências →
              </a>
            </div>
          </Card>

          {/* FIDC info */}
          <Card padding={18}>
            <Eyebrow style={{ marginBottom: 10 }}>Fundo atual</Eyebrow>
            <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 8 }}>FIDC SRM Mercantil</div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px", fontSize: 12.5 }}>
              <span style={{ color: "var(--fg-3)" }}>Taxa CDI</span>
              <span style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>14,15% a.a.</span>
              <span style={{ color: "var(--fg-3)" }}>Limite</span>
              <span style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>R$ 5.000.000</span>
              <span style={{ color: "var(--fg-3)" }}>Utilizado</span>
              <span style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>R$ 1.284.430</span>
            </div>
            <div style={{ marginTop: 12, height: 6, background: "var(--bg-sunken)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: "26%", height: "100%", background: "var(--srm-blue-500)" }} />
            </div>
            <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 6 }}>26% do limite utilizado</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Dashboard });
