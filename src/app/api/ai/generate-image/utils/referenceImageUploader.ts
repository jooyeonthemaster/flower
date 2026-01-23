// 참조 이미지를 Firebase Storage에 업로드
export async function uploadReferenceImage(
  referenceImage: string,
  requestUrl: string
): Promise<string | null> {
  if (!referenceImage) {
    return null;
  }

  console.log('Reference image provided, preparing for upload...');

  if (referenceImage.startsWith('data:')) {
    try {
      const uploadResponse = await fetch(new URL('/api/upload-image', requestUrl).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataUrl: referenceImage,
          filename: `nano-banana-ref-${Date.now()}.png`,
        }),
      });

      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json();
        if (uploadResult.success && uploadResult.url) {
          console.log('Reference image uploaded to Firebase:', uploadResult.url);
          return uploadResult.url;
        }
      }
    } catch (uploadError) {
      console.error('Reference image upload failed:', uploadError);
    }
    return null;
  } else {
    // 이미 URL인 경우
    console.log('Reference image is already a URL:', referenceImage);
    return referenceImage;
  }
}
