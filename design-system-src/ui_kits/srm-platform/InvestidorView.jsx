// Investidor — portfolio view of FIDC quotaholder

const InvestidorView = () => {
  const funds = [
    {
      nome: "FIDC SRM Mercantil",
      classe: "Sênior",
      pl: "128.430.250",
      rent: "+1,18%",
      rent12: "+14,92%",
      cota: "1,287304",
      tone: "success",
    },
    {
      nome: "FIDC SRM Multissetorial",
      classe: "Sênior",
      pl: "84.180.500",
      rent: "+1,12%",
      rent12: "+14,28%",
      cota: "1,196840",
      tone: "success",
    },
    { nome: "FIDC SRM Agro", classe: "Mezanino", pl: "52.640.180", rent: "+1,34%", rent12: "+16,40%", cota: "1,328105", tone: "success" },
    {
      nome: "FIDC SRM Capital Giro",
      classe: "Subordinado",
      pl: "36.205.000",
      rent: "+1,68%",
      rent12: "+19,12%",
      cota: "1,418720",
      tone: "success",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <KPI label="Patrimônio investido" value="R$ 2.840.620,18" delta="+R$ 32.180" meta="atualização: 12 mai 2026" />
        <KPI label="Rentabilidade no mês" value="+1,24%" delta="vs. CDI +0,12 p.p." meta="CDI 1,12% no período" />
        <KPI label="Rentabilidade 12m" value="+15,82%" delta="118% CDI" meta="benchmark: CDI" />
        <KPI label="Cotas" value="2.847,2 cotas" meta="distribuídas em 4 fundos" delta="+8 no mês" deltaTone="neutral" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(260px, 1fr)", gap: 16 }}>
        {/* Funds table */}
        <Card padding={0} style={{ overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Fundos da carteira</div>
              <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>Cotas distribuídas em 4 FIDCs SRM</div>
            </div>
            <div style={{ flex: 1 }} />
            <Button variant="ghost" size="sm" iconRight="arrowRight">
              Aportar
            </Button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Fundo", "Classe", "PL", "Rent. mês", "Rent. 12m", "Cota"].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      textAlign: i >= 2 ? "right" : "left",
                      padding: "10px 20px",
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
              {funds.map((f, i) => (
                <tr key={f.nome}>
                  <td style={{ padding: "14px 20px", borderBottom: i < funds.length - 1 ? "1px solid var(--border-subtle)" : 0 }}>
                    <div style={{ fontWeight: 600, color: "var(--fg-1)" }}>{f.nome}</div>
                    <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>Atualizado em 12 mai 2026</div>
                  </td>
                  <td style={{ padding: "14px 20px", borderBottom: i < funds.length - 1 ? "1px solid var(--border-subtle)" : 0 }}>
                    <Badge tone={f.classe === "Sênior" ? "info" : f.classe === "Mezanino" ? "accent" : "success"} dot={false}>
                      {f.classe}
                    </Badge>
                  </td>
                  <td
                    style={{
                      padding: "14px 20px",
                      borderBottom: i < funds.length - 1 ? "1px solid var(--border-subtle)" : 0,
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                      color: "var(--fg-2)",
                    }}
                  >
                    R$ {f.pl}
                  </td>
                  <td
                    style={{
                      padding: "14px 20px",
                      borderBottom: i < funds.length - 1 ? "1px solid var(--border-subtle)" : 0,
                      textAlign: "right",
                      color: "var(--srm-success-600)",
                      fontWeight: 500,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {f.rent}
                  </td>
                  <td
                    style={{
                      padding: "14px 20px",
                      borderBottom: i < funds.length - 1 ? "1px solid var(--border-subtle)" : 0,
                      textAlign: "right",
                      color: "var(--srm-success-600)",
                      fontWeight: 600,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {f.rent12}
                  </td>
                  <td
                    style={{
                      padding: "14px 20px",
                      borderBottom: i < funds.length - 1 ? "1px solid var(--border-subtle)" : 0,
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                    }}
                  >
                    {f.cota}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Side */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card padding={20}>
            <Eyebrow style={{ marginBottom: 8 }}>Composição da carteira</Eyebrow>

            {/* Stacked bar */}
            <div
              style={{ display: "flex", height: 14, borderRadius: "var(--radius-sm)", overflow: "hidden", marginTop: 12, marginBottom: 14 }}
            >
              <div style={{ width: "45%", background: "var(--srm-blue-500)" }} />
              <div style={{ width: "30%", background: "var(--srm-blue-300)" }} />
              <div style={{ width: "18%", background: "var(--srm-orange-400)" }} />
              <div style={{ width: "7%", background: "var(--srm-orange-600)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5 }}>
              {[
                { c: "var(--srm-blue-500)", n: "Mercantil", v: "45%", val: "R$ 1.278.279" },
                { c: "var(--srm-blue-300)", n: "Multissetorial", v: "30%", val: "R$   852.186" },
                { c: "var(--srm-orange-400)", n: "Agro", v: "18%", val: "R$   511.311" },
                { c: "var(--srm-orange-600)", n: "Capital Giro", v: "7%", val: "R$   198.843" },
              ].map((r) => (
                <div key={r.n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: r.c }} />
                  <span style={{ flex: 1 }}>{r.n}</span>
                  <span style={{ color: "var(--fg-3)", fontVariantNumeric: "tabular-nums", fontSize: 11.5 }}>{r.val}</span>
                  <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums", minWidth: 32, textAlign: "right" }}>{r.v}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card padding={18} style={{ background: "var(--srm-blue-900)", borderColor: "var(--srm-blue-900)", color: "white" }}>
            <Eyebrow style={{ color: "rgba(255,255,255,0.55)" }}>Próxima distribuição</Eyebrow>
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 6, fontVariantNumeric: "tabular-nums" }}>
              R$ 35.182,40
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>
              previsto para 25 mai 2026 · em sua conta cadastrada
            </div>
            <Button
              variant="secondary"
              size="sm"
              style={{ background: "rgba(255,255,255,0.1)", color: "white", borderColor: "rgba(255,255,255,0.2)", marginTop: 14 }}
            >
              Ver agenda completa
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { InvestidorView });
