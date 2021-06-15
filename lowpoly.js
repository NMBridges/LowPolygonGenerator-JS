/**
 * Created by Nolan Bridges
 * GitHub: https://github.com/NMBridges
 * June 11, 2020
 */

/**
 * A webpage element that is used, in this case, to render, read, and save new images.
 */
 var mainCanvas = document.getElementById("mainCanvas");
 mainCanvas.width = window.innerWidth / 2;
 mainCanvas.height = window.innerHeight / 2;
 mainCanvas.hidden = true;

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
        /** @type {Color[][]} The colors of all the pixels in the image. */
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

    /**
     * Compares the Vector2 values to see if they are equal.
     * @param {Vector2} otherVector 
     * @returns Whether or not the values are equal.
     */
    equals(otherVector) {
        return (Math.abs(this.x - otherVector.x) < 0.0001 && Math.abs(this.y - otherVector.y) < 0.0001);
    }

    toString() {
        return "(" + this.x + ", " + this.y + ")";
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
  * @type {Color[]} An array that stores the colors of the triangles.
  */
 var triColors = [];

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
     * Button used to click to upload an image.
     */
    const fileButton = document.getElementById('fileButton');
    fileButton.addEventListener('click', function() {
        fileSelector.click();
    });

    /**
     * The webpage element that is added invisibly to the mainCanvas. It contains
     * the source image uploaded by the user and is used by the mainCanvas to extract
     * pixel data about said image.
     */
    const loadedImage = document.getElementById('loadedImage');
    loadedImage.hidden = true;

    /**
     * The webpage element that is added visibly to show the triangulated image.
     */
    const triangleImage = document.getElementById('triangleImage');
    triangleImage.hidden = true;
    
    /**
     * Webpage elements that are labels.
     */
    const xDetailLabel = document.getElementById('xDetailLabel');
    const yDetailLabel = document.getElementById('yDetailLabel');
    const randomnessLabel = document.getElementById('randomnessLabel');


    /**
     * The webpage element that is used by the user to control image generation.
     */
    const xPointSlider = document.getElementById('xPointSlider');
    xPointSlider.addEventListener('change', function(event) {
        xDetailLabel.textContent = "X-Detail: " + xPointSlider.value;
    });
     
    /**
     * The webpage element that is used by the user to control image generation.
     */
    const yPointSlider = document.getElementById('yPointSlider');
    yPointSlider.addEventListener('change', function(event) {
        yDetailLabel.textContent = "Y-Detail: " +  yPointSlider.value;
    });
    
    /**
     * The webpage element that is used by the user to control image generation.
     */
    const randomnessSlider = document.getElementById('randomnessSlider');
    randomnessSlider.addEventListener('change', function(event) {
        randomnessLabel.textContent = "Randomness: " +  randomnessSlider.value;
    });
    
    /**
     * The webpage element that overlays content when it should not be accessed.
     */
    const overlay = document.getElementById('overlay');

    /**
     * Toggles on the overlay.
     */
     function overlayOn() {
        overlay.style.display = "block";
        const contenta = overlay.innerHTML;
        overlay.innerHTML = contenta;
        overlay.focus();
    }
    
    /**
     * Toggles off the overlay.
     */
    function overlayOff() {
        overlay.style.display = "none";
        const contenta = overlay.innerHTML;
        overlay.innerHTML = contenta;
        overlay.focus();
    }

    /**
     * The button that is pressed to generate the low-poly image.
     */
    const regenerateButton = this.document.getElementById("regenerateButton");
    regenerateButton.addEventListener('click', function() {
        overlayOn();
        setTimeout(generateNewImage, 500);
    });

    function generateNewImage() {
        if(img != null) {
            if(img.pixels.length > 3) {
                generatePoints(xPointSlider.value, yPointSlider.value, randomnessSlider.value / 100);
                createTriangles();
                drawTriangles();

                triangleImage.src = mainCanvas.toDataURL();
                triangleImage.hidden = false;

                //mainCanvas.hidden = false;

                mainCanvas.getContext('2d').clearRect(0, 0, mainCanvas.width, mainCanvas.height);
            }
        }
        overlayOff();
    }

    /**
     * When a file is uploaded, it calls the 'readImage()' function to
     * appropriately analyze the new file. This is the 'main' of the
     * triangle calculation.
     */
    fileSelector.addEventListener('change', (event) => {
        overlayOn();
        const fileList = event.target.files;
        this.setTimeout(readNewImage(fileList), 500);
    });

    /**
     * Reads the new image asynchronously.
     * @param {File[]} fileList
     */
    function readNewImage(fileList) {
        readImage(fileList[0]);
    }

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
                // Adds the new image to the mainCanvas and resizes it accordingly.
                mainCanvas.width = loadedImage.width;
                mainCanvas.height = loadedImage.height;
                mainCanvas.getContext('2d').drawImage(loadedImage, 0, 0, loadedImage.width, loadedImage.height);
                
                const imgHoverWratio = loadedImage.height / loadedImage.width;
                //mainCanvas.width = window.innerWidth / 2;
                //mainCanvas.height = window.innerWidth / 2 * imgHoverWratio;

                img = new RawImage(mainCanvas.width, mainCanvas.height);

                for(var y = 0; y < mainCanvas.height; y++) {
                    for(var x = 0; x < mainCanvas.width; x++) {
                        const pData = mainCanvas.getContext('2d').getImageData(x, y, 1, 1).data;
                        img.loadSinglePixel(y, x, new Color(pData[0], pData[1], pData[2], pData[3]));
                    }
                }
                triangleImage.src = event.target.result;
                overlayOff();
            }
        });
        reader.readAsDataURL(file);
    }

    /**
     * 
     * @param {number} x The number of points in each row horizontally. Must be an integer and >= 2.
     * @param {number} y The number of points in each column vertically. Must be an integer and >= 2.
     * @param {number} randomFactor The amplitude of randomness used to jitter the points. Between 0.0 and 1.0.
     */
    function generatePoints(x, y, randomFactor) {
        if(x < 2 || y < 2) {
            return;
        }

        xPoints = x;
        yPoints = y;
        points = [];
        // Generates a grid of randomly generated points
        for(var yCount = 0; yCount < y; yCount++) {
            for(var xCount = 0; xCount < x; xCount++) {
                var newXValue = (xCount + (Math.random() - 0.5) * randomFactor ) / (x - 1);
                var newYValue = (yCount + (Math.random() - 0.5) * randomFactor ) / (y - 1);

                if(newXValue < 0.0 || xCount == 0) {
                    newXValue = 0.0 + ((yCount != 0 && yCount !=  y - 1) ? 0.001 : 0.0);
                }
                if(newXValue > 1.0 || xCount == x - 1) {
                    newXValue = 1.0 - ((yCount != 0 && yCount !=  y - 1) ? 0.001 : 0.0);
                }

                if(newYValue < 0.0 || yCount == 0) {
                    newYValue = 0.0 + ((xCount != 0 && xCount !=  x - 1) ? 0.001 : 0.0);
                }
                if(newYValue > 1.0 || yCount == y - 1) {
                    newYValue = 1.0 - ((xCount != 0 && xCount !=  x - 1) ? 0.001 : 0.0);
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
        mainCanvas.getContext('2d').clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        for(var pointIndex = 0; pointIndex < points.length; pointIndex++) {
            mainCanvas.getContext('2d').fillRect(points[pointIndex].x * (mainCanvas.width - 1), points[pointIndex].y * (mainCanvas.height - 1), 1, 1);
        }
    }

    /**
     * Fills the triColors list with the appropriate color for each triangle.
     * The appropriate color for each triangle is the average color of all 
     * the pixels of the image within that triangle.
     */
    function getTriangleColors() {
        triColors = [];
        
        /** @type {number} The number of pixels in each triangle used to find the average color. */
        var triColorsCount = [];
        
        for(var index = 0; index < triangles.length; index++) {
            triColors.push(new Color(0,0,0,0));
            triColorsCount.push(0);
        }
        for(var x = 0; x < img.width; x++) {
            for(var y = 0; y < img.height; y++) {
                const posX = x / img.width;
                const posY = y / img.height;
                const indx = findIndexOfSurroundingTriangle(new Vector2(posX, posY));
                if(indx != -1) {
                    const pixelColor = img.pixels[y][x];
                    const avgColor = triColors[indx];
                    const colorCount = triColorsCount[indx];
                    const totalR = avgColor.r * colorCount;
                    const totalG = avgColor.g * colorCount;
                    const totalB = avgColor.b * colorCount;
                    const totalA = avgColor.a * colorCount;
                    triColorsCount[indx] = colorCount + 1;
                    triColors[indx] = new Color((totalR + pixelColor.r) / (colorCount + 1), (totalG + pixelColor.g) / (colorCount + 1), (totalB + pixelColor.b) / (colorCount + 1), (totalA + pixelColor.a) / (colorCount + 1));
                }
            }
        }
    }

    /**
     * Returns index of the triangle the inputted point is in.
     * @param {Vector2} pt The inputted point.
     * @returns The index of the triangle the inputted point is in.
     */
    function findIndexOfSurroundingTriangle(pt) {
        for(var index = 0; index < triangles.length; index++) {
            if(isPointInsideTriangle(pt, triangles[index])) {
                return index;
            }
        }
        return -1;
    }
    
    /**
     * Draws the triangles within the 'triangles' array.
     */
    function drawTriangles(fill = true) {
        mainCanvas.getContext('2d').clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        if(fill) {
            getTriangleColors();
        }
        for(var triIndex = 0; triIndex < triangles.length; triIndex++) {
            mainCanvas.getContext('2d').beginPath();
            mainCanvas.getContext('2d').moveTo(points[triangles[triIndex].x].x * (mainCanvas.width - 1), points[triangles[triIndex].x].y * (mainCanvas.height - 1));
            mainCanvas.getContext('2d').lineTo(points[triangles[triIndex].y].x * (mainCanvas.width - 1), points[triangles[triIndex].y].y * (mainCanvas.height - 1));
            mainCanvas.getContext('2d').lineTo(points[triangles[triIndex].z].x * (mainCanvas.width - 1), points[triangles[triIndex].z].y * (mainCanvas.height - 1));
            mainCanvas.getContext('2d').lineTo(points[triangles[triIndex].x].x * (mainCanvas.width - 1), points[triangles[triIndex].x].y * (mainCanvas.height - 1));
            if(fill) {
                mainCanvas.getContext('2d').fillStyle = "rgba(" + triColors[triIndex].r + ", " + triColors[triIndex].g + ", " + triColors[triIndex].b + ", " + triColors[triIndex].a / 255 + ")";
                mainCanvas.getContext('2d').fill();
                mainCanvas.getContext('2d').strokeStyle = "rgba(" + triColors[triIndex].r + ", " + triColors[triIndex].g + ", " + triColors[triIndex].b + ", " + triColors[triIndex].a / 255 + ")";
            }
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
     * Returns whether the three points are counterclockwise or not.
     *      True = counterclockwise.
     *      False = clockwise.
     * @param {Vector2} p1 The first point.
     * @param {Vector2} p2 The second point.
     * @param {Vector2} p3 The third point.
     */
    function isCounterclockwise(p1, p2, p3) {
        var mat = new Matrix3D(
            new Vector3(p1.x, p1.y, 1),
            new Vector3(p2.x, p2.y, 1),
            new Vector3(p3.x, p3.y, 1)
        );

        return mat.determinant() > 0;
    }

    /**
     * Returns the first position's angle relative to the center point and the second point.
     * @param {Vector2} p1 The first point.
     * @param {Vector2} p2 The second point.
     * @param {Vector2} center The central point (incenter) from which the points are compared.
     */
    function relativeSign(p1, p2, center) {
        return (p1.x - center.x) * (p2.y - center.y) - (p2.x - center.x) * (p1.y - center.y);
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
        points[(xPoints) * (yPoints - 1)].used = true;
        triangles.push(new Vector3(xPoints - 1, 0, points.length - 1));
        triangles.push(new Vector3(points.length - 1, 0, (xPoints) * (yPoints - 1)));

        // Loops through list of all points, adds them, and flips triangles appropriately.
        for(var newPointIndex = 0; newPointIndex < points.length; newPointIndex++) {
            if(!points[newPointIndex].used) {
                const pt = new Vector2(points[newPointIndex].x, points[newPointIndex].y);
                for(var triIndex = 0; triIndex < triangles.length; triIndex++) {
                    if(isPointInsideTriangle(pt, triangles[triIndex])) {
                        const outTri = triangles[triIndex];
                        if(newPointIndex != outTri.x && newPointIndex != outTri.y && newPointIndex != outTri.z) {
                            // Subdivides triangle into three new triangles
                            const v1 = outTri.x;
                            const v2 = outTri.y;
                            const v3 = outTri.z;
                            
                            triangles.splice(triIndex, 1);

                            var countToFlipCheck = 0;

                            var newTri = new Vector3(v1, v2, newPointIndex);
                            if(!hasZeroArea(newTri)) {
                                triangles.push(reorderCounterclockwise(newTri));
                                countToFlipCheck++;
                            }
                            newTri = new Vector3(v1, v3, newPointIndex);
                            if(!hasZeroArea(newTri)) {
                                triangles.push(reorderCounterclockwise(newTri));
                                countToFlipCheck++;
                            }
                            newTri = new Vector3(v2, v3, newPointIndex);
                            if(!hasZeroArea(newTri)) {
                                triangles.push(reorderCounterclockwise(newTri));
                                countToFlipCheck++;
                            }
                            
                            for(var checker = 0; checker < countToFlipCheck; checker++) {
                                recursiveFlip(triangles.length - checker - 1, 0);
                            }

                            break;
                        }
                    }
                }
                points[newPointIndex].used = true;
            }
        }

        for(var triIndx = 0; triIndx < triangles.length; triIndx++) {
            recursiveFlip(triIndx, 0);
        }

    }

    /**
     * Flips triangles until they should not be flipped anymore.
     * Triangles should be flipped when another point is within
     * their circumcircle.
     * @param {number} a Integer value representing the index of the
     * triangle to check for flips.
     * @param {number} flipCount The max number of recursions this function should be called.
     */
    function recursiveFlip(a, flipCount) {
        const tri = triangles[a];
        for(var index = 0; index < points.length; index++) {
            if(index != tri.x && index != tri.y && index != tri.z && points[index].used) {
                if(isPointInTriangleCircumcircle(new Vector2(points[index].x, points[index].y), tri)) {
                    // Check if there are any triangles with vertices of that point + two values of
                    // the original triangle (aka they share a side)
                    const firstTest = indexOfTriWithPointVertices(new Vector3(index, tri.x, tri.y));
                    const secondTest = indexOfTriWithPointVertices(new Vector3(index, tri.x, tri.z));
                    const thirdTest = indexOfTriWithPointVertices(new Vector3(index, tri.y, tri.y));
                    
                    var indexToUse = -1;
                    if(firstTest != -1) {
                        indexToUse = firstTest;
                    } else if(secondTest != -1) {
                        indexToUse = secondTest;
                    } else if(thirdTest != -1) {
                        indexToUse = thirdTest;
                    }
                    
                    if(indexToUse != -1) {
                        flipTriangles(a, indexToUse);
                        // The max number of recursions per initial call.
                        if(flipCount + 1 < 1500) {
                            recursiveFlip(indexToUse, flipCount + 1);
                            recursiveFlip(a, flipCount + 1);
                        }
                        return;
                    }
                }
            }
        }
    }

    /**
     * 
     * @param {Vector3} triangle The indices of the triangle points
     */
    function indexOfTriWithPointVertices(triangle) {
        const indices1 = [triangle.x, triangle.y, triangle.z];
        const indcSorted = indices1.sort().join(':');
        for(var index = 0; index < triangles.length; index++) {
            const indices2 = [triangles[index].x, triangles[index].y, triangles[index].z];
            if (indcSorted == indices2.sort().join(':')) {
                return index;
            }
        } 
        return -1;
    }

    /**
     * Returns whether or not the inputted point is inside the inputted triangle.
     * @param {Vector2} point The coordinates of the point to test.
     * @param {Vector3} triangle A Vector3 value containing the indices of the triangle.
     */
    function isPointInsideTriangle(point, triangle) {
        /** The first vertex of the triangle. */
        const v1 = new Vector2(points[triangle.x].x, points[triangle.x].y);
        /** The second vertex of the triangle. */
        const v2 = new Vector2(points[triangle.y].x, points[triangle.y].y);
        /** The third vertex of the triangle. */
        const v3 = new Vector2(points[triangle.z].x, points[triangle.z].y);

        // Test for whether the point sees the points in the
        // proper order (either all clockwise or all counterclockwise)
        const cc1 = relativeSign(point, v1, v2);
        const cc2 = relativeSign(point, v2, v3);
        const cc3 = relativeSign(point, v3, v1);
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
        const a = new Vector2(points[triangle.x].x, points[triangle.x].y);
        /** @type {Vector2} The second vertex of the triangle. */
        const b = new Vector2(points[triangle.y].x, points[triangle.y].y);
        /** @type {Vector2} The third vertex of the triangle. */
        const c = new Vector2(points[triangle.z].x, points[triangle.z].y);
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
        const p1 = new Vector2(points[triangle.x].x, points[triangle.x].y);
        const p2 = new Vector2(points[triangle.y].x, points[triangle.y].y);
        const p3 = new Vector2(points[triangle.z].x, points[triangle.z].y);

        if(isCounterclockwise(p1, p2, p3)) {
            const oldX = triangle.x + 0;
            const oldY = triangle.y + 0;
            const oldZ = triangle.z + 0;
            return new Vector3(oldX, oldY, oldZ);
        } else {
            const oldX = triangle.x + 0;
            const oldY = triangle.y + 0;
            const oldZ = triangle.z + 0;
            return new Vector3(oldX, oldZ, oldY);
        }
    }

    /**
     * Finds whether the triangle has an area of zero.
     * @param {Vector3} a The triangle to find the area of.
     * @returns A boolean of whether the triangle has an area of zero.
     */
    function hasZeroArea(a) {
        const p1 = points[a.x];
        const p2 = points[a.y];
        const p3 = points[a.z];

        const s1 = Math.sqrt((p2.x - p3.x) * (p2.x - p3.x) + (p2.y - p3.y) * (p2.y - p3.y));
        const s2 = Math.sqrt((p1.x - p3.x) * (p1.x - p3.x) + (p1.y - p3.y) * (p1.y - p3.y));
        const s3 = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));

        return (s1 == s2 + s3 || s2 == s1 + s3 || s3 == s1 + s2);
    }

    /**
     * Flips the bordering triangles, replacing the triangles at the given
     * indices with these flipped ones.
     * e.g. <|>   turns into   <->
     * @param {number} a The integer value representing the index of the first triangle.
     * @param {number} b The integer value representing the index of the second triangle.
     */
    function flipTriangles(a, b) {
        // The vertices of the triangles.
        const t1v1 = new Vector2(points[triangles[a].x].x, points[triangles[a].x].y);
        const t1v2 = new Vector2(points[triangles[a].y].x, points[triangles[a].y].y);
        const t1v3 = new Vector2(points[triangles[a].z].x, points[triangles[a].z].y);
        const t2v1 = new Vector2(points[triangles[b].x].x, points[triangles[b].x].y);
        const t2v2 = new Vector2(points[triangles[b].y].x, points[triangles[b].y].y);
        const t2v3 = new Vector2(points[triangles[b].z].x, points[triangles[b].z].y);
        /** @type {Vector2} */
        const verts = [t1v1, t1v2, t1v3, t2v1, t2v2, t2v3];

        /**
         * @type {Vector2[]} The unique vertices.
         */
        var uniques = [];
        /**
         * @type {Vector2[]} The duplicate vertices.
         */
        var duplicates = [];

        // Find which vertices are similar and dissimilar.
        for(var index1 = 0; index1 < verts.length; index1++) {
            for(var index2 = 0; index2 < verts.length; index2++) {
                if(verts[index1].equals(verts[index2]) && index1 != index2) {
                    if(index1 < index2) {
                        duplicates.push(index1);
                    }
                    break;
                } else if(index2 == verts.length - 1) {
                    uniques.push(index1);
                }
            }
        }

        // Converts indices back relative to 'triangles.'
        for(var index = 0; index < 2; index++) {
            
            if(uniques[index] == 0) {
                uniques[index] = triangles[a].x;
            } else if(uniques[index] == 1) {
                uniques[index] = triangles[a].y;
            } else if(uniques[index] == 2) {
                uniques[index] = triangles[a].z;
            } else if(uniques[index] == 3) {
                uniques[index] = triangles[b].x;
            } else if(uniques[index] == 4) {
                uniques[index] = triangles[b].y;
            } else if(uniques[index] == 5) {
                uniques[index] = triangles[b].z;
            }

            if(duplicates[index] == 0) {
                duplicates[index] = triangles[a].x;
            } else if(duplicates[index] == 1) {
                duplicates[index] = triangles[a].y;
            } else if(duplicates[index] == 2) {
                duplicates[index] = triangles[a].z;
            } else if(duplicates[index] == 3) {
                duplicates[index] = triangles[b].x;
            } else if(duplicates[index] == 4) {
                duplicates[index] = triangles[b].y;
            } else if(duplicates[index] == 5) {
                duplicates[index] = triangles[b].z;
            }
        }

        // Reorders triangles.
        const newTri1 = reorderCounterclockwise(new Vector3(uniques[0], uniques[1], duplicates[0]));
        const newTri2 = reorderCounterclockwise(new Vector3(uniques[0], uniques[1], duplicates[1]));

        // Updates 'triangles.'
        triangles[a] = newTri1;
        triangles[b] = newTri2;
    }

});