interface SheetHeadProps {
  fig: string;
  title: string;
  note: string;
}

/** Section header in drawing notation: figure number, rule, note, title. */
export default function SheetHead({ fig, title, note }: SheetHeadProps) {
  return (
    <header className="sheet-head">
      <div className="sheet-rule mono">
        <span data-scramble>Fig. {fig}</span>
        <span className="sheet-rule-line" data-draw />
        <span data-scramble>{note}</span>
      </div>
      <h2 className="sheet-title" data-split>
        {title}
      </h2>
    </header>
  );
}
