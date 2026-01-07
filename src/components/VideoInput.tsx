import React, { useRef, useState } from "react";

export default function VideoInput(props: any) {
  const { GetblobUrl, videoRefToChiled } = props;

  const inputRef: any = useRef("");

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    GetblobUrl(url);

    videoRefToChiled.current.src = url;
  };

  const handleChoose = (event: any) => {
    inputRef.current.click();
  };

  return (
    <div className="VideoInput">
      <input
        ref={inputRef}
        className="VideoInput_input"
        type="file"
        onChange={handleFileChange}
        accept=".mov,.mp4"
      />
    </div>
  );
}
