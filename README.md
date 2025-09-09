# Chart Builder

A powerful, intuitive web application for creating beautiful, interactive charts with ease. Built with Next.js 14, TypeScript, and Recharts.

![Chart Builder Preview](https://via.placeholder.com/800x400/1f2937/f9fafb?text=Chart+Builder+Screenshot)

## ✨ Features

### 📊 Chart Types
- **Area Charts** - Show trends over time with filled areas
- **Bar Charts** - Compare values across categories  
- **Line Charts** - Track changes over time
- **Pie Charts** - Display proportions and percentages
- **Radar Charts** - Compare multiple variables
- **Radial Charts** - Show progress or completion

### 📈 Data Input Methods
- **Manual Editing** - Interactive grid with add/remove rows and columns
- **CSV/XLSX Import** - Drag-and-drop file import with automatic type detection
- **JSON Editor** - Direct JSON data input with validation

### 🎨 Export & Sharing
- **SVG Export** - Download scalable vector graphics with embedded fonts
- **Embed Code** - Generate iframe snippets for websites
- **Live Preview** - Real-time chart updates as you edit

### 🎯 User Experience
- **Responsive Design** - Works on desktop and tablet devices
- **Accessibility** - Full keyboard navigation and screen reader support
- **Type Safety** - Complete TypeScript implementation with Zod validation
- **Modern UI** - Built with Tailwind CSS and shadcn/ui components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chart-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🏗️ Usage

### Creating Your First Chart

1. **Choose a Preset** - Select from 6 chart types in the left panel
2. **Add Your Data** - Use the center panel to input data via:
   - Manual grid editing
   - CSV/XLSX file upload
   - JSON data entry
3. **Preview & Export** - View live preview in right panel and export as SVG or get embed code

### Data Format

Charts expect data in this structure:
```json
{
  "fields": [
    { "key": "category", "label": "Category" },
    { "key": "value", "label": "Value" }
  ],
  "rows": [
    { "category": "A", "value": 100 },
    { "category": "B", "value": 150 }
  ]
}
```

### Embedding Charts

1. Create your chart
2. Click "Get Embed Code" 
3. Copy the generated iframe code
4. Paste into your website HTML

```html
<iframe src="https://yourhost.com/embed/chart-id" 
        width="600" height="400" 
        style="border:0">
</iframe>
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library
- **Recharts** - Composable charting library

### Data Processing
- **Zod** - Schema validation and type inference
- **Papa Parse** - CSV parsing
- **SheetJS** - Excel file processing
- **TanStack Table** - Powerful data grid

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting (implied)
- **TypeScript** - Type checking

## 📁 Project Structure

```
chart-builder/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── api/charts/     # Chart CRUD API endpoints
│   │   ├── builder/        # Main chart builder interface
│   │   └── embed/          # Chart embed pages
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui base components
│   │   ├── chart-canvas.tsx    # Recharts integration
│   │   ├── preset-gallery.tsx # Chart type selection
│   │   ├── data-editor.tsx     # Data input interface
│   │   └── data-grid.tsx       # Editable data table
│   └── lib/               # Utility functions
│       ├── schema.ts      # Zod schemas and types
│       ├── colors.ts      # Chart color mappings
│       └── svg.ts         # SVG export utilities
├── docs/prd/              # Product requirements
└── README.md
```

## 🔧 API Reference

### Charts API

#### GET /api/charts
List all saved charts
```json
{
  "charts": [
    {
      "id": "abc123",
      "type": "bar",
      "createdAt": "2024-01-01T00:00:00Z",
      "dataPoints": 5,
      "fields": 2
    }
  ]
}
```

#### POST /api/charts
Create a new chart
```json
{
  "config": { /* ChartConfig object */ },
  "dataset": { /* Dataset object */ }
}
```

#### GET /api/charts/:id
Get a specific chart
```json
{
  "id": "abc123",
  "config": { /* ChartConfig */ },
  "dataset": { /* Dataset */ },
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## 🎨 Customization

### Adding New Chart Types

1. Add type to `ChartType` in `src/lib/schema.ts`
2. Create preset in `src/components/preset-gallery.tsx`
3. Add rendering logic to `src/components/chart-canvas.tsx`

### Styling Charts

Chart colors use CSS custom properties:
```css
:root {
  --chart-1: 12 76% 61%;    /* hsl values */
  --chart-2: 173 58% 39%;
  /* ... up to --chart-5 */
}
```

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

## 🚦 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the [workspace rules](docs/prd/chart-builder-v1.md) for feature development
- Create PRDs for new features
- Include tests for new functionality
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- 📖 [Documentation](docs/)
- 🐛 [Report Issues](https://github.com/yourorg/chart-builder/issues)
- 💬 [Discussions](https://github.com/yourorg/chart-builder/discussions)

---

Made with ❤️ by the Chart Builder team