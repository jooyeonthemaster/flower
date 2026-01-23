// 풀 스펙트럼 색상 팔레트 생성 (사진처럼 색상표)
export const generateColorPalette = (): string[] => {
  // Row 1: 밝은 색상 (Saturation 100%, Lightness ~90%)
  const brightColors = [
    '#FFCCCC', '#FFE5CC', '#FFFFCC', '#E5FFCC', '#CCFFCC', '#CCFFE5',
    '#CCFFFF', '#CCE5FF', '#CCCCFF', '#E5CCFF', '#FFCCFF', '#FFCCE5',
    '#FFFFFF', '#E0E0E0', '#C0C0C0',
  ];

  // Row 2: 연한 색상 (Saturation 100%, Lightness ~75%)
  const lightColors = [
    '#FF9999', '#FFCC99', '#FFFF99', '#CCFF99', '#99FF99', '#99FFCC',
    '#99FFFF', '#99CCFF', '#9999FF', '#CC99FF', '#FF99FF', '#FF99CC',
    '#B0B0B0', '#909090', '#707070',
  ];

  // Row 3: 중간 밝기 (Saturation 100%, Lightness ~60%)
  const mediumLightColors = [
    '#FF6666', '#FFB366', '#FFFF66', '#B3FF66', '#66FF66', '#66FFB3',
    '#66FFFF', '#66B3FF', '#6666FF', '#B366FF', '#FF66FF', '#FF66B3',
    '#606060', '#505050', '#404040',
  ];

  // Row 4: 순수 색상 (Saturation 100%, Lightness ~50%)
  const pureColors = [
    '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80',
    '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080',
    '#FFD700', '#C0C0C0', '#303030',
  ];

  // Row 5: 진한 색상 (Saturation 100%, Lightness ~40%)
  const darkColors = [
    '#CC0000', '#CC6600', '#CCCC00', '#66CC00', '#00CC00', '#00CC66',
    '#00CCCC', '#0066CC', '#0000CC', '#6600CC', '#CC00CC', '#CC0066',
    '#DAA520', '#A0A0A0', '#202020',
  ];

  // Row 6: 더 진한 색상 (Saturation 100%, Lightness ~30%)
  const darkerColors = [
    '#990000', '#994D00', '#999900', '#4D9900', '#009900', '#00994D',
    '#009999', '#004D99', '#000099', '#4D0099', '#990099', '#99004D',
    '#B8860B', '#808080', '#101010',
  ];

  // Row 7: 아주 진한 색상 (Saturation 100%, Lightness ~20%)
  const deepColors = [
    '#660000', '#663300', '#666600', '#336600', '#006600', '#006633',
    '#006666', '#003366', '#000066', '#330066', '#660066', '#660033',
    '#8B4513', '#505050', '#000000',
  ];

  return [
    ...brightColors,
    ...lightColors,
    ...mediumLightColors,
    ...pureColors,
    ...darkColors,
    ...darkerColors,
    ...deepColors,
  ];
};
