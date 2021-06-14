/**
 * Created by Nolan Bridges
 * GitHub: https://github.com/NMBridges
 * June 11, 2020
 */

/**
 * A webpage element that is used, in this case, to extract image pixel data.
 */
var helpCanvas = document.getElementById("helpCanvas");
helpCanvas.width = 0;
helpCanvas.height = 0;
helpCanvas.hidden = true;

/**
 * A webpage element that is used, in this case, to render and save new images.
 */
 var mainCanvas = document.getElementById("mainCanvas");
 mainCanvas.width = window.innerWidth / 2;
 mainCanvas.height = window.innerHeight / 2;

/**
 * Holds pixel data about the user's uploaded image.
 */
class RawImage {
    /**
     * Creates a RawImage with the inputted dimensions.
     * @param {number} width The width, in pixels, of the image. Must be an integer.
     * @param {number} height The height, in pixels, of the image. Must be an integer.
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.pixels = Array.from(Array(height), () => new Array(width));
    }

    /**
     * Loads a single colored pixel into a specified position in the image
     * @param {number} row The row (y-position) of the pixel in the image.
     *      Must be an integer.
     * @param {number} col The column (x-position) of the pixel in the image.
     *      Must be an integer.
     * @param {Color} color The color of the new pixel.
     */
    loadSinglePixel(row, col, color) {
        this.pixels[row][col] = color;
    }

    /**
     * Loads a single dimension array of colors into a two-dimensional array
     * that stores the pixel colors of the image.
     * @param {Color[]} colors An array of color objects.
     */
    loadAllPixels(colors) {
        if(colors.length != this.width * this.height) {
            console.log("Color array length does not match expected value of pixel array length.");
            return;
        }

        var colorIndex = 0;
        for(var row = 0; row < this.height; row++) {
            for(var col = 0; col < this.width; col++) {
                this.pixels[row][col] = colors[colorIndex];
                colorIndex++;
            }
        }
    }
}

/**
 * Holds color data in the RGBA format.
 */ 
class Color {
    /**
     * 
     * @param {number} r Integer value that represents the red value.
     * @param {number} g Integer value that represents the green value.
     * @param {number} b Integer value that represents the blue value.
     * @param {number} a Integer value that represents the alpha value.
     */
    constructor(r, g, b, a) {
        /** @type {number} Integer value that represents the red value. */
        this.r = r;
        /** @type {number} Integer value that represents the green value. */
        this.g = g;
        /** @type {number} Integer value that represents the blue value. */
        this.b = b;
        /** @type {number} Integer value that represents the alpha value. */
        this.a = a;
    }
}

/**
 * Holds the values of a coordinate pair in 2-dimensional space.
 */
 class Vector2 {
    /** 
     * @param {number} x Floating point value that represents the x-value
     * of the Vector2.
     * @param {number} y Floating point value that represents the y-value
     * of the Vector2.
     */
    constructor(x, y) {
        /** @type {number} Floating point value that represents the x-value
         * of the Vector2.
         */
        this.x = x;
        /** @type {number} Floating point value that represents the y-value
         * of the Vector2.
         */
        this.y = y;
    }
}

/**
 * Holds the values of a coordinate set in 3-dimensional space.
 */
 class Vector3 {
    /** 
     * @param {number} x Floating point value that represents the x-value
     * of the Vector3.
     * @param {number} y Floating point value that represents the y-value
     * of the Vector3.
     * @param {number} z Floating point value that represents the z-value
     * of the Vector3.
     */
    constructor(x, y,z) {
        /** @type {number} Floating point value that represents the x-value
         * of the Vector3.
         */
        this.x = x;
        /** @type {number} Floating point value that represents the y-value
         * of the Vector3.
         */
        this.y = y;
        /** @type {number} Floating point value that represents the z-value
         * of the Vector3.
         */
        this.z = z;
    }

    toString() {
        return "(" + this.x + ", " + this.y + ", " + this.z + ")";
    }
}

/**
 * A class for holding both a coordinate pair and the status of the Point as
 * being 'used' in any triangle.
 */
class Point {
    /**
     * @param {number} x Floating point value that represents the x-value
     * of the Point.
     * @param {number} y Floating point value that represents the y-value
     * of the Point.
     */
    constructor(x, y) {
        /** @type {number} Floating point value that represents the x-value of the Point. */
        this.x = x;
        /** @type {number} Floating point value that represents the y-value of the Point. */
        this.y = y;
        /** @type {boolean} The status of the Point as being 'used' in any triangle. */
        this.used = false;
    }

    /**
     * Updates the instance variable 'used.'
     * @param {boolean} newStatus
     */
    setUsed(newStatus) {
        this.used = newStatus;
    }

    toString() {
        return "(" + this.x + ", " + this.y + ") : " + this.used;
    }
}

