import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ItemKits from './itemKits';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Kit } from '../types';

export default function KitsRequisicion(){
    const realData = useSelector((state: any) => state.requisicion.realProyectosRequisicion);
    const [panelOrdenAbierto, setPanelOrdenAbierto] = useState(false);

    // Atajo de teclado Ctrl + Shift + O para abrir la nueva orden de compra
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isControl = event.ctrlKey || event.metaKey;
            const key = event.key.toLowerCase();
            const code = event.code;

            if (isControl && event.shiftKey && (key === 'o' || code === 'KeyO')) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation?.();
                setPanelOrdenAbierto(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown, { capture: true });
        return () => {
            document.removeEventListener('keydown', handleKeyDown, { capture: true });
        };
    }, []);
    
    // Combinar kits y productos terminados
    const kits = useMemo(() => {
        if (!realData) return [];
        
        const kitsArray: Kit[] = [];
        
        // Agregar kits consolidados
        if (realData.kitsConsolidados && Array.isArray(realData.kitsConsolidados)) {
            realData.kitsConsolidados.forEach((kit: any) => {
                kitsArray.push({
                    id: kit.id,
                    nombre: kit.nombre || `Kit ${kit.id}`,
                    tipo: 'KIT',
                    necesidad: kit.totalKits || 0
                });
            });
        }
        
        // Agregar productos terminados consolidados
        if (realData.productoTerminadoConsolidado && Array.isArray(realData.productoTerminadoConsolidado)) {
            realData.productoTerminadoConsolidado.forEach((prod: any) => {
                kitsArray.push({
                    id: prod.id,
                    nombre: prod.nombre || `Producto ${prod.id}`,
                    tipo: 'PRODUCTO TERMINADO',
                    necesidad: prod.totalProductos || 0
                });
            });
        }
        
        return kitsArray;
    }, [realData]);
    
    // Obtener nombres de proyectos seleccionados
    const proyectosSeleccionados = useMemo(() => {
        if (!realData || !realData.proyectos) return [];
        return realData.proyectos.map((req: any) => {
            const cotizacion = req.cotizacion || {};
            return cotizacion.name || `Requisición ${req.id}`;
        });
    }, [realData]);


    const descargarPDF = () => {
        const doc = new jsPDF('p', 'mm', 'a4');
        doc.setFontSize(16);
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // Título
        doc.text('KITS y Producto terminado', pageWidth / 2, 15, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Lista de productos requeridos', pageWidth / 2, 22, { align: 'center' });
        
        // Proyectos seleccionados
        if (proyectosSeleccionados.length > 0) {
            doc.setFontSize(10);
            doc.text(`Proyectos: ${proyectosSeleccionados.join(', ')}`, 14, 30);
        }

        // Preparar datos para la tabla
        const body = kits.map((kit) => [
            kit.id.toString(),
            kit.nombre,
            kit.tipo,
            kit.necesidad.toString()
        ]);

        // Crear tabla
        autoTable(doc, {
            startY: proyectosSeleccionados.length > 0 ? 35 : 28,
            head: [['Item', 'Descripción', 'Tipo', 'Necesidad']],
            body: body,
            styles: { 
                fontSize: 9, 
                cellPadding: 3 
            },
            headStyles: { 
                fillColor: [41, 128, 185], 
                textColor: 255 
            },
            margin: { left: 14, right: 14 },
            theme: 'striped',
            columnStyles: {
                0: { cellWidth: 25 }, // Item
                1: { cellWidth: 'auto' }, // Descripción
                2: { cellWidth: 50 }, // Tipo
                3: { cellWidth: 35, halign: 'right' } // Necesidad
            }
        });

        // Guardar PDF
        doc.save('kits-y-productos-terminados.pdf');
    };

    return (
        <div className="kitsRequisicion">
            <div className="containerKits">
                <div className="headerKits">
                    <div className="leftHeader">
                        <h1>KITS y Producto terminado</h1>
                        <span>Lista de productos requeridos</span>
                    </div>
                    <div className="rightHeader">
                        {proyectosSeleccionados.length > 0 && (
                            <div className="proyectosSeleccionados">
                                <h3>{proyectosSeleccionados.join(', ')}</h3>
                            </div>
                        )}
                        <button className="btnDescargarPDF" onClick={descargarPDF}>
                            <span>Descargar PDF</span>
                        </button>
                    </div>
                </div>
                
                <div className="listaKits">
                    <div className="headerLista">
                        <div className="colItem">Item</div>
                        <div className="colNecesidad">Necesidad</div>
                    </div>
                    <div className="itemsLista">
                        {kits.length > 0 ? kits.map((kit) => (
                            <ItemKits key={kit.id} kit={kit} />
                        )) : (
                            <p style={{ padding: '20px', color: '#666', textAlign: 'center' }}>
                                No hay kits o productos terminados disponibles
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 