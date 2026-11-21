export const APP_PUBLIC_URL = 'https://biblia-tdo.vercel.app';

export const APP_SHARE_TITLE = 'Biblia · TDO — Mucho se pierde al traducir';

export const APP_SHARE_TEXT =
  '¿Alguna vez sentiste que un versículo dice aún más en su idioma original? Aquí lees la Traducción Directa con notas claras para entender a fondo al autor y un espacio diario de oración. Ábrela y agrégala a tu pantalla de inicio en un toque:';

export type ShareOutcome = 'shared' | 'copied' | 'cancelled';

/**
 * Comparte la aplicación directamente en 1 toque sin pasos intermedios.
 * - En móviles/navegadores compatibles: abre la hoja nativa (WhatsApp, Telegram, etc.)
 *   enviando el mensaje Estilo 2 + enlace (generando la tarjeta Open Graph con el logo).
 * - En escritorio sin Web Share API: copia el mensaje + enlace al portapapeles.
 */
export async function shareBibleApp(): Promise<ShareOutcome> {
  const shareUrl =
    typeof window !== 'undefined' && window.location.origin.startsWith('http')
      ? window.location.origin
      : APP_PUBLIC_URL;

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: APP_SHARE_TITLE,
        text: APP_SHARE_TEXT,
        url: shareUrl,
      });
      return 'shared';
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return 'cancelled';
      }
      // Si falla por políticas del navegador, cae al portapapeles
    }
  }

  try {
    await navigator.clipboard.writeText(`${APP_SHARE_TEXT}\n${shareUrl}`);
    return 'copied';
  } catch {
    return 'cancelled';
  }
}
