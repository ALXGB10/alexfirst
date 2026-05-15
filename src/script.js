const launch = document.getElementById('launch');

setTimeout(() => launch.classList.add('is-loaded'), 120);

launch.addEventListener('pointermove', (event) => {
  const rect = launch.getBoundingClientRect();
  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height / 2;

  launch.style.setProperty('--rx', `${y * -0.035}deg`);
  launch.style.setProperty('--ry', `${x * 0.045}deg`);
  launch.style.setProperty('--mx', `${50 + x * 0.045}%`);
  launch.style.setProperty('--my', `${50 + y * 0.045}%`);
});

launch.addEventListener('pointerleave', () => {
  launch.style.setProperty('--rx', '0deg');
  launch.style.setProperty('--ry', '0deg');
  launch.style.setProperty('--mx', '50%');
  launch.style.setProperty('--my', '50%');
});
