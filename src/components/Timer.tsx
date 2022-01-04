import style from './Timer.module.css';

export default function Timer({ active, toggleActive, timer, select, currentType, breakCount }) {
  return (
    <div className={style.timerContainer}>
      <ul>
        <li id="focus" className={currentType === 'focus' ? style.selected : null} onClick={(e) => select(e.target.id)}>Focus</li>
        <li id="shortBreak" className={currentType === 'shortBreak' ? style.selected : null} onClick={(e) => select(e.target.id)}>Short break</li>
        <li id="longBreak" className={currentType === 'longBreak' ? style.selected : null} onClick={(e) => select(e.target.id)}>Long break</li>
      </ul>
      <div>
        <div>{currentType === 'focus' ? `Round: ${breakCount + 1}` : <span>&nbsp;</span>}</div>
        <div className={style.timer}>
          {`${timer.minutes}:${timer.seconds}`}
        </div>
      </div>
      <button className={`btn ${active ? style.stop : style.start}`} onClick={toggleActive}>{active ? "Stop" : "Start"}</button>
    </div>
  )
}