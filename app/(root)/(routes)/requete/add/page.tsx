"use client";

import AddRequete from "@/components/requete/add-requete";
import { useState } from "react";
import { v4 as uuid } from "uuid";

const AddRequetePage = () => {
  const [id] = useState(() => uuid());
  return <AddRequete id={id} />;
};

export default AddRequetePage;
