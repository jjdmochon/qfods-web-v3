# QFDOS v3 — Química Farmacéutica II

Plataforma docente del curso 2627 (grupos C y E), Facultad de Farmacia,
Universidad de Granada.

---

## Arrancar el proyecto

```powershell
.\dev.ps1
```

Abre `http://localhost:3001`. Para generar el build de producción:

```powershell
.\dev.ps1 -Build
```

### Por qué hay un script en lugar de `npm run dev`

El proyecto vive en Google Drive (`K:`), y el sistema de ficheros virtual de
Drive no soporta lo que npm y Vite necesitan: escritura masiva de ficheros
pequeños, enlaces simbólicos y detección fiable de cambios. Un `npm install`
sobre `K:` falla con `EBADF: bad file descriptor` y deja `node_modules` a
medias, con paquetes corruptos que producen errores desconcertantes (por
ejemplo, un `tsc` que devuelve éxito sin comprobar nada).

`dev.ps1` separa los dos papeles: el código fuente se queda en Drive, y
`node_modules` y el servidor viven en `C:\Users\Juanjo\qfdos-v3-node`. El
script copia el código a la carpeta local antes de arrancar.

Si editas ficheros directamente en la copia local, recupéralos con:

```powershell
.\dev.ps1 -Back
```

---

## Acceso

La autenticación es Google OAuth 2.0, sin backend: el token de identidad se
decodifica en el navegador para leer el correo.

| Perfil | Dominios aceptados |
|---|---|
| Alumnado | `@correo.ugr.es`, `@go.ugr.es` |
| Profesorado | `juandiaz@ugr.es`, `juandiaz@go.ugr.es` |

Sólo esas dos direcciones de profesor abren el panel de gestión. El resto de
cuentas UGR entran como alumnado.

El Client ID se lee de `.env.local` (ver `.env.example`). Debe crearse con una
cuenta Gmail personal: Google Workspace no permite crear proyectos OAuth desde
cuentas institucionales administradas. En Google Cloud Console hay que añadir
`http://localhost:3001` a *Authorized JavaScript origins*.

---

## Subir materiales

Como profesor, hay dos accesos: el botón **Gestionar curso** de la cabecera y
**Subir materiales** en el panel azul del inicio. Ambos abren el CMS en la
pestaña *Materiales*, con arrastrar y soltar para PDF, PPTX, DOCX, imágenes y
audio (hasta 40 MB por fichero).

**Los ficheros se guardan en IndexedDB, es decir, en tu navegador.** No hay
servidor: el alumnado no los ve desde sus equipos. Para distribuirlos, sube la
misma copia a Google Drive y pega el enlace en el módulo correspondiente,
dentro de la pestaña *Módulos*.

---

## Enlaces de interés

Pestaña **Enlaces** de la barra superior. Recopila material externo —artículos,
informes regulatorios, casos clínicos— para que el alumnado vea qué hace la
química farmacéutica fuera del aula.

Para añadir uno: *Gestionar curso* → pestaña **Enlaces de Interés**, o el botón
*Añadir o editar enlaces* que aparece en la propia sección cuando entras como
profesor. Basta con pegar la dirección (si olvidas el `https://` se completa
solo) y escribir el resumen.

**El resumen es el contenido principal de la tarjeta**, no un subtítulo: es lo
que orienta al alumnado sobre qué mirar y por qué importa. Los campos
opcionales —fuente, duración, módulo relacionado— sirven para que puedan
decidir si les cuadra ahora. Marcar un enlace como *destacado* lo coloca el
primero.

Las categorías están en `RESOURCE_CATEGORIES` (`src/data/qfdosData.ts`); sólo
se muestran como filtro las que tienen algún enlace dentro. Los seis enlaces
iniciales son ejemplos: cámbialos por los tuyos.

---

## Estructuras químicas

