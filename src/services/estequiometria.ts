// ==========================================================================
// Motor de cálculo estequiométrico
//
// Funciones puras, sin dependencias de React: se pueden comprobar a mano y
// reutilizar en la calculadora, en el simulador de examen y en el cuaderno.
// Todas devuelven además los pasos intermedios, porque en el examen lo que se
// evalúa es el razonamiento, no sólo el número final.
// ==========================================================================

export interface PasoCalculo {
  etiqueta: string;
  expresion: string;
  resultado: string;
}

/** Milimoles a partir de una masa en gramos. */
export function mmolDesdeMasa(gramos: number, pm: number): number {
  if (!isFinite(gramos) || !isFinite(pm) || pm <= 0) return NaN;
  return (gramos / pm) * 1000;
}

/** Milimoles a partir de un volumen de líquido puro. */
export function mmolDesdeVolumen(mL: number, densidad: number, pm: number): number {
  if (!isFinite(mL) || !isFinite(densidad) || !isFinite(pm) || pm <= 0) return NaN;
  return ((mL * densidad) / pm) * 1000;
}

export interface ResultadoRendimiento {
  mmolLimitante: number;
  masaTeorica: number;
  rendimiento: number;
  pasos: PasoCalculo[];
  /** Aviso cuando el resultado no es físicamente razonable */
  aviso?: string;
}

/**
 * Rendimiento de una reacción.
 *
 * `ratio` son los moles de producto por mol de reactivo limitante (1 en las
 * tres síntesis del cuaderno, pero se deja explícito).
 */
export function calcularRendimiento(params: {
  masaLimitante: number;
  pmLimitante: number;
  pmProducto: number;
  masaObtenida: number;
  ratio?: number;
  nombreLimitante?: string;
  nombreProducto?: string;
}): ResultadoRendimiento {
  const {
    masaLimitante,
    pmLimitante,
    pmProducto,
    masaObtenida,
    ratio = 1,
    nombreLimitante = 'reactivo limitante',
    nombreProducto = 'producto'
  } = params;

  const mmolLimitante = mmolDesdeMasa(masaLimitante, pmLimitante);
  const mmolProducto = mmolLimitante * ratio;
  const masaTeorica = (mmolProducto / 1000) * pmProducto;
  const rendimiento = masaTeorica > 0 ? (masaObtenida / masaTeorica) * 100 : NaN;

  const pasos: PasoCalculo[] = [
    {
      etiqueta: `Moles de ${nombreLimitante}`,
      expresion: `${masaLimitante.toFixed(3)} g ÷ ${pmLimitante.toFixed(2)} g/mol`,
      resultado: `${mmolLimitante.toFixed(2)} mmol`
    },
    {
      etiqueta: 'Moles teóricos de producto',
      expresion: ratio === 1
        ? `${mmolLimitante.toFixed(2)} mmol × 1 (relación 1:1)`
        : `${mmolLimitante.toFixed(2)} mmol × ${ratio}`,
      resultado: `${mmolProducto.toFixed(2)} mmol`
    },
    {
      etiqueta: `Masa teórica de ${nombreProducto}`,
      expresion: `${(mmolProducto / 1000).toFixed(5)} mol × ${pmProducto.toFixed(2)} g/mol`,
      resultado: `${masaTeorica.toFixed(3)} g`
    },
    {
      etiqueta: 'Rendimiento',
      expresion: `(${masaObtenida.toFixed(3)} g ÷ ${masaTeorica.toFixed(3)} g) × 100`,
      resultado: `${rendimiento.toFixed(1)} %`
    }
  ];

  let aviso: string | undefined;
  if (rendimiento > 100) {
    aviso =
      'Un rendimiento superior al 100 % es imposible: el producto está húmedo, ' +
      'lleva disolvente o impurezas, o la pesada del matraz vacío es incorrecta.';
  } else if (rendimiento > 0 && rendimiento < 5) {
    aviso = 'Rendimiento muy bajo. Revisa que la masa y el peso molecular sean los correctos.';
  }

  return { mmolLimitante, masaTeorica, rendimiento, pasos, aviso };
}

/**
 * Identifica el reactivo limitante comparando los equivalentes disponibles
 * frente a los que exige la estequiometría.
 */
