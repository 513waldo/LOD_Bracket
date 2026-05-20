function createPortalQrDataUrl(text, size = 360) {
  const safeSize = Math.max(256, Math.round(size));
  const matrix = createQrMatrix(String(text || ""));
  const quietZone = 4;
  const moduleCount = matrix.length + (quietZone * 2);
  const path = matrix.flatMap((row, y) => row
    .map((isDark, x) => (isDark ? `M${x + quietZone} ${y + quietZone}h1v1h-1z` : ""))
    .filter(Boolean)).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${safeSize}" height="${safeSize}" viewBox="0 0 ${moduleCount} ${moduleCount}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path fill="#000" d="${path}"/></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createQrMatrix(text) {
  const version = 5;
  const size = 17 + version * 4;
  const dataCodewords = 108;
  const eccCodewords = 26;
  const matrix = Array.from({ length: size }, () => Array(size).fill(null));
  const reserved = Array.from({ length: size }, () => Array(size).fill(false));
  const bytes = new TextEncoder().encode(text);

  if (bytes.length > dataCodewords) {
    return createFallbackMatrix(text);
  }

  const data = buildDataCodewords(bytes, dataCodewords);
  const ecc = reedSolomonRemainder(data, eccCodewords);
  const codewords = data.concat(ecc);

  drawFunctionPatterns(matrix, reserved, version);
  placeDataBits(matrix, reserved, codewords);

  const mask = chooseBestMask(matrix, reserved, codewords, version);
  applyMask(matrix, reserved, mask);
  placeFormatBits(matrix, reserved, mask);

  return matrix.map((row) => row.map((value) => Boolean(value)));
}

function createFallbackMatrix(text) {
  const size = 29;
  const matrix = Array.from({ length: size }, () => Array(size).fill(false));
  const hash = simpleHash(text);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if ((x < 7 && y < 7) || (x > size - 8 && y < 7) || (x < 7 && y > size - 8)) {
        matrix[y][x] = true;
      } else if (x === y || x + y === size - 1) {
        matrix[y][x] = (hash + x + y) % 3 === 0;
      } else if (((x * 17) + (y * 31) + hash) % 7 === 0) {
        matrix[y][x] = true;
      }
    }
  }

  return matrix;
}

function buildDataCodewords(bytes, capacity) {
  const bits = [];
  pushBits(bits, 0b0100, 4);
  pushBits(bits, bytes.length, 8);
  for (const byte of bytes) {
    pushBits(bits, byte, 8);
  }

  const remainingBits = capacity * 8 - bits.length;
  const terminator = Math.min(4, remainingBits);
  for (let index = 0; index < terminator; index += 1) {
    bits.push(0);
  }

  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  const codewords = [];
  for (let index = 0; index < bits.length; index += 8) {
    codewords.push(bitsToByte(bits.slice(index, index + 8)));
  }

  let pad = 0;
  while (codewords.length < capacity) {
    codewords.push(pad % 2 === 0 ? 0xEC : 0x11);
    pad += 1;
  }

  return codewords;
}

function pushBits(bits, value, length) {
  for (let index = length - 1; index >= 0; index -= 1) {
    bits.push((value >> index) & 1);
  }
}

function bitsToByte(bits) {
  return bits.reduce((value, bit) => (value << 1) | bit, 0);
}

function drawFunctionPatterns(matrix, reserved, version) {
  const size = matrix.length;

  drawFinder(matrix, reserved, 0, 0);
  drawFinder(matrix, reserved, size - 7, 0);
  drawFinder(matrix, reserved, 0, size - 7);

  drawSeparators(matrix, reserved, 0, 0);
  drawSeparators(matrix, reserved, size - 7, 0);
  drawSeparators(matrix, reserved, 0, size - 7);

  for (let index = 8; index < size - 8; index += 1) {
    const bit = index % 2 === 0;
    setModule(matrix, reserved, index, 6, bit, true);
    setModule(matrix, reserved, 6, index, bit, true);
  }

  const centers = [6, 30];
  for (const row of centers) {
    for (const col of centers) {
      if (!(row === 6 && col === 6)) {
        drawAlignment(matrix, reserved, row, col);
      }
    }
  }

  setModule(matrix, reserved, 8, size - 8, true, true);
}