Las estructuras se dibujan con **RDKit MinimalLib** (WASM), cargado desde CDN
en `index.html`. La geometría, la aromaticidad y la estereoquímica las deduce
RDKit del SMILES, y los descriptores (peso molecular, cLogP, HBD/HBA, TPSA,
enlaces rotables) se calculan sobre la marcha: no hay valores tabulados que
puedan contradecir a la molécula mostrada.

### Verificación contra PubChem

Los 40 SMILES del temario se contrastaron con PubChem. Los resultados están en
`COURSE_DATA_VERSION` (`src/data/qfdosData.ts`):

**No eran moléculas válidas** — cualquier renderizador falla con ellas:
haloperidol (valencia 5 en el carbono cetónico), zolpidem (imposible de
kekulizar).

**Esqueleto equivocado** — misma etiqueta, otra molécula: donepezilo
(2-tetralona en vez de indan-1-ona, con un CH₂ de más), sumatriptán
(sustituyentes intercambiados entre C3 y C5 del indol), ondansetrón (faltaba
el metileno y el sustituyente estaba en C1 en vez de C3), flumazenil (anillo
de siete miembros mal cerrado), naloxona (puente epoxi y 14-OH mal situados),
losartán (propilo en vez de butilo, y Cl/CH₂OH intercambiados).

**Sin estereoquímica** — morfina (5 centros), enalapril (3), captopril (2),
levodopa, rivastigmina, valaciclovir, ranitidina y pralidoxima. En levodopa
esto importa especialmente: la D-DOPA es inactiva.

Se dejaron sin estereodescriptores los fármacos que se comercializan como
racematos y que PubChem también registra así: salbutamol, propranolol,
atenolol, fluoxetina, ibuprofeno, cetirizina, verapamilo, donepezilo y
ondansetrón.

### Versionado del contenido

El temario se cachea en `localStorage`, así que un navegador que ya visitó la
plataforma conservaría indefinidamente las estructuras antiguas. Al arrancar,
la aplicación compara `COURSE_DATA_VERSION` con la versión guardada y descarta
la caché si difieren. **Sube esa constante cada vez que edites a mano los datos
del curso**; si no, los cambios no llegarán a quien ya haya entrado.

Hay dos tipos de contenido y sólo uno se purga (`App.tsx`):

| | Se regenera al subir la versión |
|---|---|
| `SHIPPED_KEYS` — temario, avisos, glosario | Sí: vienen del fichero de datos |
| Enlaces de interés y dudas del alumnado | **No**: los escribe el usuario |

Los enlaces se siembran con los ejemplos sólo la primera vez (`loadUserOwned`).
Si los borras todos, la lista se queda vacía en lugar de resucitarlos.

---

## Diseño

- **Tipografía** — Newsreader (titulares), Public Sans (interfaz),
  IBM Plex Mono (datos y códigos PDB).
- **Color** — navy institucional UGR profundizado con verde azulado de enlace;
  la menta es el único acento brillante. Los neutros tienen sesgo azul frío.
  El color semántico (correcto / aviso / error) es independiente del acento.
- **Temas** — claro y oscuro, incluyendo el estado «sistema» sin elección
  explícita. Las estructuras se redibujan con la paleta CPK adecuada al tema:
  sobre fondo oscuro, enlaces claros.

---

## Estructura

```
src/
  components/     Interfaz. Chem2DDrawer y MolPropertyStrip son la base química.
  context/        AuthContext (OAuth + roles) y ThemeContext.
  services/
    rdkitService  Carga de RDKit WASM, renderizado SVG y descriptores.
    fileStorage   Materiales del profesor en IndexedDB.
    geminiService Generación de exámenes.
  data/
    qfdosData.ts  Temario, fármacos, glosario, enlaces. COURSE_DATA_VERSION aquí.
```

Respecto a v2 se eliminaron el generador de apuntes por transcripción de audio
y el visor cristalográfico 3D. Los códigos PDB se conservan como enlaces al
RCSB.