export interface EntradaReactivo {
  nombre: string;
  masa: number;
  pm: number;
  /** Coeficiente estequiométrico en la ecuación ajustada */
  coeficiente: number;
}

export function identificarLimitante(reactivos: EntradaReactivo[]): {
  limitante: EntradaReactivo | null;
  tabla: { nombre: string; mmol: number; equivalentes: number; esLimitante: boolean }[];
} {
  const conMmol = reactivos.map(r => ({
    ...r,
    mmol: mmolDesdeMasa(r.masa, r.pm),
    equivalentes: mmolDesdeMasa(r.masa, r.pm) / r.coeficiente
  }));

  const validos = conMmol.filter(r => isFinite(r.equivalentes) && r.equivalentes > 0);
  if (validos.length === 0) return { limitante: null, tabla: [] };

  const minEq = Math.min(...validos.map(r => r.equivalentes));

  return {
    limitante: validos.find(r => r.equivalentes === minEq) ?? null,
    tabla: conMmol.map(r => ({
      nombre: r.nombre,
      mmol: r.mmol,
      equivalentes: r.equivalentes,
      esLimitante: r.equivalentes === minEq
    }))
  };
}

// ==========================================================================
// Disoluciones
// ==========================================================================

export interface ResultadoDisolucion {
  valor: number;
  unidad: string;
  pasos: PasoCalculo[];
  aviso?: string;
}

/**
 * Masa de soluto sólido para preparar un volumen a una concentración dada.
 * `equivalentes` es el nº de equivalentes por mol (1 para NaOH y HCl).
 */
export function disolucionDesdeSolido(params: {
  concentracion: number;
  /** 'M' molar o 'N' normal */
  tipo: 'M' | 'N';
  volumenMl: number;
  pm: number;
  equivalentes?: number;
  nombre?: string;
  pureza?: number;
}): ResultadoDisolucion {
  const { concentracion, tipo, volumenMl, pm, equivalentes = 1, nombre = 'soluto', pureza = 100 } = params;

  const litros = volumenMl / 1000;
  // Para una base o un ácido monoprótico, N y M coinciden
  const molaridad = tipo === 'N' ? concentracion / equivalentes : concentracion;
  const moles = molaridad * litros;
  const masaPura = moles * pm;
  const masaReal = masaPura * (100 / pureza);

  const pasos: PasoCalculo[] = [
    {
      etiqueta: tipo === 'N' ? 'Normalidad → molaridad' : 'Molaridad',
      expresion: tipo === 'N'
        ? `${concentracion} N ÷ ${equivalentes} eq/mol`
        : `${concentracion} M`,
      resultado: `${molaridad.toFixed(3)} mol/L`
    },
    {
      etiqueta: 'Moles necesarios',
      expresion: `${molaridad.toFixed(3)} mol/L × ${litros.toFixed(4)} L`,
      resultado: `${moles.toFixed(4)} mol`
    },
    {
      etiqueta: `Masa de ${nombre}`,
      expresion: `${moles.toFixed(4)} mol × ${pm.toFixed(2)} g/mol`,
      resultado: `${masaPura.toFixed(3)} g`
    }
  ];

  if (pureza < 100) {
    pasos.push({
      etiqueta: `Corrección por pureza (${pureza} %)`,
      expresion: `${masaPura.toFixed(3)} g × 100 ÷ ${pureza}`,
      resultado: `${masaReal.toFixed(3)} g`
    });
  }

  return {
    valor: masaReal,
    unidad: 'g',
    pasos,
    aviso: nombre.toLowerCase().includes('naoh')
      ? 'Disolver NaOH desprende mucho calor. Añade siempre el sólido sobre el agua, nunca al revés.'
      : undefined
  };
}

/**
 * Volumen de un reactivo comercial concentrado (definido por % en peso y
 * densidad) necesario para preparar una disolución diluida.
 */
