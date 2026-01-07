import "./css/editor.css";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useRef, useState, useEffect } from "react";
import VideoInput from "./components/VideoInput";

export function App() {
  const [loaded, setLoaded] = useState(false);
  const [blobUrl, setbloburl] = useState("");
  const ffmpegRef = useRef(new FFmpeg());

  const videoRef: any = useRef(null);
  const messageRef: any = useRef(null);

  function GetblobUrl(url: string) {
    setbloburl(url);
  }
  useEffect(() => {
    async function load() {
      const baseURL =
        "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm";
      const ffmpeg = ffmpegRef.current;

      ffmpeg.on("log", ({ message }) => {
        messageRef.current.innerHTML = message;
        console.log(message);
      });
      // toBlobURL is used to bypass CORS issue, urls with the same
      // domain can be used directly.
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });

      setLoaded(true);
    }
    load();
  }, []);

  const transcode = async () => {
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile("input.mp4", await fetchFile(blobUrl));

    //-i input.mp4 -ss 00:05:10 -to 00:15:30 -c:v copy -c:a copy output2.mp4

    //"-i", inputFileName, "-ss", `${minTime}`, "-to", `${maxTime}`, "-f", "gif", outputFileName
    await ffmpeg.exec([
      "-ss",
      "00:00:50",
      "-to",
      "00:01:30",
      "-i",
      "input.mp4",
      "-c",
      "copy",
      "output.mp4",
    ]);

    //await ffmpeg.exec(["-i", "input.mp4", "output.webm"]);
    const data = await ffmpeg.readFile("output.mp4");

    videoRef.current.src = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );
  };

  return loaded ? (
    <>
      <div className="editor">
        <h1>Video upload</h1>
        <VideoInput videoRefToChiled={videoRef} GetblobUrl={GetblobUrl} />

        <video height={400} width={600} ref={videoRef} controls></video>
        <br />
        <button onClick={transcode}>cut video</button>
        <p ref={messageRef}></p>
      </div>
    </>
  ) : (
    //<button onClick={load}>Load ffmpeg-core (~31 MB)</button>
  <div>Loading ffmpeg in memory...</div>
  );
}

export default App;
