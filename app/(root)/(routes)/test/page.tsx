"use client";
import MyEditor from "@/components/features/Editor";
import Writor from "@/components/features/Writor";
import { useState } from "react";

const PageTest = () => {
  const [state, setstate] = useState("");
  return (
    <div>
      {" "}
      <MyEditor value={state} onChange={setstate} />
      <div>
        <h2>Aperçu rendu :</h2>
        <Writor value={state} />
      </div>
    </div>
  );
};

export default PageTest;
