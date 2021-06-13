/**
 * Created by Nolan Bridges
 * GitHub: https://github.com/NMBridges
 * June 11, 2020
 */

/**
 * A webpage element that is used, in this case, to extract image pixel data.
 */
var canvas = document.createElement("canvas");
canvas.width = 0;
canvas.height = 0;

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
 * An object used to store color data about the user's inputted image.
 */
var img = new RawImage();

window.addEventListener('load', function() {
    /**
     * The webpage element that asks the user to upload an image.
     */
    const fileSelector = document.getElementById('fileSelector');

    /**
     * The webpage element that is added invisibly to the canvas. It contains
     * the source image uploaded by the user and is used by the canvas to extract
     * pixel data about said image.
     */
    const loadedImage = document.getElementById('loadedImage');
    loadedImage.hidden = true;

    /**
     * When a file is uploaded, it calls the 'readImage()' function to
     * appropriately analyze the new file.
     */
    fileSelector.addEventListener('change', (event) => {
        const fileList = event.target.files;
        readImage(fileList[0]);
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
                // Adds the new image to the canvas and resizes it accordingly.
                canvas.width = loadedImage.width;
                canvas.height = loadedImage.height;
                canvas.getContext('2d').drawImage(loadedImage, 0, 0, loadedImage.width, loadedImage.height);
                
                img = new RawImage(canvas.width, canvas.height);

                for(var y = 0; y < canvas.height; y++) {
                    for(var x = 0; x < canvas.width; x++) {
                        const pData = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
                        img.loadSinglePixel(y, x, new Color(pData[0], pData[1], pData[2], pData[3]));
                    }
                }

                console.log(img);
            }
        });
        reader.readAsDataURL(file);
    }
});