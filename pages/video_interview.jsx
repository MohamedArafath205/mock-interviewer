"use-client";
import React, { useState , useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export async function gen_questions(topic){
  const res = await fetch(`https://chatbot-lqsp.onrender.com/get-questions?topic=${topic}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json();
  console.log(data);
  return data;
}


export default function VideoInterview({topic}) {
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [capturing, setCapturing] = useState(false);

    const topics = topic

    const [questions, setQuestions] = useState([]);

    const getQuestions = async (topic) => {
      const res = await fetch(`https://chatbot-lqsp.onrender.com/get-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      })
      const data = await res.json();
      setQuestions(data);
      
    }
    
    const requestVideoPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setPermissionGranted(true);
          stream.getTracks().forEach(track => track.stop());
        } catch (err) {
          setPermissionGranted(false);
          setError('Permission denied or error accessing camera');
          console.error(err);
        }
      };
    
    const requestAudioPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setPermissionGranted(true);
          stream.getTracks().forEach(track => track.stop());
        } catch (err) {
          setPermissionGranted(false);
          setError('Permission denied or error accessing microphone');
          console.error(err);
        }
      };
    
    useEffect(() => {
        requestVideoPermission();
        requestAudioPermission();
        getQuestions(topics);
      }, []);
    
      const videoRef = useRef(null);
      const streamRef = useRef(null);
      const mediaRecorderRef = useRef(null);
      const chunksRef = useRef([]);
      const [isRecording, setIsRecording] = useState(false);
      const [recordedBlob, setRecordedBlob] = useState(null);
    
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
            console.error('Error accessing webcam:', err);
          }
        };
    
        startPreview();
    
        return () => {
          streamRef.current?.getTracks().forEach(track => track.stop());
        };
      }, []);
    
      const startRecording = () => {
        if (!streamRef.current) return;
    
        chunksRef.current = [];
        const recorder = new MediaRecorder(streamRef.current, { mimeType: 'video/webm' });
        mediaRecorderRef.current = recorder;
    
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };
    
        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          setRecordedBlob(blob);
          console.log('Recording complete. Blob stored.', blob);
        };
    
        recorder.start();
        setIsRecording(true);
      };
    
      const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
      };

    return (
    <div className="w-full min-h-screen flex flex-col px-4 pt-2 pb-8 md:px-8 md:py-2 bg-[#FCFCFC] relative overflow-x-hidden"> 
        {permissionGranted ? (
            <div className="h-full w-full items-center flex flex-col mt-[10vh]">
                <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{
                duration: 0.35,
                ease: [0.075, 0.82, 0.165, 1],
                }}
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
            <div className="absolute bottom-[6px] md:bottom-5 left-5 right-5">
                <div className="lg:mt-4 flex flex-col items-center justify-center gap-2">
                  {isRecording ? (
                      <div
                        id="stopTimer"
                        onClick={stopRecording}
                        className="flex h-10 w-10 flex-col items-center justify-center rounded-full bg-transparent text-white hover:shadow-xl ring-4 ring-white  active:scale-95 scale-100 duration-75 cursor-pointer"
                      >
                        <div className="h-5 w-5 rounded bg-red-500 cursor-pointer"></div>
                      </div>
                    ) : (
                      <button
                        id="startTimer"
                        onClick={startRecording}
                        className="flex h-8 w-8 sm:h-8 sm:w-8 flex-col items-center justify-center rounded-full bg-red-500 text-white hover:shadow-xl ring-4 ring-white ring-offset-gray-500 ring-offset-2 active:scale-95 scale-100 duration-75"
                      ></button>
                    )}
                    <div className="w-12"></div>
                  </div>
                </div>
            </div>
        ) : (
        <div className="w-full flex flex-col max-w-[1080px] mx-auto justify-center">
            <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{
                duration: 0.35,
                ease: [0.075, 0.82, 0.165, 1],
                }}
                className="relative md:aspect-[16/9] w-full max-w-[1080px] overflow-hidden bg-[#1D2B3A] rounded-lg ring-1 ring-gray-900/5 shadow-md flex flex-col items-center justify-center"
            >
                <p className="text-white font-medium text-lg text-center max-w-3xl">
                Camera permission is denied. We don{`'`}t store your
                attempts anywhere, but we understand not wanting to give
                us access to your camera. Try again by opening this page
                in an incognito window {`(`}or enable permissions in your
                browser settings{`)`}.
                </p>
            </motion.div>
            <div className="flex flex-row space-x-4 mt-8 justify-end">
                <button
                onClick={() => window.location.reload()}
                className="group max-w-[200px] rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#f5f7f9] text-[#1E2B3A] no-underline active:scale-95 scale-100 duration-75"
                style={{
                    boxShadow: "0 1px 1px #0c192714, 0 1px 3px #0c192724",
                }}
                >
                Restart demo
                </button>
                <Link
                href="https://github.com/Tameyer41/liftoff"
                target="_blank"
                className="group rounded-full pl-[8px] min-w-[180px] pr-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"
                style={{
                    boxShadow:
                    "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                }}
                >
                <span className="w-5 h-5 rounded-full bg-[#407BBF] flex items-center justify-center">
                    <svg
                    className="w-[16px] h-[16px] text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.75 7.75C4.75 6.64543 5.64543 5.75 6.75 5.75H17.25C18.3546 5.75 19.25 6.64543 19.25 7.75V16.25C19.25 17.3546 18.3546 18.25 17.25 18.25H6.75C5.64543 18.25 4.75 17.3546 4.75 16.25V7.75Z"
                    ></path>
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5.5 6.5L12 12.25L18.5 6.5"
                    ></path>
                    </svg>
                </span>
                Star on Github
                </Link>
            </div>
        </div>
        )}    
    </div>
)}