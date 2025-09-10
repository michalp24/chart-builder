# Chart Construction Notes

## Overview

This document captures the detailed construction methodology, color systems, themes, and tools used in building the Chart Builder application. This serves as a technical reference for future chart development and system expansion.

## Architecture

### Core Technologies
- **Framework**: Next.js 14 (App Router)
- **Chart Library**: Recharts (React-based D3 wrapper)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Theme Management**: next-themes
- **Type Safety**: TypeScript + Zod validation

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
│   ├── ui/                # shadcn/ui base components
│   ├── chart-canvas.tsx   # Core chart rendering
│   ├── chart-editor-modal.tsx # Chart editing interface
│   └── data-grid.tsx      # Editable data table
├── lib/                   # Utilities and schemas
│   ├── colors.ts          # Color management system
│   ├── svg.ts             # SVG export functionality
│   ├── schema.ts          # TypeScript/Zod schemas
│   └── chart-templates.ts # Predefined chart configs
```

## Color System

### NVIDIA Brand Colors
Primary color palette sourced from `nvidia_colors.json`:

#### Main Colors (300 series - primary palette)
- **NVIDIA Green**: `#81C784` (Primary brand color)
- **Teal**: `#4DB6AC` 
- **Blue**: `#42A5F5`
- **Indigo**: `#7986CB`
- **Purple**: `#BA68C8`
- **Pink**: `#F48FB1`
- **Red**: `#E57373`
- **Orange**: `#FFB74D`
- **Yellow**: `#FFF176`
- **Lime**: `#AED581`

#### Implementation
```typescript
// Default chart data colors (NVIDIA 300 series)
const CHART_COLORS_LIGHT = [
  '#81C784', // NVIDIA Green 300 (primary)
  '#4DB6AC', // Teal 300
  '#42A5F5', // Blue 300
  // ... additional colors
];
```

### Theme-Based UI Colors
Specific colors for chart elements that adapt to light/dark themes:

#### Grid Lines
- **Light Theme**: `#cccccc` (light gray)
- **Dark Theme**: `#313131` (dark gray)

#### Text & Labels
- **Light Theme**: `#222222` (dark gray text)
- **Dark Theme**: `#EEEEEE` (light gray text)

#### Implementation
```typescript
const getGridColor = () => {
  if (typeof document !== 'undefined') {
    const isDark = document.documentElement.classList.contains('dark');
    return isDark ? '#313131' : '#cccccc';
  }
  return '#cccccc';
};

const getTextColor = () => {
  if (typeof document !== 'undefined') {
    const isDark = document.documentElement.classList.contains('dark');
    return isDark ? '#EEEEEE' : '#222222';
  }
  return '#222222';
};
```

## Chart Construction

### Recharts Configuration

#### Chart Types Supported
1. **Area Charts** - Filled area graphs with gradient support
2. **Bar Charts** - Vertical and horizontal bar graphs
3. **Line Charts** - Single and multi-line graphs
4. **Pie Charts** - Circular data representation
5. **Radar Charts** - Multi-axis comparison charts

#### Common Chart Properties
```typescript
// Standard margins for all chart types
margin={{ top: 6, right: 30, left: 6, bottom: 60 }}

// Responsive container
<ResponsiveContainer width="100%" height="100%">

// Grid configuration
<CartesianGrid 
  strokeDasharray="3 3" 
  stroke={gridColor}
  // Conditional line visibility based on chart orientation
  verticalCoordinatesGenerator={() => []} // Hide vertical lines
  horizontalCoordinatesGenerator={() => []} // Hide horizontal lines
/>

// Axis configuration
<XAxis 
  tick={{ fontSize: 12, fill: textColor }}
  tickMargin={8}
/>
<YAxis 
  tick={{ fontSize: 12, fill: textColor }}
  tickMargin={8}
/>
```

### Grid Line Management
Grid lines are conditionally displayed based on chart orientation:

