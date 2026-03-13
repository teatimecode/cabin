import React from 'react';

/**
 * Windows 95 像素风格图标
 * 基于 React95 官方图标设计，使用像素风格的 SVG
 */

// 我的电脑图标 (32x32 像素风格)
export const ComputerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" shapeRendering="crispEdges" viewBox="-0.5 -0.5 32 32" style={{ display: 'inline-block' }}>
    <path stroke="gray" d="M7 0h21M6 1h1m20 0h1M5 2h1m20 0h2M4 3h1m20 0h3M3 4h1m21 0h3M3 5h1m2 0h17m2 0h3M3 6h1m21 0h3M3 7h1m21 0h3M3 8h1m21 0h3M3 9h1m21 0h3M3 10h1m6 0h1m14 0h3M3 11h1m6 0h1m14 0h3M3 12h1m6 0h1m2 0h1m11 0h3M3 13h1m9 0h1m11 0h3M3 14h1m9 0h1m11 0h3M3 15h1m21 0h3M3 16h1m21 0h3M3 17h1m21 0h3M3 18h1m21 0h3M3 19h1m21 0h2m1 0h3M3 20h23m1 0h2m1 0h1m-5 1h2m1 0h2M1 22h26m1 0h3M0 23h1m26 0h4M0 24h1m26 0h4M0 25h1m14 0h10m2 0h4M0 26h1m26 0h4M0 27h1m20 0h1m5 0h4M0 28h1m26 0h3M0 29h1m26 0h2M0 30h28"/>
    <path stroke="silver" d="M7 1h19M6 2h19M5 4h20M5 5h1m18 0h1M5 6h1m18 0h1M5 7h1m18 0h1M5 8h1m18 0h1M5 9h1m18 0h1M5 10h1m18 0h1M5 11h1m18 0h1M5 12h1m18 0h1M5 13h1m18 0h1M5 14h1m18 0h1M5 15h1m18 0h1M5 16h1m18 0h1M5 17h1m18 0h1M5 18h1m18 0h1M5 19h20m4 1h1m-2 1h1m-2 1h1M2 24h25M2 25h13m10 0h2M2 26h2m2 0h9m10 0h2M2 27h2m2 0h15m1 0h5M2 28h25M2 29h25"/>
    <path stroke="#fff" d="M26 1h1m-2 1h1M5 3h20M4 4h1M4 5h1m18 0h1M4 6h1m18 0h1M4 7h1m18 0h1M4 8h1m18 0h1M4 9h1m18 0h1M4 10h1m6 0h5m7 0h1M4 11h1m6 0h2m10 0h1M4 12h1m6 0h2m1 0h5m4 0h1M4 13h1m9 0h5m4 0h1M4 14h1m9 0h5m4 0h1M4 15h1m18 0h1M4 16h1m18 0h1M4 17h1m18 0h1M4 18h1m1 0h18M4 19h1m-4 4h26M1 24h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1"/>
    <path stroke="#000" d="M28 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1M6 6h16m6 0h1M6 7h1m21 0h1M6 8h1m21 0h1M6 9h1m3 0h7m11 0h1M6 10h1m9 0h1m11 0h1M6 11h1m12 0h1m8 0h1M6 12h1m12 0h1m8 0h1M6 13h1m3 0h3m6 0h1m8 0h1M6 14h1m12 0h1m8 0h1M6 15h1m6 0h7m8 0h1M6 16h1m21 0h1m-1 1h1m-1 1h1m-2 1h1m-2 1h1m4 0h1M3 21h23m5 0h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-17 1h10m6 0h1m-1 1h1m-2 1h1m-2 1h1m-2 1h1M1 31h27"/>
    <path stroke="navy" d="M22 6h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-10 1h6m3 0h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1M6 17h17"/>
    <path stroke="#00f" d="M7 7h15M7 8h1m1 0h13M7 9h1m1 0h1m7 0h5M7 10h3m7 0h5M7 11h3m10 0h2M7 12h3m10 0h2M7 13h3m10 0h2M7 14h6m7 0h2M7 15h6m7 0h2M7 16h15"/>
    <path stroke="#0ff" d="M8 8h1M8 9h1"/>
    <path stroke="#0f0" d="M4 26h2"/>
    <path stroke="green" d="M4 27h2"/>
  </svg>
);

