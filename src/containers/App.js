import { useState, useEffect } from 'react';
import Timer from '../components/Timer.tsx';
import tone from '../bell.wav';
import './App.css';

function App() {
  const [ active, setActive ] = useState(false);
  const [ timer, setTimer ] = useState({minutes: "", seconds: ""});
  const [ counter, setCounter ] = useState(0);
  const [ currentType, setCurrentType ] = useState('focus');
  const [ breakCounter, setBreakCounter ] = useState(0);
  const type = {focus: 25, shortBreak: 5, longBreak: 15};
  const rules = {shortBreaks: 3, longBreaks: 1};
  let audio = new Audio(tone);
  let interval = null;

  let toggleActive = () => setActive(active => !active);

  function selectTimer(selected) {
    stop();
    setCurrentType(selected);
    setTimer({
      ...timer,
      minutes: type[selected].toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      }),
      seconds: "00"
    });
    setCounter(type[selected] * 60);
  }

  useEffect(() => {
    selectTimer(currentType);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
    if(active) start();
    if(!active && counter !== 0) stop(); // Pause counter
    if (counter === -1 && active === true) {
      // Stop counter when 0 is reached
      reset();
      nextType();
    }
    return () => clearInterval(interval); // Cuando el componente se va a desmontar...
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, counter]);

  function start() {
    interval = setInterval(() => {
      const secondCounter = counter % 60;
      const minuteCounter = Math.floor(counter / 60);

      let computedSecond =
        String(secondCounter).length === 1
          ? `0${secondCounter}`
          : secondCounter;
      let computedMinute =
        String(minuteCounter).length === 1
          ? `0${minuteCounter}`
          : minuteCounter;

      setTimer({
        minutes: computedMinute,
        seconds: computedSecond,
      });
      setCounter(counter - 1);
    }, 1000);
  }

  function reset() {
    stop();
  }

  function stop() {
    clearInterval(interval);
    setActive(false);
  }

  function nextType() {  
    if(currentType === "focus" && breakCounter < rules.shortBreaks) {
      selectTimer('shortBreak');
      audio.play();
    }
    if(currentType === "shortBreak") {
      selectTimer('focus');
      audio.play();
      setBreakCounter(breakCounter => breakCounter + 1);
    }
    if(currentType === 'focus' && breakCounter === 3) {
      selectTimer('longBreak');
      audio.play();
      setBreakCounter(0);
    }
    if(currentType === 'longBreak') {
      selectTimer('focus');
      audio.play();
    }
  }

  return (
    <div className={`App ${currentType}`}>
      <Timer active={active} toggleActive={toggleActive} timer={timer} select={selectTimer} currentType={currentType} breakCount={breakCounter} />
    </div>
  );
}

export default App;