- **Vertical Charts** (Bar, Area, Line): Show horizontal grid lines only
- **Horizontal Charts** (Horizontal Bar): Show vertical grid lines only

```typescript
{isHorizontal ? (
  // Horizontal bar chart: Show vertical lines only
  <CartesianGrid 
    strokeDasharray="3 3"
    horizontalCoordinatesGenerator={() => []}
    stroke={gridColor}
  />
) : (
  // Vertical bar chart: Show horizontal lines only  
  <CartesianGrid 
    strokeDasharray="3 3"
    verticalCoordinatesGenerator={() => []}
    stroke={gridColor}
  />
)}
```

### Custom Legend Implementation
**Critical**: Recharts default `<Legend>` renders as HTML, not SVG, so it doesn't export.

#### SVG-Native Legend Solution
```typescript
// Custom SVG legend rendered directly in chart
{yKeys.map((key, index) => {
  const x = startX + (index * itemWidth);
  const label = fieldLabelMap[key] || key;
  
  return (
    <g key={`svg-legend-${key}`}>
      <rect
        x={x}
        y={legendY}
        width="12"
        height="12"
        fill={colors[key] || '#666'}
        rx="2"
        ry="2"
      />
      <text
        x={x + 18}
        y={legendY + 9}
        fontSize="12"
        fill={textColor}
        dominantBaseline="middle"
        textAnchor="start"
      >
        {label}
      </text>
    </g>
  );
})}
```

## Editing Tools

### Data Grid Component (`data-grid.tsx`)
- **Library**: TanStack Table
- **Features**: 
  - Inline cell editing
  - Dynamic column management
  - Real-time preview updates
  - Field label customization

### Chart Editor Modal (`chart-editor-modal.tsx`)
- **Live Preview**: Real-time chart updates
- **Data Editing**: Integrated data grid
- **Chart Settings**: Width/height controls
- **Color Picker**: Custom NVIDIA color selection
- **Export Functions**: SVG download and embed code generation

### Color Picker Component (`color-picker.tsx`)
- **Organization**: Colors grouped by category (Green, Teal, Blue, etc.)
- **Interface**: Dropdown-based selection per data category
- **Layout**: Responsive 3-column grid
- **Features**: Color preview, reset functionality

## Export System

### SVG Export (`svg.ts`)
Critical for maintaining colors and styling in exported files.

#### Key Functions
```typescript
export function exportSVG(svgElement: SVGSVGElement | HTMLDivElement, filename: string)
```

#### Color Resolution Process
1. **Extract SVG**: Find actual SVG element from container
2. **Clone Element**: Avoid modifying original
3. **Resolve Colors**: Convert CSS variables to actual hex/HSL values
4. **Inline Styles**: Embed critical styling directly
5. **Serialize**: Convert to XML string with proper DOCTYPE

#### Critical Color Mappings
```typescript
const colorMap: Record<string, string> = {
  // Chart colors
  'hsl(var(--chart-1))': isDark ? 'hsl(220, 70%, 50%)' : 'hsl(12, 76%, 61%)',
  // ... other chart colors
  
  // UI colors
  '#222222': '#222222', // Light theme text
  '#EEEEEE': '#EEEEEE', // Dark theme text
  '#cccccc': '#cccccc', // Light theme grid
  '#313131': '#313131', // Dark theme grid
};
```

### Embed System
- **Storage**: File-based persistence (`.chart-storage/charts.json`)
- **URLs**: `/embed/[id]` route for chart display
- **Layout**: Dedicated embed layout with hydration suppression
- **Documentation**: Complete integration guide at `/docs`

## Theme System

### Implementation
- **Provider**: `next-themes` with system detection
- **Classes**: Tailwind's `dark:` modifier classes
- **Detection**: `document.documentElement.classList.contains('dark')`
- **SSR Handling**: Conditional rendering with `typeof window !== 'undefined'`

