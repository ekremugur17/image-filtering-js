let cat, filtered;
let size = 500;
let filterSize = 3;
let filterMatrix = [
  [-1, 1, 0],
  [-1, 1.1, 0],
  [-1, 1, 0]
];

function preload() {
  cat = loadImage('cat.jpg')
}

function setup() {
  let canvas = createCanvas(size*2, size);
  canvas.parent('canvas-holder');
  background(255);
  noSmooth();
  image(cat, 0, 0, size, size);
  // regen();
}

function regen() {
  filtered = createImage(cat.width, cat.height);
  cat.loadPixels();
  filtered.loadPixels();
  for(let i = 1; i < cat.width - 1; i++) {
    for(let j = 1; j < cat.height - 1; j++) {
      let rgb = convolution(cat, i, j, filterMatrix)
      let pix = getIndex(i, j, cat);
      filtered.pixels[pix + 0] = rgb.r;
      filtered.pixels[pix + 1] = rgb.g;
      filtered.pixels[pix + 2] = rgb.b;
      filtered.pixels[pix + 3] = 255;
    }
  }
  filtered.updatePixels();
  image(filtered, size +20, -1, size+1, size+1);
}

function convolution(img, x, y, filter) {
  let sumR = 0, sumG = 0, sumB = 0  ;
  for(let i = -1 * (Math.floor(filterSize/2)); i <= Math.floor(filterSize/2); i++) {
    for(let j = -1 * (Math.floor(filterSize/2)); j <= Math.floor(filterSize/2); j++) {
      let pix = getIndex(x + i, y + j, img);
      sumR += img.pixels[pix + 0] * filter[j + 1][i + 1];
      sumG += img.pixels[pix + 1] * filter[j + 1][i + 1];
      sumB += img.pixels[pix + 2] * filter[j + 1][i + 1];
    }
  }
  return {r: sumR, g: sumG, b: sumB};
}

function getIndex(x, y, img) {
  return (x + y * img.width) * 4;
}

function clicked() {
  clear();
  filterMatrix[0][1] = 1.5;
  regen();
}

function applyClick() {
  var but = document.getElementById("applyButton");
  let spin = document.getElementById("spinner");
  but.style.display = 'none';
  spin.style.display = 'block';
  setTimeout(() => {
    let arr = document.forms.inputField;
    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < 3; j++) {
        if(!isNaN(arr[i * 3 + j].value)) {
          filterMatrix[i][j] = arr[i * 3 + j].value;
        }
      }
    }
    regen();
    spin.style.display = 'none';
    but.style.display = 'block';
  }, 100);

}