export function disolucionDesdeConcentrado(params: {
  concentracionFinal: number;
  tipo: 'M' | 'N';
  volumenMl: number;
  pm: number;
  /** % en peso del reactivo comercial */
  riqueza: number;
  densidad: number;
  equivalentes?: number;
  nombre?: string;
}): ResultadoDisolucion {
  const {
    concentracionFinal, tipo, volumenMl, pm, riqueza, densidad,
    equivalentes = 1, nombre = 'reactivo'
  } = params;

  const litros = volumenMl / 1000;
  const molaridad = tipo === 'N' ? concentracionFinal / equivalentes : concentracionFinal;
  const moles = molaridad * litros;
  const masaSoluto = moles * pm;
  const masaDisolucion = masaSoluto * (100 / riqueza);
  const volumenConcentrado = masaDisolucion / densidad;

  // Concentración del reactivo comercial, útil como comprobación
  const molaridadConcentrado = (densidad * 1000 * (riqueza / 100)) / pm;

  const pasos: PasoCalculo[] = [
    {
      etiqueta: 'Moles de soluto necesarios',
      expresion: `${molaridad.toFixed(3)} mol/L × ${litros.toFixed(4)} L`,
      resultado: `${moles.toFixed(4)} mol`
    },
    {
      etiqueta: `Masa de ${nombre} puro`,
      expresion: `${moles.toFixed(4)} mol × ${pm.toFixed(2)} g/mol`,
      resultado: `${masaSoluto.toFixed(3)} g`
    },
    {
      etiqueta: `Masa de disolución comercial (${riqueza} %)`,
      expresion: `${masaSoluto.toFixed(3)} g × 100 ÷ ${riqueza}`,
      resultado: `${masaDisolucion.toFixed(3)} g`
    },
    {
      etiqueta: 'Volumen a medir',
      expresion: `${masaDisolucion.toFixed(3)} g ÷ ${densidad} g/mL`,
      resultado: `${volumenConcentrado.toFixed(2)} mL`
    },
    {
      etiqueta: 'Comprobación: concentración del comercial',
      expresion: `(${densidad} g/mL × 1000 × ${riqueza}/100) ÷ ${pm.toFixed(2)}`,
      resultado: `${molaridadConcentrado.toFixed(2)} mol/L`
    }
  ];

  return {
    valor: volumenConcentrado,
    unidad: 'mL',
    pasos,
    aviso: nombre.toLowerCase().includes('hcl') || nombre.toLowerCase().includes('sulf')
      ? 'Sobre el ácido, el agua jamás: añade el ácido sobre el agua, despacio y agitando.'
      : undefined
  };
}

/** Dilución simple C₁V₁ = C₂V₂. */
export function dilucion(params: {
  concentracionInicial: number;
  concentracionFinal: number;
  volumenFinalMl: number;
  unidad?: string;
}): ResultadoDisolucion {
  const { concentracionInicial, concentracionFinal, volumenFinalMl, unidad = 'M' } = params;
  const v1 = (concentracionFinal * volumenFinalMl) / concentracionInicial;
  const factor = concentracionInicial / concentracionFinal;

  return {
    valor: v1,
    unidad: 'mL',
    pasos: [
      {
        etiqueta: 'Ecuación de dilución',
        expresion: 'C₁ · V₁ = C₂ · V₂',
        resultado: `V₁ = C₂V₂ / C₁`
      },
      {
        etiqueta: 'Sustitución',
        expresion: `(${concentracionFinal} ${unidad} × ${volumenFinalMl} mL) ÷ ${concentracionInicial} ${unidad}`,
        resultado: `${v1.toFixed(2)} mL`
      },
      {
        etiqueta: 'Factor de dilución',
        expresion: `${concentracionInicial} ÷ ${concentracionFinal}`,
        resultado: `1:${factor.toFixed(1)}`
      },
      {
        etiqueta: 'Disolvente a añadir',
        expresion: `${volumenFinalMl} mL − ${v1.toFixed(2)} mL`,
        resultado: `${(volumenFinalMl - v1).toFixed(2)} mL`
      }
    ],
    aviso: v1 > volumenFinalMl
      ? 'El volumen calculado supera el volumen final: no se puede diluir hasta una concentración MAYOR que la de partida.'
      : undefined
  };
}

/** Escala todas las cantidades de un procedimiento por un factor. */
export function escalarCantidad(cantidadOriginal: number, factor: number): number {
  return cantidadOriginal * factor;
}
