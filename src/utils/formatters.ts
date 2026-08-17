import { TutoringRequest, RequestFormData } from '../types';
import { SK_ADMIN_INFO } from '../data/tutorsData';

/**
 * Format numbers as Angolan Kwanzas (e.g., "5.000 Kz")
 */
export function formatKz(amount: number): string {
  return `${amount.toLocaleString('pt-AO')} Kz`;
}

/**
 * Mask and format Angolan phone numbers
 */
export function formatAngolaPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  
  if (digits.startsWith('244')) {
    const rest = digits.slice(3, 12);
    if (rest.length === 0) return '+244 ';
    if (rest.length <= 3) return `+244 ${rest}`;
    if (rest.length <= 6) return `+244 ${rest.slice(0, 3)} ${rest.slice(3)}`;
    return `+244 ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6, 9)}`;
  }

  // If user starts typing without 244 (e.g., 923...)
  if (digits.length <= 3) return digits ? `+244 ${digits}` : '';
  if (digits.length <= 6) return `+244 ${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `+244 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
}

/**
 * Generate a unique SK ISAF Tracking Code
 */
export function generateTrackingCode(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SK-ISAF-${year}-${randomSuffix}`;
}

/**
 * Build structured WhatsApp URL for direct sending to SK Team
 */
export function buildWhatsAppLink(
  request: TutoringRequest | RequestFormData,
  targetPhone = SK_ADMIN_INFO.whatsappCentral,
  trackingCode?: string
): string {
  const code = trackingCode || ('trackingCode' in request ? request.trackingCode : generateTrackingCode());
  const yearLabel = `${request.year}º Ano`;
  const semesterLabel = `${request.semester}º Semestre`;
  const urgencyLabel = 
    request.urgency === 'imediata' ? '🚨 IMEDIATA (Exame/Teste em <24h)' : 
    request.urgency === 'urgente' ? '⚡ URGENTE (<48h)' : '📘 Normal / Regular';
  
  const sessionLabel = 
    request.sessionPreference === 'presencial' ? '🏫 Presencial (Campus ISAF)' :
    request.sessionPreference === 'online' ? '💻 Online (Google Meet / Zoom)' : '🔄 Flexível (Presencial / Online)';

  const text = `🎓 *NOVA SOLICITAÇÃO DE APOIO ACADÉMICO - GRUPO SK (ISAF)*
━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 *Código de Referência:* \`${code}\`

👤 *DADOS DO ESTUDANTE:*
• *Nome:* ${request.studentName}
• *WhatsApp:* ${request.studentPhone}
• *E-mail:* ${request.studentEmail || 'Não informado'}

📚 *DADOS ACADÉMICOS (ISAF):*
• *Curso:* ${'courseName' in request && request.courseName ? request.courseName : request.courseId}
• *Nível:* ${yearLabel} | ${semesterLabel}
• *Disciplina:* *${request.discipline}*
• *Formato Desejado:* ${sessionLabel}
• *Nível de Urgência:* ${urgencyLabel}

📝 *DESCRIÇÃO DA DÚVIDA / NECESSIDADE:*
"${request.doubtDescription}"

${request.tags && request.tags.length > 0 ? `🏷️ *Tópicos:* ${request.tags.join(', ')}\n` : ''}
💰 *PROPOSTA DE VALOR / ORÇAMENTO:*
*${formatKz(request.budgetKz)}*
_(Proposta sujeita a confirmação com o tutor SK selecionado)_
━━━━━━━━━━━━━━━━━━━━━━━━━━
Por favor, confirmem a disponibilidade de um tutor compatível para esta matéria. Obrigado!`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Build structured Email template
 */
export function buildEmailTemplate(
  request: TutoringRequest | RequestFormData,
  trackingCode?: string
): { subject: string; body: string; mailtoUrl: string } {
  const code = trackingCode || ('trackingCode' in request ? request.trackingCode : generateTrackingCode());
  const subject = `[SK-ISAF] Solicitação de Apoio: ${request.discipline} - ${request.studentName} (${code})`;
  
  const body = `REQUISIÇÃO DE TUTORIA ACADÉMICA - GRUPO SK (ISAF)
============================================================
CÓDIGO DE RASTREIO: ${code}

1. DADOS DO ESTUDANTE:
- Nome Completo: ${request.studentName}
- Telefone / WhatsApp: ${request.studentPhone}
- E-mail: ${request.studentEmail}

2. DADOS ACADÉMICOS (ISAF):
- Curso: ${'courseName' in request && request.courseName ? request.courseName : request.courseId}
- Ano Académico: ${request.year}º Ano
- Semestre: ${request.semester}º Semestre
- Disciplina: ${request.discipline}
- Modalidade: ${request.sessionPreference}
- Urgência: ${request.urgency}

3. DESCRIÇÃO DA DÚVIDA / CONTEÚDO:
${request.doubtDescription}
${request.tags && request.tags.length > 0 ? `Tópicos: ${request.tags.join(', ')}` : ''}

4. PROPOSTA DE VALOR DO ALUNO:
${formatKz(request.budgetKz)}

============================================================
Enviado através da Plataforma Web SK - ISAF
Coordenação: ${SK_ADMIN_INFO.email} | WhatsApp: ${SK_ADMIN_INFO.whatsappDisplay}`;

  const mailtoUrl = `mailto:${SK_ADMIN_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return { subject, body, mailtoUrl };
}
