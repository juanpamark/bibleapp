import { ImageResponse } from 'next/og';

export const alt =
  'Biblia TDO — Mucho se pierde al traducir. Descubre lo que el autor realmente dijo.';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

const LOGO_URL =
  'https://res.cloudinary.com/xdjdubsz/image/upload/v1795221895/logo_de_la_app_biblia.png';

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FAF6F1 0%, #F3E9DD 55%, #EADBC9 100%)',
          padding: '54px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '54px',
            backgroundColor: '#FFFDF9',
            borderRadius: '40px',
            border: '2px solid rgba(154, 67, 34, 0.16)',
            boxShadow: '0 24px 60px rgba(68, 42, 22, 0.12)',
            padding: '52px 58px',
          }}
        >
          {/* Logo oficial protagonista */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '264px',
              height: '264px',
              borderRadius: '54px',
              backgroundColor: '#FAF6F1',
              border: '2px solid rgba(154, 67, 34, 0.18)',
              boxShadow: '0 18px 40px rgba(139, 90, 43, 0.16)',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_URL}
              alt="Logo Biblia TDO"
              width={264}
              height={264}
              style={{
                width: '264px',
                height: '264px',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Copy editorial Opción A */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              gap: '18px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '2.5px',
                color: '#9A4322',
                fontFamily: 'sans-serif',
                textTransform: 'uppercase',
              }}
            >
              BIBLIA · TRADUCCIÓN DIRECTA (TDO)
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: '50px',
                fontWeight: 700,
                color: '#1E1712',
                lineHeight: 1.12,
                letterSpacing: '-0.8px',
              }}
            >
              Mucho se pierde al traducir.
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: '25px',
                color: '#4F4237',
                lineHeight: 1.4,
                fontFamily: 'sans-serif',
              }}
            >
              Descubre lo que el autor realmente dijo desde el texto original, con notas claras y guía diaria de oración.
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#9A4322',
                  color: '#FAF6F1',
                  padding: '13px 26px',
                  borderRadius: '999px',
                  fontSize: '20px',
                  fontWeight: 600,
                  fontFamily: 'sans-serif',
                }}
              >
                Agrégala a tu pantalla de inicio
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
