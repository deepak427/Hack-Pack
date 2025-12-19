import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 72,
          background: '#fdfbf7',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#002b36',
          border: '8px solid #002b36',
          borderRadius: '20%',
          fontFamily: 'serif',
          fontWeight: 'bold',
        }}
      >
        📚
      </div>
    ),
    {
      ...size,
    }
  )
}