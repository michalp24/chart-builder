// SVG export utilities
export function exportSVG(svgElement: SVGSVGElement | HTMLDivElement, filename: string) {
  // Find the actual SVG element if a container is passed
  let actualSvg: SVGSVGElement;
  
  if (svgElement instanceof HTMLDivElement) {
    const foundSvg = svgElement.querySelector('svg');
    if (!foundSvg) {
      throw new Error('No SVG element found in container');
    }
    actualSvg = foundSvg as SVGSVGElement;
  } else {
    actualSvg = svgElement;
  }
  
  // Clone the SVG element to avoid modifying the original
  const svgClone = actualSvg.cloneNode(true) as SVGSVGElement;
  
  // Resolve colors and inline critical styles
  resolveColorsAndInlineStyles(svgClone);
  
  // Serialize the SVG
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgClone);
  
  // Add XML declaration and DOCTYPE
  const fullSvgString = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
${svgString}`;
  
  // Create and trigger download
  const blob = new Blob([fullSvgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

function resolveColorsAndInlineStyles(element: Element) {
  const styles = window.getComputedStyle(element);
  const isDark = document.documentElement.classList.contains('dark');
  
  // Define color mappings
  const colorMap: Record<string, string> = {
    'hsl(var(--chart-1))': isDark ? 'hsl(220, 70%, 50%)' : 'hsl(12, 76%, 61%)',
    'hsl(var(--chart-2))': isDark ? 'hsl(160, 60%, 45%)' : 'hsl(173, 58%, 39%)',
    'hsl(var(--chart-3))': isDark ? 'hsl(30, 80%, 55%)' : 'hsl(197, 37%, 24%)',
    'hsl(var(--chart-4))': isDark ? 'hsl(280, 65%, 60%)' : 'hsl(43, 74%, 66%)',
    'hsl(var(--chart-5))': isDark ? 'hsl(340, 75%, 55%)' : 'hsl(27, 87%, 67%)',
    // Text and grid colors for theme consistency
    '#222222': '#222222', // Light theme text
    '#EEEEEE': '#EEEEEE', // Dark theme text
    '#cccccc': '#cccccc', // Light theme grid
    '#313131': '#313131', // Dark theme grid
  };
  
  // Step 1: Fix fill and stroke attributes directly
  ['fill', 'stroke'].forEach(attr => {
    const value = element.getAttribute(attr);
    if (value) {
      let resolvedColor = value;
      
      // Direct mapping
      if (colorMap[value]) {
        resolvedColor = colorMap[value];
      }
      // Handle var(--chart-X) pattern
      else if (value.includes('var(--chart-')) {
        const match = value.match(/var\(--chart-(\d+)\)/);
        if (match) {
          const key = `hsl(var(--chart-${match[1]}))`;
          resolvedColor = colorMap[key] || value;
        }
      }
      
      if (resolvedColor !== value) {
        element.setAttribute(attr, resolvedColor);
      }
    }
  });
  
  // Step 2: Handle computed styles for fill/stroke
  const computedFill = styles.getPropertyValue('fill');
  const computedStroke = styles.getPropertyValue('stroke');
  
  let inlineStyle = '';
  
  // Resolve computed fill
  if (computedFill && computedFill !== 'none' && !computedFill.includes('rgb(0, 0, 0)')) {
    let resolvedFill = computedFill;
    
    if (colorMap[computedFill]) {
      resolvedFill = colorMap[computedFill];
    } else if (computedFill.includes('var(--chart-')) {
      const match = computedFill.match(/var\(--chart-(\d+)\)/);
      if (match) {
        const key = `hsl(var(--chart-${match[1]}))`;
        resolvedFill = colorMap[key] || computedFill;
      }
    }
    
    if (resolvedFill !== computedFill) {
      inlineStyle += `fill: ${resolvedFill}; `;
      element.setAttribute('fill', resolvedFill);
    }
  }
  
  // Resolve computed stroke
  if (computedStroke && computedStroke !== 'none') {
    let resolvedStroke = computedStroke;
    
    if (colorMap[computedStroke]) {
      resolvedStroke = colorMap[computedStroke];
    } else if (computedStroke.includes('var(--chart-')) {
      const match = computedStroke.match(/var\(--chart-(\d+)\)/);
      if (match) {
        const key = `hsl(var(--chart-${match[1]}))`;
        resolvedStroke = colorMap[key] || computedStroke;
      }
    }
    
    if (resolvedStroke !== computedStroke) {
      inlineStyle += `stroke: ${resolvedStroke}; `;
      element.setAttribute('stroke', resolvedStroke);
    }
  }
  
  // Step 3: Add other critical properties
  const otherProps = ['stroke-width', 'stroke-dasharray', 'opacity', 'font-family', 'font-size'];
  otherProps.forEach(prop => {
    const value = styles.getPropertyValue(prop);
    if (value && value !== 'none' && value !== 'auto' && value !== 'normal' && value !== '0') {
      inlineStyle += `${prop}: ${value}; `;
    }
  });
  
  if (inlineStyle.trim()) {
    const existingStyle = element.getAttribute('style') || '';
    element.setAttribute('style', existingStyle + inlineStyle);
  }
  
  // Step 4: Handle legend elements specifically
  if (element.classList && element.classList.contains('recharts-legend-wrapper')) {
    // Force legend to be visible in export
    element.setAttribute('style', 'display: block !important;');
  }
  
  // Step 5: Process child elements recursively
  Array.from(element.children).forEach(child => resolveColorsAndInlineStyles(child));
}

export function getSVGFromRef(ref: React.RefObject<HTMLDivElement>): SVGSVGElement | null {
  if (!ref.current) return null;
  return ref.current.querySelector('svg');
}
