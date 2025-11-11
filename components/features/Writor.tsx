"use client";

import "@/styles/styles.scss";

const Writor = ({ value }: { value: string }) => {
  return <div className="tiptap" dangerouslySetInnerHTML={{ __html: value }} />;
};

export default Writor;
