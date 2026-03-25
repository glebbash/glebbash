const PITCH_I = 1100;
const PITCH_A = 660;
const PITCH_E = 500; // questionable
const PITCH_O = 220;
const PITCH_U = 110;

await main();

async function main() {
  const audioCtx = new AudioContext();

  const oscillator = audioCtx.createOscillator();
  oscillator.type = "sine";

  const pitches = await buildSong();
  let time = audioCtx.currentTime;
  for (const pitch of pitches) {
    oscillator.frequency.setValueAtTime(pitch, time);
    time += 0.1;
  }

  const gain = audioCtx.createGain();
  gain.gain.value = 0.2; // volume
  oscillator.connect(gain);
  gain.connect(audioCtx.destination);

  const letterDisplay = document.querySelector(".letter-display");
  document.addEventListener("click", () => {
    if (letterDisplay.innerHTML.length > 1) {
      oscillator.start();

      const draw = () => {
        window.requestAnimationFrame(draw);

        letterDisplay.innerHTML = pitchToLetter(oscillator.frequency.value);
      };
      window.requestAnimationFrame(draw);
    }
  });
}

async function buildSong() {
  const file = await fetch("./rapgod-lyrics.txt").then((r) => r.text());

  const pitches = [];
  for (const line of file.split("\n")) {
    // skip section names, example: [Chorus]
    if (line.trim().startsWith("[")) {
      continue;
    }

    if (line.trim().length === 0) {
      pitches.push(0, 0, 0);
    }

    for (const char of line.toLowerCase().split("")) {
      switch (char) {
        case " ":
          pitches.push(0);
          break;
        case "a":
          pitches.push(PITCH_A);
          break;
        case "e":
          pitches.push(PITCH_E);
          break;
        case "i":
          pitches.push(PITCH_I);
          break;
        case "o":
          pitches.push(PITCH_O);
          break;
        case "u":
          pitches.push(PITCH_U);
          break;
        case ",":
          pitches.push(0); // space always follows, so this is a double pause
          break;
      }
      if (char === " ") {
        pitches.push(0);
      }
    }

    pitches.push(0, 0);
  }

  return pitches;
}

function pitchToLetter(pitch) {
  switch (pitch) {
    case PITCH_I:
      return "I";
    case PITCH_A:
      return "A";
    case PITCH_E:
      return "E";
    case PITCH_O:
      return "O";
    case PITCH_U:
      return "U";
    case 0:
      return "_";
    default:
      return "?";
  }
}
