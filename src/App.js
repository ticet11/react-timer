import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import moment from "moment";
import { Howl } from "howler";

import chiptune from "./assets/sounds/chiptune-loop.wav";

const Timer = () => {
    const alarm = new Howl({
        src: [chiptune],
    });

    const [isStarted, setIsStarted] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [error, setError] = useState(false);

    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        const timeInSec =
            parseInt(data.hours) * 3600 +
            parseInt(data.minutes) * 60 +
            parseInt(data.seconds);
        if (timeInSec === 0) {
            setError(true);
        } else {
            setError(false);
            setTimeLeft(timeInSec);
            setIsStarted(!isStarted);
            setIsRunning(true);
        }
    };

    const errorMessage = () => {
        if (error) {
            return (
                <p className="timer-error-message">
                    Please enter a time
                </p>
            );
        }
    };

    const handleClick = () => {
        if (timeLeft === 0) {
            setIsStarted(!isStarted);
            alarm.stop();
        }
        setIsRunning(!isRunning);
    };

    const handleCancelClick = () => {
        setIsStarted(!isStarted);
        setIsRunning(!isRunning);
    };

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            const interval = setInterval(
                () => setTimeLeft(timeLeft - 1),
                1000
            );
            return () => clearInterval(interval);
        }
        if (timeLeft === 0 && isStarted) {
            alarm.play();
        }
    });

    const timer = moment.duration(timeLeft, "seconds")._data;

    return (
        <div className="timer-wrapper">
            <h1>Very Cool Timer</h1>
            {!isStarted ? (
                <div className="form-wrapper">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            name="hours"
                            defaultValue="00"
                            ref={register}
                        />
                        <input
                            name="minutes"
                            defaultValue="00"
                            ref={register}
                        />
                        <input
                            name="seconds"
                            defaultValue="00"
                            ref={register}
                        />
                        <button type="submit">Start</button>
                    </form>
                    {errorMessage()}
                </div>
            ) : (
                <div>
                    <h1>
                        {timer.hours < 10
                            ? `0${timer.hours}`
                            : timer.hours}
                        :
                        {timer.minutes < 10
                            ? `0${timer.minutes}`
                            : timer.minutes}
                        :
                        {timer.seconds < 10
                            ? `0${timer.seconds}`
                            : timer.seconds}
                    </h1>
                    <button onClick={handleClick}>
                        {timeLeft === 0
                            ? "Reset"
                            : isRunning
                            ? "Pause"
                            : "Resume"}
                    </button>
                    {isStarted && timeLeft > 0 ? (
                        <button onClick={handleCancelClick}>
                            Cancel
                        </button>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default Timer;
