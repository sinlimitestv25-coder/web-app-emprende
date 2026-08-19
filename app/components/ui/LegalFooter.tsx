"use client";

import { useState } from "react";
import { version } from "../../../package.json";

export type LegalDoc = "terminos" | "privacidad";

const legalContent: Record<LegalDoc, { title: string; body: string[] }> = {
  terminos: {
    title: "Términos de uso",
    body: [
      "Nexo es una plataforma de gestión para emprendimientos: alta de productos, clientes, proveedores, pedidos y un portal de ventas público por emprendimiento.",
      "Esta versión funciona como demostración: los datos de prueba se guardan únicamente en este navegador y pueden restablecerse en cualquier momento desde Ajustes, sin afectar a otros dispositivos ni usuarios.",
      "El uso de la plataforma implica aceptar que la información cargada es responsabilidad de quien administra cada emprendimiento, y que Nexo no interviene en las ventas, pagos ni acuerdos entre el emprendimiento y sus clientes.",
      "CIR Soluciones Digitales podrá actualizar estos términos a medida que se incorporen nuevas funciones. Ante cualquier duda, podés escribirnos por los canales de contacto habituales.",
    ],
  },
  privacidad: {
    title: "Política de privacidad",
    body: [
      "En esta versión de demostración, los datos de productos, clientes, proveedores y pedidos se guardan solamente en el navegador de cada dispositivo (almacenamiento local), sin enviarse a ningún servidor.",
      "Cuando un emprendimiento pase a la versión conectada, sus datos se almacenarán en una base de datos con acceso restringido, protegida por políticas de seguridad, y solo el propio emprendimiento podrá ver su información comercial.",
      "El superadministrador de la plataforma puede consultar espacios, usuarios, planes y estado del servicio, pero no tiene acceso a productos, clientes, pedidos, ventas ni ganancias de ningún emprendimiento.",
      "No compartimos información de los emprendimientos ni de sus clientes con terceros. Ante cualquier consulta sobre tus datos, podés escribirnos por los canales de contacto habituales.",
    ],
  },
};

export function LegalModal({ doc, onClose }: { doc: LegalDoc; onClose: () => void }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal legal-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        <p className="eyebrow">Nexo</p>
        <h2>{legalContent[doc].title}</h2>
        <div className="legal-body">
          {legalContent[doc].body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
      </div>
    </div>
  );
}

export function LegalFooter() {
  const [open, setOpen] = useState<LegalDoc | null>(null);

  return (
    <>
      <footer className="app-footer">
        <div className="app-footer-links">
          <button type="button" onClick={() => setOpen("terminos")}>Términos de uso</button>
          <button type="button" onClick={() => setOpen("privacidad")}>Privacidad</button>
        </div>
        <p>© CIR Soluciones Digitales · v{version}</p>
      </footer>
      {open && <LegalModal doc={open} onClose={() => setOpen(null)} />}
    </>
  );
}
