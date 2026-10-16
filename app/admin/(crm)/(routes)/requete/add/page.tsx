"use client";

import AddRequete from "@/components/requete/add-requete";
import { v4 as uuid } from "uuid";

const AddRequetePage = () => {
  const id = uuid();
  console.log("Generated UUID:", id);
  return <AddRequete id={id} />;
};

export default AddRequetePage;