/**
 * A class that holds the data for a 3x3 matrix and can calculate it's determinant
 */
class Matrix3D {
    /** 
     * @param {Vector3} topVec Vector3 value that represents the data for the top row
     * of the matrix.
     * @param {Vector3} midVec Vector3 value that represents the data for the middle row
     * of the matrix.
     * @param {Vector3} botVec Vector3 value that represents the data for the bottom row
     * of the matrix.
     */
    constructor(topVec, midVec, botVec) {
        /** @type {Vector3} Vector3 value for the top row of the matrix. */
        this.topVec = topVec;
        /** @type {Vector3} Vector3 value for the middle row of the matrix. */
        this.midVec = midVec;
        /** @type {Vector3} Vector3 value for the bottom row of the matrix. */
        this.botVec = botVec;
    }

    /**
     * @returns The determinant of the 3x3 matrix.
     */
    determinant() {
        const i = this.topVec.x * (this.midVec.y * this.botVec.z - this.midVec.z * this.botVec.y);
        const j = this.topVec.y * (this.midVec.x * this.botVec.z - this.midVec.z * this.botVec.x);
        const k = this.topVec.z * (this.midVec.x * this.botVec.y - this.midVec.y * this.botVec.x);
        return i - j + k;
    }
}

/**
 * An object used to store color data about the user's inputted image.
 */
var img = new RawImage();

/**
 * @type {Point[]} An array that stores the coordinates of all the randomly generated points.
 * All x and y-values are between 0.0 and 1.0.
 */
var points = [];

/**
 * @type {Vector3[]} An array that stores the indices of the points of the triangles.
 *      
 * e.g. triangles[0] = new Vector3(0, 1, 2) with 0, 1, and 2 being the indices
 * of points from 'points'
 */
var triangles = [];

/**
 * @type {number} The number of points in the x-direction per row.
 */
var xPoints;
/**
 * @type {number} The number of points in the y-direction per column.
 */
var yPoints;

