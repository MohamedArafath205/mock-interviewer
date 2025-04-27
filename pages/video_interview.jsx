"use client";
import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const SpeechRecognition = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

export default function VideoInterview({ topic }) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);

  const getQuestions = async (topic) => {
    const res = await fetch(`https://chatbot-lqsp.onrender.com/get-questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });
    const data = await res.json();
    setQuestions(data.Questions);
  };

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setPermissionGranted(true);
      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      setPermissionGranted(false);
      console.error(err);
    }
  };

  useEffect(() => {
    requestPermissions();
    getQuestions(topic);
  }, []);

  useEffect(() => {
    const startPreview = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };
    startPreview();
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const startRecognition = () => {
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + " " + transcriptChunk);
        } else {
          interimTranscript += transcriptChunk;
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecognition = () => {
    recognitionRef.current?.stop();
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current, { mimeType: "video/webm" });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      console.log("Recording complete.", blob);
    };

    recorder.start();
    setIsRecording(true);
    startRecognition(); // start speech recognition with video
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    stopRecognition(); // stop speech recognition with video
  };

  return (
    <div className="w-full min-h-screen flex flex-col px-4 pt-2 pb-8 md:px-8 md:py-2 bg-[#FCFCFC] relative overflow-x-hidden">
      <p className="absolute w-full top-0 h-[60px] flex flex-row justify-between -ml-4 md:-ml-8">
        {questions.map((q, idx) => (
          <span key={idx}>{q}</span>
        ))}
      </p>

      {permissionGranted ? (
        <div className="h-full w-full items-center flex flex-col mt-[10vh]">
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.35, ease: [0.075, 0.82, 0.165, 1] }}
            className="relative md:aspect-[16/9] w-full max-w-[1080px] overflow-hidden bg-[#1D2B3A] rounded-lg ring-1 ring-gray-900/5 shadow-md flex flex-col items-center justify-center"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-lg"
            />
          </motion.div>

          <textarea
            value={transcript}
            readOnly
            className="w-full max-w-[1080px] mt-4 p-2 border rounded-md bg-white text-black"
            rows={6}
          />

          <div className="absolute bottom-[6px] md:bottom-5 left-5 right-5 flex justify-center">
            {isRecording ? (
              <div
                onClick={stopRecording}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-white ring-4 ring-white active:scale-95 duration-75 cursor-pointer"
              >
                <div className="h-5 w-5 rounded bg-red-500"></div>
              </div>
            ) : (
              <button
                onClick={startRecording}
                className="h-8 w-8 rounded-full bg-red-500 text-white ring-4 ring-white active:scale-95 duration-75"
              ></button>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col max-w-[1080px] mx-auto justify-center">
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.35, ease: [0.075, 0.82, 0.165, 1] }}
            className="relative md:aspect-[16/9] w-full bg-[#1D2B3A] rounded-lg flex flex-col items-center justify-center"
          >
            <p className="text-white text-lg text-center">
              Camera permission denied. Try incognito window or enable settings.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
