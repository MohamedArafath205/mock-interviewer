"use-client";
import React, { useState , useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export default function VideoInterview() {
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [capturing, setCapturing] = useState(false);
    
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
 


// <div className="w-full min-h-screen flex flex-col px-4 pt-2 pb-8 md:px-8 md:py-2 bg-[#FCFCFC] relative overflow-x-hidden">
// <p className="absolute w-full top-0 h-[60px] flex flex-row justify-between -ml-4 md:-ml-8">
//   <span className="text-sm text-[#1a2b3b] font-medium">
//     demo interview
//   </span>
//   <span className="text-sm text-[#1a2b3b] font-medium opacity-20">
//     demo interview
//   </span>
//   <span className="text-sm text-[#1a2b3b] font-medium">
//     demo interview
//   </span>
//   <span className="text-sm text-[#1a2b3b] font-medium opacity-20 hidden sm:block">
//     demo interview
//   </span>
//   <span className="text-sm text-[#1a2b3b] font-medium hidden sm:block">
//     demo interview
//   </span>
//   <span className="text-sm text-[#1a2b3b] font-medium opacity-20 hidden xl:block">
//     demo interview
//   </span>
//   <span className="text-sm text-[#1a2b3b] font-medium opacity-20 hidden sm:block">
//     demo interview
//   </span>
//   <span className="text-sm text-[#1a2b3b] font-medium opacity-20 hidden sm:block">
//     demo interview
//   </span>
//   <span className="text-sm text-[#1a2b3b] font-medium hidden sm:block">
//     demo interview
//   </span>
//   <span className="text-sm text-[#1a2b3b] font-medium opacity-20 hidden xl:block">
//     demo interview
//   </span>
// </p>
// {completed ? (
//   <div className="w-full flex flex-col max-w-[1080px] mx-auto mt-[10vh] overflow-y-auto pb-8 md:pb-12">
//     <motion.div
//       initial={{ y: 20 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.35, ease: [0.075, 0.82, 0.165, 1] }}
//       className="relative md:aspect-[16/9] w-full max-w-[1080px] overflow-hidden bg-[#1D2B3A] rounded-lg ring-1 ring-gray-900/5 shadow-md flex flex-col items-center justify-center"
//     >
//       <video
//         className="w-full h-full rounded-lg"
//         controls
//         crossOrigin="anonymous"
//         autoPlay
//       >
//         <source
//           src={URL.createObjectURL(
//             new Blob(recordedChunks, { type: "video/mp4" })
//           )}
//           type="video/mp4"
//         />
//       </video>
//     </motion.div>
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{
//         delay: 0.5,
//         duration: 0.15,
//         ease: [0.23, 1, 0.82, 1],
//       }}
//       className="flex flex-col md:flex-row items-center mt-2 md:mt-4 md:justify-between space-y-1 md:space-y-0"
//     >
//       <div className="flex flex-row items-center space-x-1">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth={2}
//           stroke="currentColor"
//           className="w-4 h-4 text-[#407BBF] shrink-0"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
//           />
//         </svg>
//         <p className="text-[14px] font-normal leading-[20px] text-[#1a2b3b]">
//           Video is not stored on our servers, and will go away as soon
//           as you leave the page.
//         </p>
//       </div>
//       <Link
//         href="https://github.com/Tameyer41/liftoff"
//         target="_blank"
//         className="group rounded-full pl-[8px] min-w-[180px] pr-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"
//         style={{
//           boxShadow:
//             "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
//         }}
//       >
//         <span className="w-5 h-5 rounded-full bg-[#407BBF] flex items-center justify-center">
//           <svg
//             className="w-[16px] h-[16px] text-white"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <path
//               stroke="currentColor"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M4.75 7.75C4.75 6.64543 5.64543 5.75 6.75 5.75H17.25C18.3546 5.75 19.25 6.64543 19.25 7.75V16.25C19.25 17.3546 18.3546 18.25 17.25 18.25H6.75C5.64543 18.25 4.75 17.3546 4.75 16.25V7.75Z"
//             ></path>
//             <path
//               stroke="currentColor"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M5.5 6.5L12 12.25L18.5 6.5"
//             ></path>
//           </svg>
//         </span>
//         Star on Github
//       </Link>
//     </motion.div>
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{
//         delay: 0.5,
//         duration: 0.15,
//         ease: [0.23, 1, 0.82, 1],
//       }}
//       className="mt-8 flex flex-col"
//     >
//       <div>
//         <h2 className="text-xl font-semibold text-left text-[#1D2B3A] mb-2">
//           Transcript
//         </h2>
//         <p className="prose prose-sm max-w-none">
//           {transcript.length > 0
//             ? transcript
//             : "Don't think you said anything. Want to try again?"}
//         </p>
//       </div>
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold text-left text-[#1D2B3A] mb-2">
//           Feedback
//         </h2>
//         <div className="mt-4 text-sm flex gap-2.5 rounded-lg border border-[#EEEEEE] bg-[#FAFAFA] p-4 leading-6 text-gray-900 min-h-[100px]">
//           <p className="prose prose-sm max-w-none">
//             {generatedFeedback}
//           </p>
//         </div>
//       </div>
//     </motion.div>
//   </div>
// ) : (
//   <div className="h-full w-full items-center flex flex-col mt-[10vh]">
//     {recordingPermission ? (
//       <div className="w-full flex flex-col max-w-[1080px] mx-auto justify-center">
//         <h2 className="text-2xl font-semibold text-left text-[#1D2B3A] mb-2">
//           {selected.name === "Behavioral"
//             ? `Tell me about yourself. Why don${`’`}t you walk me through your resume?`
//             : selectedInterviewer.name === "John"
//             ? "What is a Hash Table, and what is the average case and worst case time for each of its operations?"
//             : selectedInterviewer.name === "Richard"
//             ? "Uber is looking to expand its product line. Talk me through how you would approach this problem."
//             : "You have a 3-gallon jug and 5-gallon jug, how do you measure out exactly 4 gallons?"}
//         </h2>
//         <span className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal mb-4">
//           Asked by top companies like Google, Facebook and more
//         </span>
//         <motion.div
//           initial={{ y: -20 }}
//           animate={{ y: 0 }}
//           transition={{
//             duration: 0.35,
//             ease: [0.075, 0.82, 0.965, 1],
//           }}
//           className="relative aspect-[16/9] w-full max-w-[1080px] overflow-hidden bg-[#1D2B3A] rounded-lg ring-1 ring-gray-900/5 shadow-md"
//         >
//           {!cameraLoaded && (
//             <div className="text-white absolute top-1/2 left-1/2 z-20 flex items-center">
//               <svg
//                 className="animate-spin h-4 w-4 text-white mx-auto my-0.5"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth={3}
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 ></path>
//               </svg>
//             </div>
//           )}
//           <div className="relative z-10 h-full w-full rounded-lg">
//             <div className="absolute top-5 lg:top-10 left-5 lg:left-10 z-20">
//               <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
//                 {new Date(seconds * 1000).toISOString().slice(14, 19)}
//               </span>
//             </div>
//             {isVisible && ( // If the video is visible (on screen) we show it
//               <div className="block absolute top-[10px] sm:top-[20px] lg:top-[40px] left-auto right-[10px] sm:right-[20px] md:right-10 h-[80px] sm:h-[140px] md:h-[180px] aspect-video rounded z-20">
//                 <div className="h-full w-full aspect-video rounded md:rounded-lg lg:rounded-xl">
//                   <video
//                     id="question-video"
//                     onEnded={() => setVideoEnded(true)}
//                     controls={false}
//                     ref={vidRef}
//                     playsInline
//                     className="h-full object-cover w-full rounded-md md:rounded-[12px] aspect-video"
//                     crossOrigin="anonymous"
//                   >
//                     <source
//                       src={
//                         selectedInterviewer.name === "John"
//                           ? selected.name === "Behavioral"
//                             ? "https://liftoff-public.s3.amazonaws.com/DemoInterviewMale.mp4"
//                             : "https://liftoff-public.s3.amazonaws.com/JohnTechnical.mp4"
//                           : selectedInterviewer.name === "Richard"
//                           ? selected.name === "Behavioral"
//                             ? "https://liftoff-public.s3.amazonaws.com/RichardBehavioral.mp4"
//                             : "https://liftoff-public.s3.amazonaws.com/RichardTechnical.mp4"
//                           : selectedInterviewer.name === "Sarah"
//                           ? selected.name === "Behavioral"
//                             ? "https://liftoff-public.s3.amazonaws.com/BehavioralSarah.mp4"
//                             : "https://liftoff-public.s3.amazonaws.com/SarahTechnical.mp4"
//                           : selected.name === "Behavioral"
//                           ? "https://liftoff-public.s3.amazonaws.com/DemoInterviewMale.mp4"
//                           : "https://liftoff-public.s3.amazonaws.com/JohnTechnical.mp4"
//                       }
//                       type="video/mp4"
//                     />
//                   </video>
//                 </div>
//               </div>
//             )}
//             <Webcam
//               mirrored
//               audio
//               muted
//               ref={webcamRef}
//               videoConstraints={videoConstraints}
//               onUserMedia={handleUserMedia}
//               onUserMediaError={(error) => {
//                 setRecordingPermission(false);
//               }}
//               className="absolute z-10 min-h-[100%] min-w-[100%] h-auto w-auto object-cover"
//             />
//           </div>
//           {loading && (
//             <div className="absolute flex h-full w-full items-center justify-center">
//               <div className="relative h-[112px] w-[112px] rounded-lg object-cover text-[2rem]">
//                 <div className="flex h-[112px] w-[112px] items-center justify-center rounded-[0.5rem] bg-[#4171d8] !text-white">
//                   Loading...
//                 </div>
//               </div>
//             </div>
//           )}

//           {cameraLoaded && (
//             <div className="absolute bottom-0 left-0 z-50 flex h-[82px] w-full items-center justify-center">
//               {recordedChunks.length > 0 ? (
//                 <>
//                   {isSuccess ? (
//                     <button
//                       className="cursor-disabled group rounded-full min-w-[140px] px-4 py-2 text-[13px] font-semibold group inline-flex items-center justify-center text-sm text-white duration-150 bg-green-500 hover:bg-green-600 hover:text-slate-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 active:scale-100 active:bg-green-800 active:text-green-100"
//                       style={{
//                         boxShadow:
//                           "0px 1px 4px rgba(27, 71, 13, 0.17), inset 0px 0px 0px 1px #5fc767, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
//                       }}
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 mx-auto"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={2}
//                       >
//                         <motion.path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                           initial={{ pathLength: 0 }}
//                           animate={{ pathLength: 1 }}
//                           transition={{ duration: 0.5 }}
//                         />
//                       </svg>
//                     </button>
//                   ) : (
//                     <div className="flex flex-row gap-2">
//                       {!isSubmitting && (
//                         <button
//                           onClick={() => restartVideo()}
//                           className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-white text-[#1E2B3A] hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"
//                         >
//                           Restart
//                         </button>
//                       )}
//                       <button
//                         onClick={handleDownload}
//                         disabled={isSubmitting}
//                         className="group rounded-full min-w-[140px] px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex  active:scale-95 scale-100 duration-75  disabled:cursor-not-allowed"
//                         style={{
//                           boxShadow:
//                             "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
//                         }}
//                       >
//                         <span>
//                           {isSubmitting ? (
//                             <div className="flex items-center justify-center gap-x-2">
//                               <svg
//                                 className="animate-spin h-5 w-5 text-slate-50 mx-auto"
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <circle
//                                   className="opacity-25"
//                                   cx="12"
//                                   cy="12"
//                                   r="10"
//                                   stroke="currentColor"
//                                   strokeWidth={3}
//                                 ></circle>
//                                 <path
//                                   className="opacity-75"
//                                   fill="currentColor"
//                                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                 ></path>
//                               </svg>
//                               <span>{status}</span>
//                             </div>
//                           ) : (
//                             <div className="flex items-center justify-center gap-x-2">
//                               <span>Process transcript</span>
//                               <svg
//                                 className="w-5 h-5"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 xmlns="http://www.w3.org/2000/svg"
//                               >
//                                 <path
//                                   d="M13.75 6.75L19.25 12L13.75 17.25"
//                                   stroke="white"
//                                   strokeWidth="1.5"
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                 />
//                                 <path
//                                   d="M19 12H4.75"
//                                   stroke="white"
//                                   strokeWidth="1.5"
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                 />
//                               </svg>
//                             </div>
//                           )}
//                         </span>
//                       </button>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <div className="absolute bottom-[6px] md:bottom-5 left-5 right-5">
//                   <div className="lg:mt-4 flex flex-col items-center justify-center gap-2">
//                     {capturing ? (
//                       <div
//                         id="stopTimer"
//                         onClick={handleStopCaptureClick}
//                         className="flex h-10 w-10 flex-col items-center justify-center rounded-full bg-transparent text-white hover:shadow-xl ring-4 ring-white  active:scale-95 scale-100 duration-75 cursor-pointer"
//                       >
//                         <div className="h-5 w-5 rounded bg-red-500 cursor-pointer"></div>
//                       </div>
//                     ) : (
//                       <button
//                         id="startTimer"
//                         onClick={handleStartCaptureClick}
//                         className="flex h-8 w-8 sm:h-8 sm:w-8 flex-col items-center justify-center rounded-full bg-red-500 text-white hover:shadow-xl ring-4 ring-white ring-offset-gray-500 ring-offset-2 active:scale-95 scale-100 duration-75"
//                       ></button>
//                     )}
//                     <div className="w-12"></div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//           <div
//             className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-5xl text-white font-semibold text-center"
//             id="countdown"
//           ></div>
//         </motion.div>
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{
//             delay: 0.5,
//             duration: 0.15,
//             ease: [0.23, 1, 0.82, 1],
//           }}
//           className="flex flex-row space-x-1 mt-4 items-center"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth={2}
//             stroke="currentColor"
//             className="w-4 h-4 text-[#407BBF]"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
//             />
//           </svg>
//           <p className="text-[14px] font-normal leading-[20px] text-[#1a2b3b]">
//             Video is not stored on our servers, it is solely used for
//             transcription.
//           </p>
//         </motion.div>
//       </div>
//     ) : (
//       <div className="w-full flex flex-col max-w-[1080px] mx-auto justify-center">
//         <motion.div
//           initial={{ y: 20 }}
//           animate={{ y: 0 }}
//           transition={{
//             duration: 0.35,
//             ease: [0.075, 0.82, 0.165, 1],
//           }}
//           className="relative md:aspect-[16/9] w-full max-w-[1080px] overflow-hidden bg-[#1D2B3A] rounded-lg ring-1 ring-gray-900/5 shadow-md flex flex-col items-center justify-center"
//         >
//           <p className="text-white font-medium text-lg text-center max-w-3xl">
//             Camera permission is denied. We don{`'`}t store your
//             attempts anywhere, but we understand not wanting to give
//             us access to your camera. Try again by opening this page
//             in an incognito window {`(`}or enable permissions in your
//             browser settings{`)`}.
//           </p>
//         </motion.div>
//         <div className="flex flex-row space-x-4 mt-8 justify-end">
//           <button
//             onClick={() => setStep(1)}
//             className="group max-w-[200px] rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#f5f7f9] text-[#1E2B3A] no-underline active:scale-95 scale-100 duration-75"
//             style={{
//               boxShadow: "0 1px 1px #0c192714, 0 1px 3px #0c192724",
//             }}
//           >
//             Restart demo
//           </button>
//           <Link
//             href="https://github.com/Tameyer41/liftoff"
//             target="_blank"
//             className="group rounded-full pl-[8px] min-w-[180px] pr-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"
//             style={{
//               boxShadow:
//                 "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
//             }}
//           >
//             <span className="w-5 h-5 rounded-full bg-[#407BBF] flex items-center justify-center">
//               <svg
//                 className="w-[16px] h-[16px] text-white"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4.75 7.75C4.75 6.64543 5.64543 5.75 6.75 5.75H17.25C18.3546 5.75 19.25 6.64543 19.25 7.75V16.25C19.25 17.3546 18.3546 18.25 17.25 18.25H6.75C5.64543 18.25 4.75 17.3546 4.75 16.25V7.75Z"
//                 ></path>
//                 <path
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M5.5 6.5L12 12.25L18.5 6.5"
//                 ></path>
//               </svg>
//             </span>
//             Star on Github
//           </Link>
//         </div>
//       </div>
//     )}
//   </div>
// )}
// </div>
