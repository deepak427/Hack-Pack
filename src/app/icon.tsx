import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#fdfbf7',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#002b36',
          border: '2px solid #002b36',
          borderRadius: '50%',
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