// 文件夹图标 (32x32 像素风格)
export const FolderIcon = ({ open = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" shapeRendering="crispEdges" viewBox="-0.5 -0.5 32 32" style={{ display: 'inline-block' }}>
    {open ? (
      <>
        <path stroke="gray" d="M1 4h15M0 5h1m15 0h1M0 6h1m15 0h1M0 7h1m15 0h14M0 8h1m15 0h1M0 9h1m15 0h1M0 10h1m15 0h1M0 11h1m15 0h1M0 12h1m15 0h1M0 13h1m15 0h1M0 14h1m15 0h1M0 15h1m15 0h1M0 16h1m15 0h1M0 17h1m15 0h1M0 18h1m15 0h1M0 19h1m15 0h1M0 20h1m15 0h1M0 21h1m15 0h1M0 22h1m15 0h1M0 23h1m15 0h1M0 24h1m15 0h1M0 25h1m15 0h1M0 26h1m29 0h1M0 27h31M1 28h30"/>
        <path stroke="#ff0" d="M1 5h15M1 6h1m13 0h1M1 7h1m13 0h1m1 0h12M1 8h1m13 0h1m12 0h1M1 9h1m13 0h1m12 0h1M1 10h1m13 0h1m12 0h1M1 11h1m13 0h1m12 0h1M1 12h1m13 0h1m12 0h1M1 13h1m13 0h1m12 0h1M1 14h1m13 0h1m12 0h1M1 15h1m13 0h1m12 0h1M1 16h1m13 0h1m12 0h1M1 17h1m13 0h1m12 0h1M1 18h1m13 0h1m12 0h1M1 19h1m13 0h1m12 0h1M1 20h1m13 0h1m12 0h1M1 21h1m13 0h1m12 0h1M1 22h1m13 0h1m12 0h1M1 23h1m13 0h1m12 0h1M1 24h1m13 0h1m12 0h1M1 25h1m13 0h1m12 0h1M1 26h29"/>
        <path stroke="#000" d="M16 5h1m0 1h1m0 1h1m13 2h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1M1 27h30"/>
        <path stroke="olive" d="M2 6h13M2 7h13m1 1h12M2 9h13m12 0h1M2 10h13m12 0h1M2 11h13m12 0h1M2 12h13m12 0h1M2 13h13m12 0h1M2 14h13m12 0h1M2 15h13m12 0h1M2 16h13m12 0h1M2 17h13m12 0h1M2 18h13m12 0h1M2 19h13m12 0h1M2 20h13m12 0h1M2 21h13m12 0h1M2 22h13m12 0h1M2 23h13m12 0h1M2 24h13m12 0h1M2 25h13m12 0h1"/>
      </>
    ) : (
      <>
        <path stroke="#000" d="M1 6h17M0 7h1m17 0h13M0 8h1m30 0h1M0 9h1m30 0h1M0 10h1m30 0h1M0 11h1m30 0h1M0 12h1m30 0h1M0 13h1m30 0h1M0 14h1m30 0h1M0 15h1m30 0h1M0 16h1m30 0h1M0 17h1m30 0h1M0 18h1m30 0h1M0 19h1m30 0h1M0 20h1m30 0h1M0 21h1m30 0h1M0 22h1m30 0h1M0 23h1m30 0h1M0 24h1m30 0h1M0 25h1m30 0h1M0 26h1m30 0h1M0 27h31M1 28h30"/>
        <path stroke="gray" d="M1 7h17m-6 1h18M1 9h12m6 0h12M1 10h12m6 0h12M1 11h12m6 0h12M1 12h12m6 0h12M1 13h12m6 0h12M1 14h12m6 0h12M1 15h12m6 0h12M1 16h12m6 0h12M1 17h12m6 0h12M1 18h12m6 0h12M1 19h12m6 0h12M1 20h12m6 0h12M1 21h12m6 0h12M1 22h12m6 0h12M1 23h12m6 0h12M1 24h12m6 0h12M1 25h12m6 0h12M1 26h30"/>
        <path stroke="#ff0" d="M18 7h12M1 8h11m7 0h12M13 9h6m13 0h1M13 10h6m13 0h1M13 11h6m13 0h1M13 12h6m13 0h1M13 13h6m13 0h1M13 14h6m13 0h1M13 15h6m13 0h1M13 16h6m13 0h1M13 17h6m13 0h1M13 18h6m13 0h1M13 19h6m13 0h1M13 20h6m13 0h1M13 21h6m13 0h1M13 22h6m13 0h1M13 23h6m13 0h1M13 24h6m13 0h1M13 25h6m13 0h1M1 26h1"/>
        <path stroke="olive" d="M12 8h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1"/>
      </>
    )}
  </svg>
);

// 文档图标 (32x32 像素风格)
export const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" shapeRendering="crispEdges" viewBox="-0.5 -0.5 32 32" style={{ display: 'inline-block' }}>
    <path stroke="#000" d="M4 0h17M3 1h1m17 0h1M2 2h1m18 0h1M1 3h1m19 0h1M0 4h1m20 0h10M0 5h1m29 0h1M0 6h1m29 0h1M0 7h1m29 0h1M0 8h1m29 0h1M0 9h1m29 0h1M0 10h1m29 0h1M0 11h1m29 0h1M0 12h1m29 0h1M0 13h1m29 0h1M0 14h1m29 0h1M0 15h1m29 0h1M0 16h1m29 0h1M0 17h1m29 0h1M0 18h1m29 0h1M0 19h1m29 0h1M0 20h1m29 0h1M0 21h1m29 0h1M0 22h1m29 0h1M0 23h1m29 0h1M0 24h1m29 0h1M0 25h1m29 0h1M0 26h1m29 0h1M0 27h1m29 0h1M0 28h1m29 0h1M0 29h1m29 0h1M0 30h31M1 31h30"/>
    <path stroke="#fff" d="M4 1h17M3 2h1m17 0h1M2 3h1m18 0h1M1 4h1m19 0h9M1 5h1m29 0h1M1 6h1m29 0h1M1 7h1m29 0h1M1 8h1m29 0h1M1 9h1m29 0h1M1 10h1m29 0h1M1 11h1m29 0h1M1 12h1m29 0h1M1 13h1m29 0h1M1 14h1m29 0h1M1 15h1m29 0h1M1 16h1m29 0h1M1 17h1m29 0h1M1 18h1m29 0h1M1 19h1m29 0h1M1 20h1m29 0h1M1 21h1m29 0h1M1 22h1m29 0h1M1 23h1m29 0h1M1 24h1m29 0h1M1 25h1m29 0h1M1 26h1m29 0h1M1 27h1m29 0h1M1 28h1m29 0h1M1 29h1m29 0h1M1 30h30"/>
    <path stroke="gray" d="M21 1h1m-1 1h1m-1 1h1M21 4h9m1 0h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1M1 31h30"/>
    <path stroke="silver" d="M22 2h-1M4 3h17m-1 1h1M2 5h19m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1"/>
    <path stroke="#00f" d="M4 7h14m-14 2h14m-14 2h14m-14 2h10"/>
  </svg>
);

