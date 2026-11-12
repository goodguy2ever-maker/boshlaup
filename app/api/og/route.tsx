import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get('title') || 'BoshlaUp';
    const tagline = searchParams.get('tagline') || 'Платформа запуска и валидации стартапов';
    const category = searchParams.get('category') || 'Startup';
    const stage = searchParams.get('stage') || 'MVP';
    const region = searchParams.get('region') || 'Ташкент';
    const upvotes = searchParams.get('upvotes') || '0';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#18181B',
            padding: '60px 70px',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {/* Top Brand Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '36px',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                }}
              >
                <span style={{ color: '#FFFFFF' }}>Boshla</span>
                <span style={{ color: '#FF5A1F' }}>Up</span>
              </div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#A1A1AA',
                  borderLeft: '1px solid #3F3F46',
                  paddingLeft: '16px',
                }}
              >
                IDEA LAUNCHPAD
              </div>
            </div>

            {/* Stage Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 20px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 90, 31, 0.15)',
                border: '1px solid rgba(255, 90, 31, 0.4)',
                color: '#FF5A1F',
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              {stage}
            </div>
          </div>

          {/* Main Content Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div
              style={{
                fontSize: title.length > 25 ? '54px' : '68px',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 400,
                color: '#D4D4D8',
                lineHeight: 1.35,
                maxWidth: '960px',
              }}
            >
              {tagline}
            </div>
          </div>

          {/* Bottom Badges Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '28px',
              borderTop: '1px solid #27272A',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 18px',
                  backgroundColor: '#27272A',
                  color: '#FAFAFA',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 600,
                }}
              >
                {category}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 18px',
                  backgroundColor: '#27272A',
                  color: '#A1A1AA',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 500,
                }}
              >
                {region}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#FF5A1F',
                color: '#FFFFFF',
                padding: '10px 24px',
                borderRadius: '14px',
                fontSize: '22px',
                fontWeight: 800,
              }}
            >
              <span>▲</span>
              <span>{upvotes}</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 });
  }
}
