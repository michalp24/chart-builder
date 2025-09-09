// SVG export utilities
export function exportSVG(svgElement: SVGSVGElement, filename: string) {
  // Clone the SVG element to avoid modifying the original
  const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
  
  // Get computed styles and inline them
  inlineStyles(svgClone);
  
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

function inlineStyles(element: Element) {
  const styles = window.getComputedStyle(element);
  const styleString = Array.from(styles).reduce((str, property) => {
    return str + `${property}:${styles.getPropertyValue(property)};`;
  }, "");
  
  element.setAttribute("style", styleString);
  
  // Recursively inline styles for child elements
  Array.from(element.children).forEach(child => inlineStyles(child));
}

export function getSVGFromRef(ref: React.RefObject<SVGSVGElement>): SVGSVGElement | null {
  return ref.current;
}