// 记事本图标 (32x32 像素风格)
export const NotepadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" shapeRendering="crispEdges" viewBox="-0.5 -0.5 32 32" style={{ display: 'inline-block' }}>
    <path stroke="#000" d="M4 0h24M3 1h1m24 0h1M2 2h1m25 0h1M1 3h1m26 0h1M0 4h31M0 5h31M0 6h1m29 0h1M0 7h1m29 0h1M0 8h1m29 0h1M0 9h1m29 0h1M0 10h1m29 0h1M0 11h1m29 0h1M0 12h1m29 0h1M0 13h1m29 0h1M0 14h1m29 0h1M0 15h1m29 0h1M0 16h1m29 0h1M0 17h1m29 0h1M0 18h1m29 0h1M0 19h1m29 0h1M0 20h1m29 0h1M0 21h1m29 0h1M0 22h1m29 0h1M0 23h1m29 0h1M0 24h1m29 0h1M0 25h1m29 0h1M0 26h1m29 0h1M0 27h1m29 0h1M0 28h1m29 0h1M0 29h1m29 0h1M0 30h31M1 31h30"/>
    <path stroke="#fff" d="M4 1h24M3 2h1m24 0h1M2 3h1m25 0h1M1 4h30M1 5h30M1 6h30M1 7h30M1 8h30M1 9h30M1 10h30M1 11h30M1 12h30M1 13h30M1 14h30M1 15h30M1 16h30M1 17h30M1 18h30M1 19h30M1 20h30M1 21h30M1 22h30M1 23h30M1 24h30M1 25h30M1 26h30M1 27h30M1 28h30M1 29h30M1 30h30"/>
    <path stroke="navy" d="M4 2h24M3 3h26M1 7h2m26 0h1M1 8h29M1 9h29"/>
    <path stroke="gray" d="M28 2h1m-1 1h1"/>
    <path stroke="silver" d="M3 6h26M3 10h26M3 11h1m24 0h1M3 12h1m24 0h1M3 13h1m24 0h1M3 14h1m24 0h1M3 15h1m24 0h1M3 16h1m24 0h1M3 17h1m24 0h1M3 18h1m24 0h1M3 19h1m24 0h1M3 20h1m24 0h1M3 21h1m24 0h1M3 22h1m24 0h1M3 23h1m24 0h1M3 24h1m24 0h1M3 25h1m24 0h1M3 26h1m24 0h1M3 27h1m24 0h1M3 28h1m24 0h1"/>
    <path stroke="#00f" d="M5 12h22M5 14h18M5 16h20M5 18h16M5 20h22M5 22h19M5 24h21M5 26h17"/>
  </svg>
);