window.addEventListener('load', function() {
    /**
     * The webpage element that asks the user to upload an image.
     */
    const fileSelector = document.getElementById('fileSelector');

    /**
     * The webpage element that is added invisibly to the helpCanvas. It contains
     * the source image uploaded by the user and is used by the helpCanvas to extract
     * pixel data about said image.
     */
    const loadedImage = document.getElementById('loadedImage');
    loadedImage.hidden = true;

    /**
     * When a file is uploaded, it calls the 'readImage()' function to
     * appropriately analyze the new file. This is the 'main' of the
     * triangle calculation.
     */
    fileSelector.addEventListener('change', (event) => {
        const fileList = event.target.files;
        readImage(fileList[0]);
        generatePoints(3, 3, 0.1, 1);
        drawPoints();
        createTriangles();
    });

    /**
     * Analyzes the inputted image file, extracting pixel data and storing
     * it in the 'img' RawImage object.
     * @param {File} file The inputted image file to analyze.
     */
    function readImage(file) {
        // Check if the file is an image.
        if (file.type && !file.type.startsWith('image/')) {
            console.log('File is not an image.', file.type, file);
            return;
        }
        
        /**
         * The reader that is used to help set the source of the invisible image
         * element to the value of the uploaded file.
         */
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            loadedImage.src = event.target.result;
            loadedImage.onload = function() {
                // Adds the new image to the helpCanvas and resizes it accordingly.
                helpCanvas.width = loadedImage.width;
                helpCanvas.height = loadedImage.height;
                helpCanvas.getContext('2d').drawImage(loadedImage, 0, 0, loadedImage.width, loadedImage.height);
                
                img = new RawImage(helpCanvas.width, helpCanvas.height);

                for(var y = 0; y < helpCanvas.height; y++) {
                    for(var x = 0; x < helpCanvas.width; x++) {
                        const pData = helpCanvas.getContext('2d').getImageData(x, y, 1, 1).data;
                        img.loadSinglePixel(y, x, new Color(pData[0], pData[1], pData[2], pData[3]));
                    }
                }

                console.log(img);
            }
        });
        reader.readAsDataURL(file);
    }

    /**
     * 
     * @param {number} x The number of points in each row horizontally. Must be an integer and >= 2.
     * @param {number} y The number of points in each column vertically. Must be an integer and >= 2.
     * @param {number} randomFactor The amplitude of randomness used to jitter the points. Between 0.0 and 1.0.
     * @param {number} seed A random offset value used in the random number generation.
     */
    function generatePoints(x, y, randomFactor, seed) {
        if(x < 2 || y < 2) {
            return;
        }

        xPoints = x;
        yPoints = y;
        points = [];
        // Generates a grid of randomly generated points
        for(var xCount = 0; xCount < x; xCount++) {
            for(var yCount = 0; yCount < y; yCount++) {
                var newXValue = (xCount + (Math.random() - 0.5) * randomFactor ) / (x - 1);
                var newYValue = (yCount + (Math.random() - 0.5) * randomFactor ) / (y - 1);

                if(newXValue < 0.0 || xCount == 0) {
                    newXValue = 0.0;
                }
                if(newXValue > 1.0 || xCount == x - 1) {
                    newXValue = 1.0;
                }

                if(newYValue < 0.0 || yCount == 0) {
                    newYValue = 0.0;
                }
                if(newYValue > 1.0 || yCount == y - 1) {
                    newYValue = 1.0;
                }

                var newPoint = new Point(newXValue, newYValue, false);
                points.push(newPoint);
            }
        }
    }

    /**
     * Draws the points within the 'points' array.
     */
    function drawPoints() {
        for(var pointIndex = 0; pointIndex < points.length; pointIndex++) {
            mainCanvas.getContext('2d').fillRect(points[pointIndex].x * (mainCanvas.width - 1), points[pointIndex].y * (mainCanvas.height - 1), 1, 1);
        }
    }

    /**
     * Draws the triangles within the 'triangles' array.
     */
    function drawTriangles() {
        for(var triIndex = 0; triIndex < triangles.length; triIndex++) {
            mainCanvas.getContext('2d').beginPath();
            mainCanvas.getContext('2d').moveTo(points[triangles[triIndex].x].x * (mainCanvas.width - 1), points[triangles[triIndex].x].y * (mainCanvas.height - 1));
            mainCanvas.getContext('2d').lineTo(points[triangles[triIndex].y].x * (mainCanvas.width - 1), points[triangles[triIndex].y].y * (mainCanvas.height - 1));
            mainCanvas.getContext('2d').lineTo(points[triangles[triIndex].z].x * (mainCanvas.width - 1), points[triangles[triIndex].z].y * (mainCanvas.height - 1));
            mainCanvas.getContext('2d').lineTo(points[triangles[triIndex].x].x * (mainCanvas.width - 1), points[triangles[triIndex].x].y * (mainCanvas.height - 1));
            mainCanvas.getContext('2d').stroke();
        }
    }

    /**
     * Finds the incenter of the triangle given the triangle's three vertices.
     * @param {Vector2} p1 The first point of the triangle.
     * @param {Vector2} p2 The second point of the triangle.
     * @param {Vector2} p3 The third point of the triangle.
     * @return {Vector2} The incenter of the triangle, as a Vector2.
     */
    function findTriangleIncenter(p1, p2, p3) {
        const s1 = Math.sqrt( (p2.x - p3.x) * (p2.x - p3.x) + (p2.y - p3.y) * (p2.y - p3.y) );
        const s2 = Math.sqrt( (p1.x - p3.x) * (p1.x - p3.x) + (p1.y - p3.y) * (p1.y - p3.y) );
        const s3 = Math.sqrt( (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y) );
        return new Vector2( (p1.x + p2.x + p3.x) / (s1 + s2 + s3), (p1.y + p2.y + p3.y) / (s1 + s2 + s3) );
    }

    /**
     * Returns whether the first point is counterclockwise or clockwise (small angle) from the
     * second point, relative to the center point.
     * @param {Vector2} p1 The first point.
     * @param {Vector2} p2 The second point.
     * @param {Vector2} center The central point (incenter) from which the points are compared.
     */
    function isCounterclockwise(p1, p2, center) {
        return (p1.x - center.x) * (p2.y - center.y) - (p2.x - center.x) * (p1.y - center.y) < 0;
    }

    /**
     * Starting with a triangle large enough to contain all points, it adds points one-by-one, flipping
     * triangles appropriately.
     */
    function createTriangles() {
        // Starts the list of triangles.
        triangles = [];

        points[0].used = true;
        points[xPoints - 1].used = true;
        points[points.length - 1].used = true;
        points[(xPoints - 1) * (yPoints)].used = true;
        triangles.push(new Vector3(xPoints - 1, 0, points.length - 1));
        triangles.push(new Vector3(points.length - 1, 0, (xPoints - 1) * (yPoints)));

        console.log("YO" + points);
        // Loops through list of all points, adds them, and flips triangles appropriately.
        for(var newPointIndex = 0; newPointIndex < points.length; newPointIndex++) {
            if(!points[newPointIndex].used) {
                const pt = new Vector2(points[newPointIndex].x, points[newPointIndex].y);
                for(var triIndex = 0; triIndex < triangles.length; triIndex++) {
                    if(isPointInsideTriangle(pt, triangles[triIndex])) {
                        var outTri = triangles[triIndex];
                        if(newPointIndex != outTri.x && newPointIndex != outTri.y && newPointIndex != outTri.z) {
                            // IF pt != any of triangles[triIndex].x,y,z
                            // Subdivides triangle into three new triangles
                            const v1 = triangles[triIndex].x;
                            const v2 = triangles[triIndex].y;
                            const v3 = triangles[triIndex].z;
                            triangles.push(reorderCounterclockwise(new Vector3(v1, v2, newPointIndex)));
                            triangles.push(reorderCounterclockwise(new Vector3(v1, v3, newPointIndex)));
                            triangles.push(reorderCounterclockwise(new Vector3(v3, v2, newPointIndex)));
                            //triangles.splice(triIndex, 1);
                            break;
                        }
                    }
                }
                points[newPointIndex].used = true;
            }
        }
        drawTriangles();
    }

    /**
     * Returns whether or not the inputted point is inside the inputted triangle.
     * @param {Vector2} point The coordinates of the point to test.
     * @param {Vector3} triangle A Vector3 value containing the indices of the triangle.
     */
    function isPointInsideTriangle(point, triangle) {
        /** The first vertex of the triangle. */
        const v1 = points[parseInt(triangle.x)];
        /** The second vertex of the triangle. */
        const v2 = points[parseInt(triangle.y)];
        /** The third vertex of the triangle. */
        const v3 = points[parseInt(triangle.z)];

        // Test for whether the point sees the points in the
        // proper order (either all clockwise or all counterclockwise)
        const cc1 = isCounterclockwise(point, v1, v2);
        const cc2 = isCounterclockwise(point, v2, v3);
        const cc3 = isCounterclockwise(point, v3, v1);
        const cond1 = (cc1 < 0) || (cc2 < 0) || (cc3 < 0);
        const cond2 = (cc1 > 0) || (cc2 > 0) || (cc3 > 0);

        return !(cond1 && cond2);
    }
    
    /**
     * Returns whether or not the inputted point is inside the inputted triangle's circumcircle.
     * @param {Vector2} point The coordinates of the point to test.
     * @param {Vector3} triangle A Vector3 value containing the indices of the triangle.
     */
    function isPointInTriangleCircumcircle(point, triangle) {
        /** @type {Vector2} The first vertex of the triangle. */
        const a = new Vector2(points[parseInt(triangle.x)].x, points[parseInt(triangle.x)].y);
        /** @type {Vector2} The second vertex of the triangle. */
        const b = new Vector2(points[parseInt(triangle.y)].x, points[parseInt(triangle.y)].y);
        /** @type {Vector2} The third vertex of the triangle. */
        const c = new Vector2(points[parseInt(triangle.z)].x, points[parseInt(triangle.z)].y);
        /** @type {Vector2} The point to test. */
        const d = point;

        /** The matrix used for evaluating whether point d is inside triangle abc. */
        const mat = new Matrix3D(
            new Vector3( a.x - d.x, a.y - d.y, (a.x - d.x) * (a.x - d.x) + (a.y - d.y) * (a.y - d.y) ),
            new Vector3( b.x - d.x, b.y - d.y, (b.x - d.x) * (b.x - d.x) + (b.y - d.y) * (b.y - d.y) ),
            new Vector3( c.x - d.x, c.y - d.y, (c.x - d.x) * (c.x - d.x) + (c.y - d.y) * (c.y - d.y) )
        );

        return mat.determinant() > 0;
    }

    /**
     * Reorders a triangle set of integers in counterclockwise order.
     * @param {Vector3} triangle The set of 3 points to rearrange.
     * @returns The reordered triplet of point indices.
     */
    function reorderCounterclockwise(triangle) {
        // Coordinates of the triangles. All are of type Vector2.
        var p1 = new Vector2(points[parseInt(triangle.x)].x, points[parseInt(triangle.x)].y);
        var p2 = new Vector2(points[parseInt(triangle.y)].x, points[parseInt(triangle.y)].y);
        var p3 = new Vector2(points[parseInt(triangle.z)].x, points[parseInt(triangle.z)].y);

        var inc = findTriangleIncenter(p1, p2, p3);

        if(isCounterclockwise(p2, p1, inc)) {
            if(isCounterclockwise(p3, p1, inc)) {
                if(isCounterclockwise(p3, p2, inc)) {
                    // 1 2 3
                    return new Vector3(triangle.x, triangle.y, triangle.z);
                } else {
                    // 1 3 2
                    return new Vector3(triangle.x, triangle.z, triangle.y);
                }
            } else {
                // 3 1 2
                return new Vector3(triangle.z, triangle.x, triangle.y);
            }
        } else if(isCounterclockwise(p3, p2, inc)) {
            if(isCounterclockwise(p3, p1, inc)) {
                // 2 1 3
                return new Vector3(triangle.y, triangle.x, triangle.z);
            } else {
                // 2 3 1
                return new Vector3(triangle.y, triangle.z, triangle.x);
            }
        } else {
            // 3 2 1
            return new Vector3(triangle.z, triangle.y, triangle.x);
        }
    }

});