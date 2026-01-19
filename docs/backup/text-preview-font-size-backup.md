# TextPreviewStep 폰트 사이즈 조절 기능 백업

**백업 날짜**: 2026-01-12
**사유**: UI 간소화 - 폰트 사이즈 60px로 고정
**원본 파일**: `src/components/ai-hologram/steps/TextPreviewStep.tsx`

---

## 백업된 코드

### 1. State 선언 (Line 49)

```typescript
const [showSizeDropdown, setShowSizeDropdown] = useState(false);
```

### 2. customSettings 초기값 (Line 36-43)

```typescript
const [customSettings, setCustomSettings] = useState<CustomSettings>({
  textColor: '#ffffff',
  glowColor: '#00ffff',
  effects: [], // 기본값: 이펙트 없음
  textPosition: 'random' as const,
  fontSize: 120, // ← 120px (크게)
  fontFamily: "'Noto Sans KR', sans-serif",
});
```

### 3. Player에 fontSize 전달 (Line 381)

```typescript
<Player
  component={HologramTextOverlay}
  inputProps={{
    videoSrc: '', // No video yet
    imageSrc: generatedImageUrl, // Use generated image
    texts: sceneData.scenes.map(s => s.text),
    fontSize: customSettings.fontSize, // ← customSettings에서 가져옴
    fontFamily: customSettings.fontFamily,
    textColor: customSettings.textColor,
    glowColor: customSettings.glowColor,
    effects: customSettings.effects, // 이펙트 배열 전달
    textPosition: customSettings.textPosition,
  }}
  durationInFrames={sceneData.scenes.length * 30 * 5} // 5 sec per scene
  compositionWidth={1080}
  compositionHeight={1080}
  fps={30}
  controls
  loop
  autoPlay
  style={{
    width: '100%',
    height: '100%',
  }}
/>
```

### 4. 폰트 크기 드롭다운 UI (Line 613-655)

```typescript
{/* 텍스트 크기 - 드롭다운 (위로 열림, 불투명) */}
<div className="relative">
  <label className="text-xs text-gray-400 block mb-2">크기</label>
  <button
    onClick={() => setShowSizeDropdown(!showSizeDropdown)}
    className="w-full flex items-center justify-between px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
  >
    <span className="text-sm text-white">
      {
        [
          { size: 60, name: '작게' },
          { size: 80, name: '보통' },
          { size: 120, name: '크게' },
        ].find(s => s.size === customSettings.fontSize)?.name || '크기'
      }
    </span>
    <span className="text-gray-400">{showSizeDropdown ? '▲' : '▼'}</span>
  </button>
  {showSizeDropdown && (
    <div className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-gray-900 rounded-lg border border-white/20 z-50 shadow-2xl">
      {[
        { size: 60, name: '작게' },
        { size: 80, name: '보통' },
        { size: 120, name: '크게' },
      ].map(({ size, name }) => (
        <button
          key={size}
          onClick={() => {
            setCustomSettings({ ...customSettings, fontSize: size });
            setShowSizeDropdown(false);
          }}
          className={`w-full text-left px-3 py-2 rounded-lg text-xs mb-1 last:mb-0 ${
            customSettings.fontSize === size
              ? 'bg-blue-500 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          } transition-all`}
        >
          {name}
        </button>
      ))}
    </div>
  )}
</div>
```

---

## 복구 방법

이 기능을 다시 추가하려면:

1. **State 추가**: Line 49에 `const [showSizeDropdown, setShowSizeDropdown] = useState(false);` 추가
2. **초기값 변경**: Line 41의 `fontSize: 60`을 `fontSize: 120` 또는 원하는 기본값으로 변경
3. **Player 수정**: Line 381의 `fontSize={60}`을 `fontSize={customSettings.fontSize}`로 변경
4. **UI 추가**: 위의 "폰트 크기 드롭다운 UI" 코드를 Line 613 위치에 삽입

---

## 변경 이유

- UI 간소화 및 사용자 경험 개선
- 대부분의 사용자가 기본 크기(작게, 60px)를 선호
- 텍스트 크기 조절로 인한 레이아웃 깨짐 방지
- 이펙트 설정에 집중할 수 있도록 옵션 축소
