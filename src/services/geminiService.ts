// ==========================================================================
// Gemini AI Academic Services — QFDOS Web v3
// Generación de preguntas de examen y exportación de documentos.
// La función de transcripción de audio fue eliminada en v3.
// ==========================================================================

import { TestQuestion } from '../data/qfdosData';

const GEMINI_API_KEY_STORAGE_KEY = 'qfdos_gemini_api_key_v3';

export const getStoredGeminiApiKey = (): string =>
  localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY) || '';

export const setStoredGeminiApiKey = (key: string): void =>
  localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, key.trim());

const DEFAULT_CANDIDATE_MODELS = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest'
];

let cachedAvailableModels: string[] | null = null;

export const getAvailableGeminiModels = async (apiKey: string): Promise<string[]> => {
  if (cachedAvailableModels && cachedAvailableModels.length > 0) return cachedAvailableModels;
  if (!apiKey) return DEFAULT_CANDIDATE_MODELS;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.models)) {
        const supported = data.models
          .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
          .map((m: any) => m.name.replace(/^models\//, ''))
          .filter((m: string) => m !== 'gemini-1.5-pro');

        if (supported.length > 0) {
          const priority = DEFAULT_CANDIDATE_MODELS;
          const sorted = [
            ...priority.filter(m => supported.includes(m)),
            ...supported.filter((m: string) => !priority.includes(m))
          ];
          cachedAvailableModels = sorted;
          return sorted;
        }
      }
    }
  } catch (err) {
    console.warn('Could not query ListModels, using defaults:', err);
  }
  return DEFAULT_CANDIDATE_MODELS;
};

// Low-level caller with multi-model fallback
async function callGeminiWithFallback(apiKey: string, systemInstruction: string, promptText: string): Promise<string> {
  let lastError = '';
  const modelsToTry = await getAvailableGeminiModels(apiKey);

  for (const model of modelsToTry) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{ role: 'user', parts: [{ text: `${systemInstruction}\n\n${promptText}` }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 4000 }
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        const rawMsg = errorJson.error?.message || `HTTP ${response.status}`;
        if (response.status === 400 && rawMsg.includes('API_KEY_INVALID')) {
          throw new Error('La clave API de Google Gemini no es válida.');
        }
        if (response.status === 429 || rawMsg.includes('RESOURCE_EXHAUSTED')) {
          throw new Error('Límite de cuota alcanzado. Espera unos minutos.');
        }
        lastError = rawMsg;
        continue;
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (err: any) {
      if (err.message?.includes('clave API') || err.message?.includes('cuota')) throw err;
      lastError = err.message || String(err);
    }
  }
  throw new Error(`Gemini API Error: ${lastError || 'Ningún modelo respondió.'}`);
}

export function cleanRawLatexArtifacts(text: string): string {
  if (!text) return '';
  return text
    .replace(/\$\$\\Delta G\^0\$\$/g, 'ΔG°').replace(/\$\\Delta G\^\\circ\$/g, 'ΔG°')
    .replace(/\$K_d\$/g, 'Kd').replace(/\$K_i\$/g, 'Ki').replace(/\$K_m\$/g, 'Km')
    .replace(/\$IC_\{50\}\$/g, 'IC50').replace(/\$\\beta\$/g, 'β').replace(/\$\\alpha\$/g, 'α')
    .replace(/\$\\gamma\$/g, 'γ').replace(/\$\\mu\$/g, 'μ').replace(/\$GABA_A\$/g, 'GABA-A')
    .replace(/\$\$/g, '').replace(/\$/g, '');
}

interface GenerateExamParams {
  topicId: string;
  topicTitle: string;
  questionCount?: number;
  difficulty?: 'Fácil' | 'Medio' | 'Avanzado';
  customApiKey?: string;
}

export const generateExamQuestionsWithGemini = async ({
  topicId,
  topicTitle,
  questionCount = 3,
  difficulty = 'Medio',
  customApiKey
}: GenerateExamParams): Promise<TestQuestion[]> => {
  const activeKey = customApiKey || getStoredGeminiApiKey();
  if (!activeKey) return generateFallbackExamQuestions(topicId, topicTitle, questionCount, difficulty);

  const systemInstruction = `Eres el evaluador principal de Química Farmacéutica II (UGR).
Genera exactamente ${questionCount} preguntas tipo test de nivel ${difficulty} para el módulo "${topicTitle}".

REGLAS:
1. Responde ÚNICAMENTE con un bloque JSON válido con un array de objetos TestQuestion.
2. Cada objeto: { "question": "...", "options": ["A","B","C","D"], "correctIndex": 0, "explanation": "...", "difficulty": "${difficulty}", "block": "SAR & Dianas" }
3. CERO SINTAXIS LATEX: Usa caracteres Unicode (ΔG°, IC50, Kd, Ki, β-bloqueantes). No uses $.`;

  try {
    const responseText = await callGeminiWithFallback(activeKey, systemInstruction, `Genera ${questionCount} preguntas para ${topicTitle}. Solo el JSON.`);
    const cleaned = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) {
      return parsed.map((q, idx) => ({
        id: `gemini-q-${Date.now()}-${idx}`,
        topicId,
        question: cleanRawLatexArtifacts(q.question),
        options: Array.isArray(q.options) ? q.options.map((o: string) => cleanRawLatexArtifacts(o)) : [],
        correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
        explanation: cleanRawLatexArtifacts(q.explanation || 'Explicación oficial de cátedra.'),
        difficulty: q.difficulty || difficulty,
        block: q.block || 'Evaluación Oficial'
      }));
    }
  } catch (e) {
    console.warn('Gemini exam generation failed, using fallback:', e);
  }
  return generateFallbackExamQuestions(topicId, topicTitle, questionCount, difficulty);
};