// 图片图标 (32x32 像素风格)
export const PictureIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" shapeRendering="crispEdges" viewBox="-0.5 -0.5 32 32" style={{ display: 'inline-block' }}>
    <path stroke="#000" d="M0 0h32M0 1h1m30 0h1M0 2h1m30 0h1M0 3h1m30 0h1M0 4h1m30 0h1M0 5h1m30 0h1M0 6h1m30 0h1M0 7h1m30 0h1M0 8h1m30 0h1M0 9h1m30 0h1M0 10h1m30 0h1M0 11h1m30 0h1M0 12h1m30 0h1M0 13h1m30 0h1M0 14h1m30 0h1M0 15h1m30 0h1M0 16h1m30 0h1M0 17h1m30 0h1M0 18h1m30 0h1M0 19h1m30 0h1M0 20h1m30 0h1M0 21h1m30 0h1M0 22h1m30 0h1M0 23h1m30 0h1M0 24h1m30 0h1M0 25h1m30 0h1M0 26h1m30 0h1M0 27h1m30 0h1M0 28h1m30 0h1M0 29h1m30 0h1M0 30h32"/>
    <path stroke="#fff" d="M1 1h30M1 2h30M1 3h30M1 4h30M1 5h30M1 6h30M1 7h30M1 8h30M1 9h30M1 10h30M1 11h30M1 12h30M1 13h30M1 14h30M1 15h30M1 16h30M1 17h30M1 18h30M1 19h30M1 20h30M1 21h30M1 22h30M1 23h30M1 24h30M1 25h30M1 26h30M1 27h30M1 28h30M1 29h30"/>
    <path stroke="#0f0" d="M4 24h3m-3 1h4m-4 1h5m-5 1h5m-4 1h4m-3 1h3"/>
    <path stroke="green" d="M7 24h2m-2 1h2m-2 1h2m-2 1h2m-1 1h1"/>
    <path stroke="#00f" d="M18 22h3m-3 1h4m-4 1h5m-5 1h5m-4 1h4m-3 1h3m-2 1h2"/>
    <path stroke="navy" d="M21 22h2m-2 1h2m-2 1h2m-2 1h2m-1 1h1"/>
    <path stroke="#ff0" d="M20 4h4m-5 1h1m4 0h1m-6 1h1m4 0h2m-6 1h1m5 0h1m-6 1h1m4 0h2m-5 1h1m3 0h1M20 9h1m2 0h2m-4 1h4m-3 1h2m-1 1h1"/>
    <path stroke="red" d="M4 18h2m-2 1h3m-3 1h4m-4 1h4m-3 1h3m-2 1h2"/>
    <path stroke="maroon" d="M6 18h1m0 1h1m0 1h1m0 1h1m0 1h1"/>
  </svg>
);