function drawFinder(matrix, reserved, x, y) {
  for (let dy = -1; dy <= 7; dy += 1) {
    for (let dx = -1; dx <= 7; dx += 1) {
      const xx = x + dx;
      const yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= matrix.length || yy >= matrix.length) {
        continue;
      }
      const isBorder = dx === -1 || dx === 7 || dy === -1 || dy === 7;
      const isDark = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6 && (
        dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)
      );
      setModule(matrix, reserved, xx, yy, isDark && !isBorder, true);
      if (!isBorder) {
        reserved[yy][xx] = true;
      }
    }
  }
}

function drawSeparators(matrix, reserved, x, y) {
  for (let i = 0; i < 8; i += 1) {
    const coords = [
      [x + i, y - 1],
      [x - 1, y + i],
      [x + 7, y + i],
      [x + i, y + 7],
    ];

    for (const [xx, yy] of coords) {
      if (xx >= 0 && yy >= 0 && xx < matrix.length && yy < matrix.length) {
        setModule(matrix, reserved, xx, yy, false, true);
      }
    }
  }
}

function drawAlignment(matrix, reserved, cx, cy) {
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      const xx = cx + dx;
      const yy = cy + dy;
      if (xx < 0 || yy < 0 || xx >= matrix.length || yy >= matrix.length) {
        continue;
      }
      const distance = Math.max(Math.abs(dx), Math.abs(dy));
      const dark = distance === 2 || distance === 0;
      setModule(matrix, reserved, xx, yy, dark, true);
    }
  }
}

function placeDataBits(matrix, reserved, codewords) {
  const size = matrix.length;
  const bits = [];
  for (const codeword of codewords) {
    pushBits(bits, codeword, 8);
  }

  let bitIndex = 0;
  let upward = true;

  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) {
      col -= 1;
    }

    for (let rowOffset = 0; rowOffset < size; rowOffset += 1) {
      const row = upward ? size - 1 - rowOffset : rowOffset;
      for (let currentCol = col; currentCol >= col - 1; currentCol -= 1) {
        if (reserved[row][currentCol]) {
          continue;
        }
        const bit = bitIndex < bits.length ? bits[bitIndex] === 1 : false;
        matrix[row][currentCol] = bit;
        bitIndex += 1;
      }
    }

    upward = !upward;
  }
}

function applyMask(matrix, reserved, mask) {
  for (let row = 0; row < matrix.length; row += 1) {
    for (let col = 0; col < matrix.length; col += 1) {
      if (!reserved[row][col] && typeof matrix[row][col] === "boolean") {
        matrix[row][col] = matrix[row][col] ^ maskBit(mask, row, col);
      }
    }
  }
}

function chooseBestMask(baseMatrix, reserved, codewords, version) {
  let bestMask = 0;
  let bestPenalty = Infinity;

  for (let mask = 0; mask < 8; mask += 1) {
    const candidate = cloneMatrix(baseMatrix);
    const tempReserved = cloneMatrix(reserved);
    drawFunctionPatterns(candidate, tempReserved, version);
    placeDataBits(candidate, tempReserved, codewords);
    applyMask(candidate, tempReserved, mask);
    placeFormatBits(candidate, tempReserved, mask);
    const penalty = calculatePenalty(candidate);
    if (penalty < bestPenalty) {
      bestPenalty = penalty;
      bestMask = mask;
    }
  }

  return bestMask;
}

function cloneMatrix(matrix) {
  return matrix.map((row) => row.slice());
}

function maskBit(mask, row, col) {
  switch (mask) {
    case 0: return (row + col) % 2 === 0;
    case 1: return row % 2 === 0;
    case 2: return col % 3 === 0;
    case 3: return (row + col) % 3 === 0;
    case 4: return (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0;
    case 5: return ((row * col) % 2) + ((row * col) % 3) === 0;
    case 6: return (((row * col) % 2) + ((row * col) % 3)) % 2 === 0;
    case 7: return (((row + col) % 2) + ((row * col) % 3)) % 2 === 0;
    default: return false;
  }
}

function placeFormatBits(matrix, reserved, mask) {
  const formatBits = getFormatBits(mask);
  const size = matrix.length;
  const topLeft = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8], [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  ];
  const topRightBottomLeft = [
    [8, size - 1], [8, size - 2], [8, size - 3], [8, size - 4], [8, size - 5], [8, size - 6], [8, size - 7], [8, size - 8],
    [size - 7, 8], [size - 6, 8], [size - 5, 8], [size - 4, 8], [size - 3, 8], [size - 2, 8], [size - 1, 8],
  ];

  topLeft.forEach(([row, col], index) => {
    setModule(matrix, reserved, col, row, ((formatBits >> (14 - index)) & 1) === 1, true);
  });

  topRightBottomLeft.forEach(([row, col], index) => {
    setModule(matrix, reserved, col, row, ((formatBits >> (14 - index)) & 1) === 1, true);
  });
}

