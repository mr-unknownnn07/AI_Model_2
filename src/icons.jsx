/* global React */
// Lightweight SVG icons for PlantCure AI
const Ico = ({ d, size = 18, stroke = 2, fill = 'none', className = '', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={`ico ${className}`} style={style}>
    <path d={d} />
  </svg>
);

const IcoHome = (p) => <Ico {...p} d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5Z" />;
const IcoLeaf = (p) => <Ico {...p} d="M11 20A7 7 0 0 1 4 13V4h9a7 7 0 0 1 7 7c0 5-4 9-9 9zM5 20c3.5-5 7-7 13-8" />;
const IcoScan = (p) => <Ico {...p} d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10" />;
const IcoPill = (p) => <Ico {...p} d="M10.5 20.5a7 7 0 0 1-7-7 7 7 0 0 1 2-5l8-8a7 7 0 0 1 10 10l-8 8a7 7 0 0 1-5 2ZM8.5 8.5l7 7" />;
const IcoShop = (p) => <Ico {...p} d="M3 3h2l.4 2M5 7h14l-1.5 9a2 2 0 0 1-2 1.7H8.4a2 2 0 0 1-2-1.7L5 7ZM9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />;
const IcoUsers = (p) => <Ico {...p} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />;
const IcoSearch = (p) => <Ico {...p} d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.35-4.35" />;
const IcoBell = (p) => <Ico {...p} d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9ZM10.3 21a2 2 0 0 0 3.4 0" />;
const IcoArrowR = (p) => <Ico {...p} d="M5 12h14M13 5l7 7-7 7" />;
const IcoArrowUR = (p) => <Ico {...p} d="M7 17 17 7M7 7h10v10" />;
const IcoPlus = (p) => <Ico {...p} d="M12 5v14M5 12h14" />;
const IcoClose = (p) => <Ico {...p} d="M18 6 6 18M6 6l12 12" />;
const IcoUpload = (p) => <Ico {...p} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />;
const IcoCamera = (p) => <Ico {...p} d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2v11ZM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />;
const IcoSparkle = (p) => <Ico {...p} d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />;
const IcoDroplet = (p) => <Ico {...p} d="M12 2s7 7.58 7 13a7 7 0 1 1-14 0c0-5.42 7-13 7-13Z" />;
const IcoSun = (p) => <Ico {...p} d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />;
const IcoThermo = (p) => <Ico {...p} d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4 4 0 1 0 5 0Z" />;
const IcoHeart = (p) => <Ico {...p} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />;
const IcoMsg = (p) => <Ico {...p} d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />;
const IcoBookmark = (p) => <Ico {...p} d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" />;
const IcoGrid = (p) => <Ico {...p} d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />;
const IcoStar = (p) => <Ico {...p} d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />;
const IcoFilter = (p) => <Ico {...p} d="M22 3H2l8 9.46V19l4 2v-8.54L22 3Z" />;
const IcoCheck = (p) => <Ico {...p} d="m20 6-11 11-5-5" />;
const IcoChart = (p) => <Ico {...p} d="M3 3v18h18M7 16l4-4 4 4 5-5" />;
const IcoBook = (p) => <Ico {...p} d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" />;

Object.assign(window, {
  IcoHome, IcoLeaf, IcoScan, IcoPill, IcoShop, IcoUsers, IcoSearch, IcoBell,
  IcoArrowR, IcoArrowUR, IcoPlus, IcoClose, IcoUpload, IcoCamera, IcoSparkle,
  IcoDroplet, IcoSun, IcoThermo, IcoHeart, IcoMsg, IcoBookmark, IcoGrid, IcoStar,
  IcoFilter, IcoCheck, IcoChart, IcoBook
});
