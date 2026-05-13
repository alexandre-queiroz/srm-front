import Badge from "@/components/ui/badge";

export default function DesignTokensPage() {
  const semanticRows: { section: string; tokens: { name: string; var: string; label: string }[] }[] = [
    {
      section: "Text",
      tokens: [
        { name: "Primary",   var: "--fg-1",            label: "fg-1" },
        { name: "Secondary", var: "--fg-2",            label: "fg-2" },
        { name: "Muted",     var: "--fg-3",            label: "fg-3" },
        { name: "Disabled",  var: "--fg-disabled",     label: "fg-disabled" },
        { name: "Brand",     var: "--fg-brand",        label: "fg-brand" },
        { name: "Accent",    var: "--fg-accent",       label: "fg-accent" },
      ],
    },
    {
      section: "Background",
      tokens: [
        { name: "Canvas",    var: "--bg-canvas",       label: "bg-canvas" },
        { name: "Surface",   var: "--bg-surface",      label: "bg-surface" },
        { name: "Alt",       var: "--bg-surface-alt",  label: "bg-surface-alt" },
        { name: "Sunken",    var: "--bg-sunken",       label: "bg-sunken" },
        { name: "Inverse",   var: "--bg-inverse",      label: "bg-inverse" },
      ],
    },
    {
      section: "Border",
      tokens: [
        { name: "Subtle",    var: "--border-subtle",   label: "border-subtle" },
        { name: "Default",   var: "--border-default",  label: "border-default" },
        { name: "Strong",    var: "--border-strong",   label: "border-strong" },
        { name: "Brand",     var: "--border-brand",    label: "border-brand" },
      ],
    },
  ];

  const colorGroups = [
    {
      name: "Brand: Azul SRM",
      tokens: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(s => ({
        name: `${s}`,
        var: `--srm-blue-${s}`,
      })),
    },
    {
      name: "Brand: Laranja SRM",
      tokens: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(s => ({
        name: `${s}`,
        var: `--srm-orange-${s}`,
      })),
    },
    {
      name: "Neutral Palette",
      tokens: [0, 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(s => ({
        name: `${s}`,
        var: `--srm-neutral-${s}`,
      })),
    },
    {
      name: "Semantic: Success",
      tokens: [50, 100, 500, 600, 700].map(s => ({
        name: `${s}`,
        var: `--srm-success-${s}`,
      })),
    },
    {
      name: "Semantic: Warning",
      tokens: [50, 100, 500, 600, 700].map(s => ({
        name: `${s}`,
        var: `--srm-warning-${s}`,
      })),
    },
    {
      name: "Semantic: Danger",
      tokens: [50, 100, 500, 600, 700].map(s => ({
        name: `${s}`,
        var: `--srm-danger-${s}`,
      })),
    },
  ];

  const spacingTokens = [
    { name: "space-1",  val: "4px",  var: "--space-1" },
    { name: "space-2",  val: "8px",  var: "--space-2" },
    { name: "space-3",  val: "12px", var: "--space-3" },
    { name: "space-4",  val: "16px", var: "--space-4" },
    { name: "space-5",  val: "20px", var: "--space-5" },
    { name: "space-6",  val: "24px", var: "--space-6" },
    { name: "space-8",  val: "32px", var: "--space-8" },
    { name: "space-10", val: "40px", var: "--space-10" },
    { name: "space-12", val: "48px", var: "--space-12" },
  ];

  const radiusTokens = [
    { name: "radius-xs",   val: "2px",   var: "--radius-xs" },
    { name: "radius-sm",   val: "4px",   var: "--radius-sm" },
    { name: "radius-md",   val: "6px",   var: "--radius-md" },
    { name: "radius-lg",   val: "10px",  var: "--radius-lg" },
    { name: "radius-xl",   val: "14px",  var: "--radius-xl" },
    { name: "radius-pill", val: "999px", var: "--radius-pill" },
  ];

  return (
    <main className="px-6 py-8 max-w-7xl mx-auto space-y-16 bg-surface-canvas min-h-screen">
      <header className="flex justify-between items-end border-b border-srm-neutral-100 pb-8">
        <div>
          <h1 className="t-h1">Design Tokens</h1>
          <p className="t-body-lg text-fg-2">Documentação técnica de cores, espaçamentos e raios da SRM Asset.</p>
        </div>
        <Badge tone="info">Tailwind v4 Engine</Badge>
      </header>

      {/* Semantic tokens */}
      <section className="space-y-6">
        <h2 className="t-h2">Tokens Semânticos</h2>
        {semanticRows.map(group => (
          <div key={group.section} className="space-y-2">
            <h3 className="t-eyebrow text-fg-3">{group.section}</h3>
            <div className="border border-srm-neutral-100 rounded-xl overflow-hidden bg-white shadow-sm">
              {group.tokens.map((token, i) => (
                <div
                  key={token.name}
                  className={`flex items-center gap-4 px-4 py-3 ${i !== group.tokens.length - 1 ? "border-b border-srm-neutral-100" : ""}`}
                >
                  <div
                    className="w-8 h-8 rounded-lg border border-srm-neutral-100 shrink-0"
                    style={{ backgroundColor: `var(${token.var})` }}
                  />
                  <div className="flex-1 flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-fg-1 w-24 shrink-0">{token.name}</span>
                    <span className="text-xs font-mono text-fg-3 flex-1">{token.var}</span>
                    <span className="text-[11px] font-mono text-fg-3 hidden md:block">{token.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Colors */}
      <section className="space-y-8">
        <h2 className="t-h2">Paletas (Scales)</h2>
        {colorGroups.map(group => (
          <div key={group.name} className="space-y-3">
            <h3 className="t-eyebrow text-fg-3">{group.name}</h3>
            <div className="flex rounded-xl overflow-hidden border border-srm-neutral-100 shadow-sm">
              {group.tokens.map(token => (
                <div key={token.name} className="flex-1 flex flex-col">
                  <div
                    className="h-16"
                    style={{ backgroundColor: `var(${token.var})` }}
                  />
                  <div className="px-2 py-2 bg-white border-t border-srm-neutral-100">
                    <span className="block text-[10px] font-bold text-fg-1 uppercase leading-tight">{token.name}</span>
                    <span className="block text-[9px] text-fg-3 font-mono truncate">{token.var}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Spacing */}
      <section className="space-y-8">
        <h2 className="t-h2">Espaçamento (Spacing)</h2>
        <div className="border border-srm-neutral-100 rounded-xl overflow-hidden bg-white shadow-sm">
          {spacingTokens.map((token, i) => (
            <div
              key={token.name}
              className={`flex items-center gap-6 p-4 ${i !== spacingTokens.length - 1 ? "border-b border-srm-neutral-100" : ""}`}
            >
              <div className="w-12 flex justify-center shrink-0">
                <div
                  className="bg-brand-orange-200 border border-brand-orange-400 opacity-50"
                  style={{ width: `var(${token.var})`, height: "24px" }}
                />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <span className="text-xs font-bold text-fg-1 uppercase">{token.name}</span>
                <span className="text-xs font-mono text-fg-2 font-bold">{token.val}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Radii */}
      <section className="space-y-8 pb-24">
        <h2 className="t-h2">Raios de Borda (Radii)</h2>
        <div className="border border-srm-neutral-100 rounded-xl overflow-hidden bg-white shadow-sm">
          {radiusTokens.map((token, i) => (
            <div
              key={token.name}
              className={`flex items-center gap-6 p-4 ${i !== radiusTokens.length - 1 ? "border-b border-srm-neutral-100" : ""}`}
            >
              <div
                className="w-12 h-12 bg-srm-neutral-50 border-2 border-brand-blue-500 shrink-0"
                style={{ borderRadius: `var(${token.var})` }}
              />
              <div className="flex-1 grid grid-cols-2 gap-2">
                <span className="text-xs font-bold text-fg-1 uppercase">{token.name}</span>
                <span className="text-xs font-bold text-fg-2 uppercase">{token.val}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
