const AudioContextClass =
  window.AudioContext ??
  (window as unknown as { webkitAudioContext: typeof AudioContext })
    .webkitAudioContext;

const ctx = (): AudioContext => new AudioContextClass();

const ramp = (
  param: AudioParam,
  from: number,
  to: number,
  start: number,
  end: number,
) => {
  param.setValueAtTime(from, start);
  param.linearRampToValueAtTime(to, end);
};

const playHorns = (ac: AudioContext) => {
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  const times = [0, 0.18, 0.36, 0.54];

  notes.forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const filter = ac.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.value = freq;

    filter.type = "bandpass";
    filter.frequency.value = freq * 1.5;
    filter.Q.value = 2;

    const t = ac.currentTime + times[i];
    const duration = i === notes.length - 1 ? 1.2 : 0.28;

    ramp(gain.gain, 0, 0.22, t, t + 0.02);
    ramp(gain.gain, 0.22, 0.18, t + 0.02, t + duration - 0.05);
    ramp(gain.gain, 0.18, 0, t + duration - 0.05, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);

    osc.start(t);
    osc.stop(t + duration);
  });
};

const playCheers = (ac: AudioContext) => {
  const bufferSize = ac.sampleRate * 2.5;
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.4;
  }

  const source = ac.createBufferSource();
  source.buffer = buffer;

  const lowpass = ac.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 1800;
  lowpass.Q.value = 0.8;

  const highpass = ac.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 300;

  const gain = ac.createGain();
  const t = ac.currentTime + 0.3;

  ramp(gain.gain, 0, 0.35, t, t + 0.4);
  ramp(gain.gain, 0.35, 0.28, t + 0.4, t + 1.5);
  ramp(gain.gain, 0.28, 0, t + 1.5, t + 2.5);

  source.connect(lowpass);
  lowpass.connect(highpass);
  highpass.connect(gain);
  gain.connect(ac.destination);

  source.start(t);
  source.stop(t + 2.5);
};

const playClaps = (ac: AudioContext) => {
  const clapPattern = [
    0.05, 0.18, 0.31, 0.44, 0.57, 0.7, 0.83, 0.96, 1.1, 1.25,
  ];

  clapPattern.forEach((offset) => {
    const bufferSize = Math.floor(ac.sampleRate * 0.12);
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const env = Math.exp(-i / (ac.sampleRate * 0.025));
      data[i] = (Math.random() * 2 - 1) * env;
    }

    const source = ac.createBufferSource();
    source.buffer = buffer;

    const filter = ac.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1200;
    filter.Q.value = 0.5;

    const gain = ac.createGain();
    gain.gain.value = 0.55;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);

    const t = ac.currentTime + offset;
    source.start(t);
    source.stop(t + 0.12);
  });
};

const playFanfare = (): void => {
  const ac = ctx();

  if (ac.state === "suspended") {
    ac.resume();
  }

  playHorns(ac);
  playCheers(ac);
  playClaps(ac);
};

export default playFanfare;
