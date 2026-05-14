// Nova Antecipação — 3-step flow

const NovaAntecipacao = ({ onBack, onComplete }) => {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({
    numero: "000.184-7",
    sacado: "Construtora Horizonte LTDA",
    cnpj: "12.345.678/0001-90",
    valor: "12.430,50",
    vencimento: "28/05/2026",
    conta: "Banco do Brasil · ag. 1234-5 · cc. 67890-1",
  });

  const steps = ["Dados da duplicata", "Cotação", "Confirmação"];

  const Stepper = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28 }}>
      {steps.map((s, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <React.Fragment key={s}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  background: done ? "var(--srm-success-500)" : active ? "var(--srm-blue-500)" : "var(--bg-sunken)",
                  color: done || active ? "white" : "var(--fg-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12.5,
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                  transition: "all var(--motion-base)",
                }}
              >
                {done ? <Icon name="check" size={13} stroke={2.4} /> : i + 1}
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? "var(--fg-1)" : done ? "var(--fg-2)" : "var(--fg-3)",
                }}
              >
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{ flex: 1, height: 1, background: done ? "var(--srm-success-100)" : "var(--border-default)", margin: "0 16px" }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const StepDados = () => (
    <Card padding={28}>
      <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 600 }}>Dados da duplicata</h2>
      <p style={{ margin: "0 0 24px", color: "var(--fg-2)", fontSize: 13.5 }}>
        Informe os dados do título que você deseja antecipar. Você pode anexar a duplicata em PDF na etapa seguinte.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Input label="Número da duplicata" value={data.numero} onChange={(e) => setData({ ...data, numero: e.target.value })} />
        <Input
          label="Data de vencimento"
          value={data.vencimento}
          hint="Mínimo 5 dias a partir de hoje"
          onChange={(e) => setData({ ...data, vencimento: e.target.value })}
          inputMode="decimal"
        />
        <Input label="Razão social do sacado" value={data.sacado} onChange={(e) => setData({ ...data, sacado: e.target.value })} />
        <Input label="CNPJ do sacado" value={data.cnpj} onChange={(e) => setData({ ...data, cnpj: e.target.value })} inputMode="decimal" />
        <Input
          label="Valor bruto"
          prefix="R$"
          value={data.valor}
          inputMode="decimal"
          onChange={(e) => setData({ ...data, valor: e.target.value })}
          hint="Valor de face da duplicata"
        />
        <Input label="Conta para crédito" value={data.conta} onChange={(e) => setData({ ...data, conta: e.target.value })} />
      </div>

      {/* Upload zone */}
      <div
        style={{
          marginTop: 20,
          padding: 20,
          border: "1.5px dashed var(--border-default)",
          borderRadius: "var(--radius-md)",
          background: "var(--bg-surface-alt)",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: "white",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--srm-blue-500)",
          }}
        >
          <Icon name="upload" size={20} stroke={1.7} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500 }}>Anexar duplicata (opcional)</div>
          <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>PDF ou imagem · até 10 MB</div>
        </div>
        <Button variant="secondary" size="sm">
          Selecionar arquivo
        </Button>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 28, justifyContent: "flex-end" }}>
        <Button variant="secondary" onClick={onBack}>
          Cancelar
        </Button>
        <Button variant="primary" iconRight="arrowRight" onClick={() => setStep(1)}>
          Calcular cotação
        </Button>
      </div>
    </Card>
  );

  const StepCotacao = () => (
    <Card padding={28}>
      <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 600 }}>Sua cotação</h2>
      <p style={{ margin: "0 0 24px", color: "var(--fg-2)", fontSize: 13.5 }}>
        Confira as condições antes de enviar para análise. A cotação é válida por 4 horas.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <Eyebrow style={{ marginBottom: 10 }}>Resumo do título</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 18px", fontSize: 13 }}>
            <span style={{ color: "var(--fg-3)" }}>Duplicata</span>
            <span style={{ fontWeight: 500 }}>Nº {data.numero}</span>
            <span style={{ color: "var(--fg-3)" }}>Sacado</span>
            <span style={{ fontWeight: 500 }}>{data.sacado}</span>
            <span style={{ color: "var(--fg-3)" }}>CNPJ</span>
            <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>{data.cnpj}</span>
            <span style={{ color: "var(--fg-3)" }}>Vencimento</span>
            <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>{data.vencimento}</span>
            <span style={{ color: "var(--fg-3)" }}>Prazo</span>
            <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>16 dias</span>
          </div>
        </div>

        <div
          style={{
            background: "var(--bg-canvas)",
            borderRadius: "var(--radius-md)",
            padding: 18,
            border: "1px solid var(--border-subtle)",
          }}
        >
          <Eyebrow style={{ marginBottom: 10 }}>Cálculo</Eyebrow>
          <div
            style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "6px 16px", fontSize: 13, fontVariantNumeric: "tabular-nums" }}
          >
            <span style={{ color: "var(--fg-2)" }}>Valor bruto</span>
            <span style={{ textAlign: "right" }}>R$ 12.430,50</span>
            <span style={{ color: "var(--fg-2)" }}>Taxa (1,49% a.m.)</span>
            <span style={{ textAlign: "right", color: "var(--srm-danger-700)" }}>− R$ 248,61</span>
            <span style={{ color: "var(--fg-2)" }}>IOF</span>
            <span style={{ textAlign: "right", color: "var(--srm-danger-700)" }}>− R$ 18,07</span>
            <span style={{ color: "var(--fg-2)" }}>Tarifa</span>
            <span style={{ textAlign: "right", color: "var(--srm-danger-700)" }}>− R$ 0,00</span>
          </div>
          <div
            style={{
              borderTop: "1px solid var(--border-subtle)",
              marginTop: 12,
              paddingTop: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600 }}>Valor líquido</span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "var(--srm-success-600)",
                letterSpacing: "-0.01em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              R$ 12.163,82
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 20,
          padding: "12px 14px",
          background: "var(--srm-blue-50)",
          border: "1px solid var(--srm-blue-100)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          fontSize: 12.5,
          lineHeight: 1.45,
          color: "var(--srm-blue-700)",
        }}
      >
        <Icon name="alertCircle" size={16} stroke={1.7} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          <strong>Cotação válida até 14 mai 2026 às 18:30.</strong> Após esse prazo, uma nova taxa será calculada de acordo com as condições
          do FIDC SRM Mercantil.
        </span>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 28, justifyContent: "space-between" }}>
        <Button variant="ghost-neutral" icon="arrowLeft" onClick={() => setStep(0)}>
          Voltar
        </Button>
        <Button variant="primary" iconRight="arrowRight" onClick={() => setStep(2)}>
          Enviar para análise
        </Button>
      </div>
    </Card>
  );

  const StepConfirmacao = () => (
    <Card padding={36} style={{ textAlign: "center" }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 999,
          background: "var(--srm-success-50)",
          color: "var(--srm-success-600)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Icon name="checkCircle" size={32} stroke={1.7} />
      </div>
      <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>Duplicata enviada para análise.</h2>
      <p
        style={{
          margin: "0 0 20px",
          color: "var(--fg-2)",
          fontSize: 14,
          maxWidth: 480,
          marginLeft: "auto",
          marginRight: "auto",
          lineHeight: 1.5,
        }}
      >
        Você recebe a confirmação em até 1 dia útil. Acompanhe o status pelo painel ou pelas notificações.
      </p>

      <div
        style={{
          display: "inline-flex",
          gap: 24,
          padding: "14px 24px",
          background: "var(--bg-canvas)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          fontSize: 12.5,
          marginBottom: 24,
        }}
      >
        <div>
          <div style={{ color: "var(--fg-3)", marginBottom: 2 }}>Protocolo</div>
          <div style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>SRM-2026-018472</div>
        </div>
        <div>
          <div style={{ color: "var(--fg-3)", marginBottom: 2 }}>Valor líquido previsto</div>
          <div style={{ fontWeight: 600, color: "var(--srm-success-600)", fontVariantNumeric: "tabular-nums" }}>R$ 12.163,82</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Button variant="secondary" onClick={onComplete}>
          Voltar ao painel
        </Button>
        <Button variant="primary" icon="plus" onClick={() => setStep(0)}>
          Nova antecipação
        </Button>
      </div>
    </Card>
  );

  return (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      <Stepper />
      {step === 0 && <StepDados />}
      {step === 1 && <StepCotacao />}
      {step === 2 && <StepConfirmacao />}
    </div>
  );
};

Object.assign(window, { NovaAntecipacao });
