
export class GeometryUtilities {

    static transformPoint(point, scale, translation) {
        const dx = translation?.x ?? 0;
        const dy = translation?.y ?? 0;
        const scaleX = scale?.x ?? 1;
        const scaleY = scale?.y ?? 1;
        let x = (point.x * scaleX) + dx;
        let y = (point.y * scaleY) + dy;
        //if (rotation) {
        //    const cos = Math.cos(rotation.radians ?? 0);
        //    const sin = Math.sin(rotation.radians ?? 0);
        //    const cx = rotation.center?.x ?? 0;
        //    const cy = rotation.center?.y ?? 0;
        //    x = (cos * (x - cx)) + (sin * (y - cy)) + cx;
        //    y = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        //}
        return { x: x, y: y };
    }

    static getLineEllipseIntersection(line, ellipse) {
        const { x1, y1, x2, y2 } = line;
        const { cx, cy, rx, ry } = ellipse;

        // calculate line direction vector
        const dx = x2 - x1;
        const dy = y2 - y1;

        // quadratic equation coefficients
        const a = (dx / rx) ** 2 + (dy / ry) ** 2;
        const b = 2 * ((dx / rx) * (x1 - cx) + (dy / ry) * (y1 - cy));
        const c = ((x1 - cx) / rx) ** 2 + ((y1 - cy) / ry) ** 2 - 1;

        // calculate discriminant
        const discriminant = b ** 2 - 4 * a * c;

        if (discriminant < 0) {
            return []; // No intersection
        }
        else if (discriminant === 0) {
            // One intersection point
            const t = -b / (2 * a);
            return [{ x: x1 + t * dx, y: y1 + t * dy }];
        }
        else {
            // Two intersection points
            const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            return [
                { x: x1 + t1 * dx, y: y1 + t1 * dy },
                { x: x1 + t2 * dx, y: y1 + t2 * dy }
            ];
        }
    }
}