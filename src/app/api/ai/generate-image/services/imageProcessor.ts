// 이미지를 다운로드하여 base64 Data URL로 변환
export async function downloadAndConvertToDataUrl(imageUrl: string): Promise<string> {
  console.log('Image URL found:', imageUrl);

  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error('이미지 다운로드 실패');
  }

  const imageBuffer = await imageResponse.arrayBuffer();
  const imageBase64 = Buffer.from(imageBuffer).toString('base64');
  const dataUrl = `data:image/png;base64,${imageBase64}`;

  console.log(`Image downloaded. Size: ${imageBuffer.byteLength} bytes`);

  return dataUrl;
}