function getFormatBits(mask) {
  const ecBits = 0b01; // L
  const data = (ecBits << 3) | mask;
  let value = data << 10;
  const generator = 0b10100110111;

  while (bitLength(value) - bitLength(generator) >= 0) {
    value ^= generator << (bitLength(value) - bitLength(generator));
  }

  return ((data << 10) | value) ^ 0b101010000010010;
}

function bitLength(value) {
  let length = 0;
  while (value > 0) {
    value >>= 1;
    length += 1;
  }
  return length;
}

function calculatePenalty(matrix) {
  let penalty = 0;
  const size = matrix.length;

  for (let row = 0; row < size; row += 1) {
    penalty += penaltyLine(matrix[row]);
  }

  for (let col = 0; col < size; col += 1) {
    const column = [];
    for (let row = 0; row < size; row += 1) {
      column.push(matrix[row][col]);
    }
    penalty += penaltyLine(column);
  }

  for (let row = 0; row < size - 1; row += 1) {
    for (let col = 0; col < size - 1; col += 1) {
      const value = matrix[row][col];
      if (value === matrix[row][col + 1] && value === matrix[row + 1][col] && value === matrix[row + 1][col + 1]) {
        penalty += 3;
      }
    }
  }

  const darkCount = matrix.flat().filter(Boolean).length;
  const percent = (darkCount * 100) / (size * size);
  penalty += Math.floor(Math.abs(percent - 50) / 5) * 10;

  return penalty;
}

function penaltyLine(line) {
  let penalty = 0;
  let current = line[0];
  let run = 1;

  for (let index = 1; index < line.length; index += 1) {
    if (line[index] === current) {
      run += 1;
    } else {
      if (run >= 5) {
        penalty += 3 + (run - 5);
      }
      current = line[index];
      run = 1;
    }
  }

  if (run >= 5) {
    penalty += 3 + (run - 5);
  }

  return penalty;
}

function simpleHash(text) {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) - hash) + text.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function reedSolomonRemainder(data, eccLength) {
  const generator = rsGeneratorPolynomial(eccLength);
  const message = data.concat(Array(eccLength).fill(0));

  for (let index = 0; index < data.length; index += 1) {
    const factor = message[index];
    if (factor === 0) {
      continue;
    }
    for (let j = 0; j < generator.length; j += 1) {
      message[index + j] ^= gfMultiply(generator[j], factor);
    }
  }

  return message.slice(message.length - eccLength);
}

function rsGeneratorPolynomial(degree) {
  let poly = [1];
  for (let i = 0; i < degree; i += 1) {
    poly = polyMultiply(poly, [1, gfPow(2, i)]);
  }
  return poly;
}

function polyMultiply(a, b) {
  const result = Array(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i += 1) {
    for (let j = 0; j < b.length; j += 1) {
      result[i + j] ^= gfMultiply(a[i], b[j]);
    }
  }
  return result;
}

const GF_EXP = Array(512).fill(0);
const GF_LOG = Array(256).fill(0);
(function initGf() {
  let x = 1;
  for (let i = 0; i < 255; i += 1) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) {
      x ^= 0x11D;
    }
  }
  for (let i = 255; i < 512; i += 1) {
    GF_EXP[i] = GF_EXP[i - 255];
  }
}());

function gfMultiply(a, b) {
  if (a === 0 || b === 0) {
    return 0;
  }
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function gfPow(a, power) {
  if (power === 0) {
    return 1;
  }
  if (a === 0) {
    return 0;
  }
  return GF_EXP[(GF_LOG[a] * power) % 255];
}

function setModule(matrix, reserved, x, y, value, markReserved = false) {
  if (y < 0 || x < 0 || y >= matrix.length || x >= matrix.length) {
    return;
  }
  matrix[y][x] = Boolean(value);
  if (markReserved) {
    reserved[y][x] = true;
  }
}
