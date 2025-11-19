// ======== Helper ========
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function copyFromElement(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const val = el.textContent.trim();
  if (!val || val === "—") return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(val).then(() => {
      el.style.borderColor = "#4ade80";
      setTimeout(() => (el.style.borderColor = "rgba(148,163,184,0.6)"), 600);
    });
  }
}

// ======== PESEL ========
function randomBirthDateForAgeRange(range) {
  const now = new Date();
  let min = 0, max = 90;

  if (range !== "any") {
    [min, max] = range.split("-").map(Number);
  }
  const age = randInt(min, max);
  const year = now.getFullYear() - age;
  const month = randInt(1, 12);

  const days = [31, (year % 4 === 0 ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const day = randInt(1, days[month - 1]);

  return { year, month, day };
}

function generatePesel() {
  const gender = document.getElementById("peselGender").value;
  const ageRange = document.getElementById("peselAge").value;

  const { year, month, day } = randomBirthDateForAgeRange(ageRange);

  let monthCode = month;
  if (year >= 2000) monthCode += 20;

  const yy = String(year).slice(-2);
  const mm = String(monthCode).padStart(2, "0");
  const dd = String(day).padStart(2, "0");

  const s1 = randInt(0, 9);
  const s2 = randInt(0, 9);
  const s3 = randInt(0, 9);

  let sexDigit;
  if (gender === "male") sexDigit = [1,3,5,7,9][randInt(0,4)];
  else if (gender === "female") sexDigit = [0,2,4,6,8][randInt(0,4)];
  else sexDigit = randInt(0, 9);

  const digits = (yy + mm + dd + s1 + s2 + s3 + sexDigit).split("").map(Number);
  const weights = [1,3,7,9,1,3,7,9,1,3];
  const sum = digits.reduce((a, d, i) => a + d * weights[i], 0);
  const control = (10 - (sum % 10)) % 10;

  return digits.join("") + control;
}

// ======== NIP =========
function generateNip() {
  const w = [6,5,7,2,3,4,5,6,7];

  while (true) {
    const digs = Array.from({ length: 9 }, () => randInt(0,9));
    const sum = digs.reduce((a, d, i) => a + d * w[i], 0);

    const c = sum % 11;
    if (c !== 10) return digs.join("") + c;
  }
}

// ======== REGON ========
function generateRegon9() {
  const weights = [8,9,2,3,4,5,6,7];
  const digits = Array.from({ length: 8 }, () => randInt(0,9));

  let sum = digits.reduce((a, d, i) => a + d * weights[i], 0);
  let c = sum % 11;
  if (c === 10) c = 0;
  return digits.join("") + c;
}

function generateRegon14() {
  const base = generateRegon9().split("").map(Number);
  const digits = [...base, randInt(0,9), randInt(0,9), randInt(0,9), randInt(0,9)];

  const w = [2,4,8,5,0,9,7,3,6,1,2,4,8];
  let sum = digits.reduce((a, d, i) => a + d * w[i], 0);
  let c = sum % 11;
  if (c === 10) c = 0;
  return digits.join("") + c;
}

// ======== VIN ========
function generateVin() {
  const chars = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789";
  return Array.from({ length: 17 }, () => chars[randInt(0, chars.length - 1)]).join("");
}

// ======== Dowód osobisty ========
function generatePolishIdNumber() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const l1 = letters[randInt(0,25)];
  const l2 = letters[randInt(0,25)];
  const l3 = letters[randInt(0,25)];

  const nums = Array.from({ length: 5 }, () => randInt(0,9));

  const val = c => c.charCodeAt(0) - 55;
  const w = [7,3,1,7,3,1,7,3,1];

  const digits = [
    val(l1), val(l2), val(l3),
    null,
    ...nums
  ];

  const sum = digits.reduce((a, d, i) => i === 3 ? a : a + d * w[i], 0);
  const control = sum % 10;

  return l1 + l2 + l3 + control + nums.join("");
}

// ======== IBAN (mock) ========
function generateIbanPlMock() {
  return "PL" +
    randInt(0,9) +
    randInt(0,9) +
    Array.from({ length: 24 }, () => randInt(0,9)).join("");
}

// ======== IBAN PL – pełny, prawidłowy algorytm Mod97 ========

function generateIbanPl() {

  // 1) wygeneruj losowe 26 cyfr NRB
  let nrb = "";
  for (let i = 0; i < 26; i++) {
    nrb += randInt(0, 9);
  }

  // 2) zamień PL + "00" na wartości liczbowe zgodnie z ISO:
  // P = 25, L = 21  → "2521"
  const country = "PL";
  const countryConverted = "2521"; // P=25, L=21

  // 3) utwórz ciąg do obliczenia
  const rearranged = nrb + countryConverted + "00";

  // 4) oblicz mod 97 (z dużymi liczbami – liczymy w kawałkach)
  function mod97(numberStr) {
    let remainder = 0;
    for (let i = 0; i < numberStr.length; i++) {
      remainder = (remainder * 10 + parseInt(numberStr[i], 10)) % 97;
    }
    return remainder;
  }

  const remainder = mod97(rearranged);

  // 5) suma kontrolna = 98 - remainder
  const checksum = String(98 - remainder).padStart(2, "0");

  // 6) gotowy IBAN
  return `PL${checksum}${nrb}`;
}


// ======== Wyniki ========
function setResult(id, value) {
  const el = document.getElementById(id);
  el.textContent = value;
  el.classList.toggle("empty", !value);
}

// ======== Eventy ========
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnPesel").onclick = () =>
    setResult("peselResult", generatePesel());

  document.getElementById("btnNip").onclick = () =>
    setResult("nipResult", generateNip());

  document.getElementById("btnRegon").onclick = () => {
    const len = document.getElementById("regonLength").value;
    setResult("regonResult", len === "14" ? generateRegon14() : generateRegon9());
  };

  document.getElementById("btnVin").onclick = () =>
    setResult("vinResult", generateVin());

  document.getElementById("btnId").onclick = () =>
    setResult("idResult", generatePolishIdNumber());

  document.getElementById("btnIban").onclick = () =>
    setResult("ibanResult", generateIbanPl());

  // wszystkie przyciski kopiowania
  document.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", () =>
      copyFromElement(btn.getAttribute("data-copy"))
    );
  });
});