// 回收站图标 (32x32 像素风格)
export const RecycleBinIcon = ({ empty = true }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" shapeRendering="crispEdges" viewBox="-0.5 -0.5 32 32" style={{ display: 'inline-block' }}>
    <path stroke="#000" d="M9 2h14M8 3h1m14 0h1M7 4h1m15 0h1M6 5h1m16 0h1M5 6h1m17 0h1M4 7h1m18 0h1M3 8h1m19 0h1M3 9h1m19 0h1M3 10h1m19 0h1M3 11h1m19 0h1M3 12h1m19 0h1M3 13h1m19 0h1M3 14h1m19 0h1M3 15h1m19 0h1M3 16h1m19 0h1M3 17h1m19 0h1M3 18h1m19 0h1M3 19h1m19 0h1M3 20h1m19 0h1M3 21h1m19 0h1M3 22h1m19 0h1M3 23h1m19 0h1M3 24h1m19 0h1M3 25h1m19 0h1M3 26h1m19 0h1M3 27h1m19 0h1M4 28h1m17 0h1M5 29h1m15 0h1M6 30h20"/>
    <path stroke="gray" d="M9 3h14M8 4h1m14 0h1M7 5h1m15 0h1M6 6h1m16 0h1M5 7h1m17 0h1M4 8h1m18 0h1M4 9h1m18 0h1M4 10h1m18 0h1M4 11h1m18 0h1M4 12h1m18 0h1M4 13h1m18 0h1M4 14h1m18 0h1M4 15h1m18 0h1M4 16h1m18 0h1M4 17h1m18 0h1M4 18h1m18 0h1M4 19h1m18 0h1M4 20h1m18 0h1M4 21h1m18 0h1M4 22h1m18 0h1M4 23h1m18 0h1M4 24h1m18 0h1M4 25h1m18 0h1M4 26h1m18 0h1M4 27h1m18 0h1M5 28h1m16 0h1M6 29h1m15 0h1"/>
    <path stroke="silver" d="M9 4h13M8 5h14M7 6h15M6 7h16M5 8h17M5 9h17M5 10h17M5 11h17M5 12h17M5 13h17M5 14h17M5 15h17M5 16h17M5 17h17M5 18h17M5 19h17M5 20h17M5 21h17M5 22h17M5 23h17M5 24h17M5 25h17M5 26h17M5 27h17M6 28h15M7 29h13"/>
    {!empty && (
      <>
        <path stroke="#000" d="M10 12h3m-3 1h1m2 0h1m-4 1h1m2 0h1m-3 1h2m-1 1h1m5-4h3m-3 1h1m2 0h1m-4 1h1m2 0h1m-3 1h2m-1 1h1"/>
        <path stroke="#fff" d="M11 13h2m-2 1h1m0 1h1m6-2h2m-2 1h1m0 1h1"/>
      </>
    )}
  </svg>
);

// 图标映射
export const IconMap = {
  'my-computer': ComputerIcon,
  'folder': FolderIcon,
  'folder-open': (props) => <FolderIcon open {...props} />,
  'document': DocumentIcon,
  'notepad': NotepadIcon,
  'picture': PictureIcon,
  'recycle-bin': RecycleBinIcon,
  'recycle-bin-full': (props) => <RecycleBinIcon empty={false} {...props} />,
};

// 获取图标组件
export function getIcon(iconName) {
  const IconComponent = IconMap[iconName];
  return IconComponent ? <IconComponent /> : <DocumentIcon />;
}

export default IconMap;
