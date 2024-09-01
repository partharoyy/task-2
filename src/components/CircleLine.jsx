import { useState, useEffect } from "react";

const CircleLine = () => {
  const [circle, setCircle] = useState({
    x: 300,
    y: 300,
    radius: 100,
  });

  const [handler, setHandler] = useState({
    x: 300,
    y: 300,
    isDragging: false,
  });

  const [line, setLine] = useState({
    x1: 100,
    y1: 200,
    x2: 400,
    y2: 100,
    isDraggingStart: false,
    isDraggingEnd: false,
    startAttached: false,
    endAttached: false,
  });

  const handleMouseDownHandler = () => {
    setHandler((prevHandler) => ({
      ...prevHandler,
      isDragging: true,
    }));
  };

  const handleMouseUpHandler = () => {
    setHandler((prevHandler) => ({
      ...prevHandler,
      isDragging: false,
      x: circle.x,
      y: circle.y,
    }));
  };

  const handleMouseMoveHandler = (e) => {
    if (handler.isDragging) {
      const { clientY } = e;
      const dy = circle.y - clientY;

      setCircle((prevCircle) => ({
        ...prevCircle,
        radius: Math.max(20, prevCircle.radius + dy / 10),
      }));

      setHandler((prevHandler) => ({
        ...prevHandler,
        y: clientY,
      }));
    }
  };

  const handleMouseDownLineStart = () => {
    setLine((prevLine) => ({
      ...prevLine,
      isDraggingStart: true,
    }));
  };

  const handleMouseDownLineEnd = () => {
    setLine((prevLine) => ({
      ...prevLine,
      isDraggingEnd: true,
    }));
  };

  const handleMouseUpLine = () => {
    setLine((prevLine) => ({
      ...prevLine,
      isDraggingStart: false,
      isDraggingEnd: false,
    }));
  };

  const attachToCircle = (x, y) => {
    const dx = x - circle.x;
    const dy = y - circle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circle.radius + 20) {
      const angle = Math.atan2(dy, dx);
      return {
        x: circle.x + circle.radius * Math.cos(angle),
        y: circle.y + circle.radius * Math.sin(angle),
      };
    }

    return { x, y };
  };

  const handleMouseMoveLine = (e) => {
    const { clientX, clientY } = e;
    if (line.isDraggingStart) {
      const newPoint = attachToCircle(clientX, clientY);
      setLine((prevLine) => ({
        ...prevLine,
        x1: newPoint.x,
        y1: newPoint.y,
        startAttached: newPoint.x !== clientX || newPoint.y !== clientY,
      }));
    }
    if (line.isDraggingEnd) {
      const newPoint = attachToCircle(clientX, clientY);
      setLine((prevLine) => ({
        ...prevLine,
        x2: newPoint.x,
        y2: newPoint.y,
        endAttached: newPoint.x !== clientX || newPoint.y !== clientY,
      }));
    }
  };

  const handleMouseMove = (e) => {
    handleMouseMoveHandler(e);
    handleMouseMoveLine(e);
  };

  useEffect(() => {
    if (line.startAttached) {
      const newPoint = attachToCircle(line.x1, line.y1);
      setLine((prevLine) => ({
        ...prevLine,
        x1: newPoint.x,
        y1: newPoint.y,
      }));
    }

    if (line.endAttached) {
      const newPoint = attachToCircle(line.x2, line.y2);
      setLine((prevLine) => ({
        ...prevLine,
        x2: newPoint.x,
        y2: newPoint.y,
      }));
    }
  }, [circle.radius]);

  return (
    <svg
      width='100vw'
      height='100vh'
      className='border-[1px] border-[black]'
      onMouseMove={handleMouseMove}
      onMouseUp={() => {
        handleMouseUpHandler();
        handleMouseUpLine();
      }}
      onMouseLeave={() => {
        handleMouseUpHandler();
        handleMouseUpLine();
      }}
      role='img'
      aria-labelledby='circle-line-title circle-line-desc'
    >
      <title id='circle-line-title'>Interactive Circle and Line</title>
      <desc id='circle-line-desc'>
        A circle with adjustable radius and a draggable line with start and end points. You can interact with the
        handlers to change the circle's size and the line's position.
      </desc>

      {/* Draw Circle */}
      <circle
        cx={circle.x}
        cy={circle.y}
        r={circle.radius}
        fill='none'
        stroke='#2c7d23'
        strokeWidth='3'
        aria-label='Circle'
      />

      {/* Circle Handler */}
      <circle
        cx={handler.x}
        cy={handler.y}
        r='4'
        fill='#8568ac'
        stroke='rgba(133, 104, 172, 0.5)'
        strokeWidth='18'
        onMouseDown={handleMouseDownHandler}
        tabIndex='0'
        aria-label='Circle radius handler'
        role='slider'
        aria-valuemin='20'
        aria-valuemax='500'
        aria-valuenow={circle.radius}
        className='focus:outline-none'
      />

      {/* Draw Line */}
      <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke='#2c69d4' strokeWidth='3' aria-label='Line' />

      {/* Line Start Handler */}
      <circle
        cx={line.x1}
        cy={line.y1}
        r='4'
        fill='#8568ac'
        stroke='rgba(133, 104, 172, 0.5)'
        strokeWidth='18'
        onMouseDown={handleMouseDownLineStart}
        tabIndex='0'
        aria-label='Line start handler'
        role='slider'
        aria-valuemin='0'
        aria-valuemax='100vw'
        aria-valuenow={line.x1}
        className='focus:outline-none'
      />

      {/* Line End Handler */}
      <circle
        cx={line.x2}
        cy={line.y2}
        r='4'
        fill='#8568ac'
        stroke='rgba(133, 104, 172, 0.5)'
        strokeWidth='18'
        onMouseDown={handleMouseDownLineEnd}
        tabIndex='0'
        aria-label='Line end handler'
        role='slider'
        aria-valuemin='0'
        aria-valuemax='100vw'
        aria-valuenow={line.x2}
        className='focus:outline-none'
      />
    </svg>
  );
};

export default CircleLine;
