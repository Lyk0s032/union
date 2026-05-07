import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

/**
 * Permite borrar el valor y escribir otra cantidad; normaliza a ≥1 al perder foco.
 * `ref` apunta al input (p. ej. para leer el valor al pulsar "Agregar" sin blur).
 */
const CantidadEditable = forwardRef(function CantidadEditable(
  { value, onCommit, className = "", id },
  ref
) {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => inputRef.current, []);

  const [str, setStr] = useState(String(value));

  useEffect(() => {
    setStr(String(value));
  }, [value]);

  const normalize = () => {
    const n = Math.max(1, parseInt(str, 10) || 1);
    setStr(String(n));
    onCommit(n);
  };

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      className={className}
      value={str}
      onChange={(e) => {
        const v = e.target.value;
        if (v === "" || /^\d+$/.test(v)) setStr(v);
      }}
      onBlur={normalize}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
    />
  );
});

export default CantidadEditable;