### Theme-Aware Components
All chart elements dynamically adapt:
- Grid lines change color
- Text/labels change color  
- Code blocks in documentation
- UI components (cards, buttons, etc.)

## Data Management

### Schema Validation (`schema.ts`)
```typescript
export const ChartConfigSchema = z.object({
  type: z.enum(["area", "bar", "line", "pie", "radar"]),
  title: z.string(),
  xKey: z.string(),
  yKeys: z.array(z.string()),
  size: z.object({
    width: z.number().min(200).max(1200),
    height: z.number().min(200).max(800),
  }).optional(),
  colors: z.record(z.string(), z.string()).optional(),
  // ... other properties
});
```

### Chart Storage (`chart-storage.ts`)
- **Development**: File-based JSON storage
- **Production**: Could be adapted for database
- **Structure**: Maps with chart ID as key
- **Persistence**: Automatic save/load on server restart

## Technical Challenges & Solutions

### 1. Grid Line Alignment
**Problem**: Grid lines not aligning with chart elements (bars, areas)
**Solution**: Conditional coordinate generators to hide unwanted lines

### 2. Legend Export
**Problem**: Recharts Legend renders as HTML, doesn't export
**Solution**: Custom SVG-native legend implementation

### 3. Color Preservation in Export
**Problem**: CSS variables don't export to SVG
**Solution**: Comprehensive color resolution and inlining system

### 4. Theme Detection in SSR
**Problem**: `document` not available during server-side rendering
**Solution**: Conditional checks with `typeof window !== 'undefined'`

### 5. React Hook Dependencies
**Problem**: ESLint warnings for useEffect dependencies
**Solution**: Strategic `eslint-disable` comments and dependency optimization

## Known Issues

### Current Outstanding Issues
1. **Grid Lines Still Showing Both**: Despite multiple attempts with coordinate generators, both vertical and horizontal lines sometimes appear
2. **Next.js Config Warning**: Deprecated `appDir: true` in `next.config.js`

### Attempted Solutions for Grid Lines
1. `verticalPoints={[]}` and `horizontalPoints={[]}` props
2. `vertical={false}` and `horizontal={false}` boolean props  
3. `verticalCoordinatesGenerator={() => []}` and `horizontalCoordinatesGenerator={() => []}`

## Performance Considerations

### Optimization Strategies
- **Memoization**: Data and fields wrapped in `useMemo`
- **Conditional Rendering**: Charts only render when data is available
- **Lazy Loading**: Consider for embed iframes
- **Bundle Size**: Recharts adds ~326kB to bundle

### Build Optimizations
- Static page generation where possible
- Code splitting by route
- Tree shaking for unused utilities

## Future Enhancements

### Potential Improvements
1. **More Chart Types**: Scatter plots, heatmaps, treemaps
2. **Animation Support**: Recharts animation props
3. **Real-time Data**: WebSocket integration
4. **Collaborative Editing**: Multi-user chart editing
5. **Template System**: Predefined chart styles/themes
6. **API Integration**: Connect to external data sources
7. **Advanced Export**: PDF, PNG, high-res options

### Scalability Considerations
- Database storage for chart persistence
- CDN for static assets
- Caching strategies for heavy computation
- API rate limiting for embed endpoints

## Development Workflow

### Testing Strategy
- **Manual Testing**: Visual verification across themes
- **Cross-browser**: Chrome, Firefox, Safari compatibility
- **Responsive**: Mobile, tablet, desktop layouts
- **Export Testing**: SVG download and color verification

### Deployment Pipeline
1. **Local Development**: `npm run dev`
2. **Build Verification**: `npm run build` 
3. **Linting**: ESLint and TypeScript checks
4. **Git Workflow**: Feature branches with descriptive commits
5. **Vercel Deployment**: Automatic on main branch push

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code consistency and best practices
- **Prettier**: Code formatting (when configured)
- **Component Organization**: Clear separation of concerns

---

*This document should be updated as the chart system evolves and new features are added.*
