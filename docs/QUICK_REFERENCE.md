# Chart Builder Quick Reference

## Essential Colors

### NVIDIA Brand Colors (Primary Palette)
```typescript
const NVIDIA_COLORS = {
  primary: '#81C784',    // NVIDIA Green 300
  secondary: '#4DB6AC',  // Teal 300
  tertiary: '#42A5F5',   // Blue 300
  // Full palette in /public/nvidia_colors.json
};
```

### Theme-Based UI Colors
```typescript
// Grid lines
light: '#cccccc', dark: '#313131'

// Text/Labels  
light: '#222222', dark: '#EEEEEE'
```

## Chart Setup Checklist

### 1. Basic Chart Structure
```tsx
<ResponsiveContainer width="100%" height="100%">
  <ChartType 
    data={data}
    margin={{ top: 6, right: 30, left: 6, bottom: 60 }}
  >
    {/* Grid, Axes, Data Elements, Custom Legend */}
  </ChartType>
</ResponsiveContainer>
```

### 2. Grid Configuration
```tsx
// Vertical charts (show horizontal lines only)
<CartesianGrid 
  strokeDasharray="3 3"
  stroke={gridColor}
  verticalCoordinatesGenerator={() => []}
/>

// Horizontal charts (show vertical lines only)
<CartesianGrid 
  strokeDasharray="3 3" 
  stroke={gridColor}
  horizontalCoordinatesGenerator={() => []}
/>
```

### 3. Axes Setup
```tsx
<XAxis tick={{ fontSize: 12, fill: textColor }} tickMargin={8} />
<YAxis tick={{ fontSize: 12, fill: textColor }} tickMargin={8} />
```

### 4. Custom SVG Legend (Required for Export)
```tsx
{yKeys.map((key, index) => (
  <g key={`svg-legend-${key}`}>
    <rect x={x} y={legendY} width="12" height="12" fill={colors[key]} />
    <text x={x + 18} y={legendY + 9} fontSize="12" fill={textColor}>
      {label}
    </text>
  </g>
))}
```

## Component Patterns

### Theme Color Detection
```typescript
const getGridColor = () => {
  if (typeof document !== 'undefined') {
    const isDark = document.documentElement.classList.contains('dark');
    return isDark ? '#313131' : '#cccccc';
  }
  return '#cccccc';
};
```

### Error Handling
```typescript
try {
  return renderChart();
} catch (error) {
  return <div>Chart error: {error instanceof Error ? error.message : 'Unknown error'}</div>;
}
```

## Export Requirements

### SVG Export Color Mapping
```typescript
const colorMap: Record<string, string> = {
  '#222222': '#222222', // Light theme text
  '#EEEEEE': '#EEEEEE', // Dark theme text
  '#cccccc': '#cccccc', // Light theme grid
  '#313131': '#313131', // Dark theme grid
};
```

### Container Ref Setup
```tsx
// Use HTMLDivElement ref, not SVGSVGElement
const svgRef = useRef<HTMLDivElement>(null);

// Wrap chart in div with ref
<div ref={svgRef}>
  <ChartCanvas />
</div>
```

## Common Pitfalls

❌ **Don't Use Recharts Default Legend** - Doesn't export to SVG
✅ **Use Custom SVG Legend** - Renders directly in chart

❌ **Don't Use CSS Variables in Export** - Won't resolve
✅ **Use Direct Color Values** - Properly mapped theme colors  

❌ **Don't Access `document` in SSR** - Causes errors
✅ **Check `typeof window !== 'undefined'`** - Safe client-side access

❌ **Don't Use Both Grid Line Types** - Causes visual clutter  
✅ **Use Conditional Grid Lines** - Based on chart orientation

## File Locations

- **Chart Templates**: `/src/lib/chart-templates.ts`
- **Color System**: `/src/lib/colors.ts` 
- **SVG Export**: `/src/lib/svg.ts`
- **Core Chart Component**: `/src/components/chart-canvas.tsx`
- **NVIDIA Colors**: `/public/nvidia_colors.json`

## Testing Checklist

- [ ] Light theme renders correctly
- [ ] Dark theme renders correctly  
- [ ] SVG export preserves colors
- [ ] Legend appears in export
- [ ] Grid lines align properly
- [ ] Text is readable in both themes
- [ ] Responsive on mobile/tablet
- [ ] No console errors