// Export utilities
export const exportToWordDoc = ({ prefix, subject, professor, date, time, classroom, content, baseFileName }: {
  prefix: string; subject: string; professor: string; date?: string; time?: string; classroom?: string; content: string; baseFileName: string;
}) => {
  const htmlContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
<head><meta charset='utf-8'><style>
body{font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.5;color:#1e293b;margin:2cm}
h1{font-size:18pt;color:#1e3a8a;border-bottom:2px solid #0d9488;padding-bottom:4px}
h2{font-size:14pt;color:#0f766e;margin-top:18px}h3{font-size:12pt;color:#1e3a8a}
.meta{background:#f1f5f9;border-left:4px solid #0d9488;padding:10px 14px;margin-bottom:18px}
table{border-collapse:collapse;width:100%}th,td{border:1px solid #cbd5e1;padding:6px 10px}
th{background:#f8fafc;color:#1e3a8a;font-weight:bold}code{background:#f1f5f9;padding:2px 5px}
</style></head><body>
<h1>${prefix} — ${subject}</h1>
<div class="meta"><p><strong>Profesor:</strong> Dr. ${professor}</p>
<p><strong>Fecha:</strong> ${date || 'N/A'} | <strong>Hora:</strong> ${time || 'N/A'}</p>
<p><em>${classroom || 'Facultad de Farmacia, UGR'}</em></p></div>
<hr/><div>${content.replace(/\n/g, '<br>')}</div></body></html>`;

  const blob = new Blob(['﻿', htmlContent], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${baseFileName}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportToPdfPrint = ({ prefix, subject, professor, date, time, classroom, content, baseFileName }: {
  prefix: string; subject: string; professor: string; date?: string; time?: string; classroom?: string; content: string; baseFileName: string;
}) => {
  const w = window.open('', '_blank');
  if (!w) { alert('Permite ventanas emergentes para generar el PDF.'); return; }
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${baseFileName}</title>
<style>@page{size:A4;margin:20mm}body{font-family:'Segoe UI',sans-serif;font-size:11pt;line-height:1.6;color:#0f172a}
.header{border-bottom:2px solid #1e3a8a;padding-bottom:12px;margin-bottom:20px}
.title{font-size:20pt;font-weight:700;color:#1e3a8a}
.content{white-space:pre-wrap;font-size:10.5pt;line-height:1.65}
table{border-collapse:collapse;width:100%;margin:14px 0}th,td{border:1px solid #cbd5e1;padding:6px 8px}
th{background:#f1f5f9;font-weight:600}</style></head><body>
<div class="header"><h1 class="title">${prefix} — ${subject}</h1>
<div>Prof. <strong>${professor}</strong> · ${date || ''} · ${classroom || 'UGR'}</div></div>
<div class="content">${content}</div>
<script>window.onload=()=>window.print();</script></body></html>`);
  w.document.close();
};

export const exportToMarkdownFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.md') ? filename : `${filename}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

function generateFallbackExamQuestions(topicId: string, topicTitle: string, count: number, difficulty: string): TestQuestion[] {
  return [
    {
      id: `fallback-${Date.now()}-1`,
      topicId,
      question: `En el contexto de ${topicTitle}, ¿cuál es la ventaja fundamental de la Eficiencia de Ligando (LE = -ΔG° / Nheavy)?`,
      options: [
        'Permite medir la afinidad sin ensayos experimentales.',
        'Evalúa si la ganancia de afinidad compensa el incremento de peso molecular.',
        'Garantiza inhibición irreversible del target.',
        'Determina la velocidad de eliminación renal.'
      ],
      correctIndex: 1,
      explanation: 'LE normaliza la energía libre de unión por átomo pesado, evitando inflar innecesariamente el peso molecular durante la optimización.',
      difficulty: difficulty as any,
      block: 'Biofísica & SAR'
    },
    {
      id: `fallback-${Date.now()}-2`,
      topicId,
      question: '¿Cuál es la ecuación de Cheng-Prusoff para inhibición competitiva?',
      options: [
        'IC50 = Ki · (1 + [S]/Km)',
        'IC50 = Ki · ln([S] · Km)',
        'IC50 = Ki / (1 + [S] · Km)',
        'IC50 = ΔG° · R · T'
      ],
      correctIndex: 0,
      explanation: 'IC50 = Ki · (1 + [S]/Km): demuestra que a mayor [S] competidor, mayor será el IC50 observado respecto a la Ki intrínseca.',
      difficulty: difficulty as any,
      block: 'Cinética Enzimática'
    }
  ].slice(0, count);
}
