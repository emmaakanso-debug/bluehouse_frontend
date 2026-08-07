// Generate password based on user options
function generatePassword(length, upper, numbers, symbols) {
  let lowerCase = "abcdefghijklmnopqrstuvwxyz".split("");
  let upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  let numberChars = "0123456789".split("");
  let symbolChars = "!@#$%^&*()_+-=[]{}".split("");

  // Start with lowercase by default
  let characters = [...lowerCase];

  if (upper) characters = characters.concat(upperCase);
  if (numbers) characters = characters.concat(numberChars);
  if (symbols) characters = characters.concat(symbolChars);

  let password = "";
  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}

// Show generated password on screen
function showPassword() {
  let length = document.getElementById("length").value;
  let includeUpper = document.getElementById("includeUpper").checked;
  let includeNumbers = document.getElementById("includeNumbers").checked;
  let includeSymbols = document.getElementById("includeSymbols").checked;

  let password = generatePassword(length, includeUpper, includeNumbers, includeSymbols);
  document.getElementById("output").innerText = password;
}

// Copy password to clipboard
function copyPassword() {
  let password = document.getElementById("output").innerText;
  if (password === "") {
    alert("No password to copy!");
    return;
  }

  navigator.clipboard.writeText(password);
  alert("Password copied to clipboard!");
}

// Event listeners
document.getElementById("generateBtn").addEventListener("click", showPassword);
document.getElementById("copyBtn").addEventListener("click", copyPassword);
