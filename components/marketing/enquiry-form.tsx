"use client";
import { useState } from "react";

export function EnquiryForm({quote=false}:{quote?:boolean}) {
 const [prepared,setPrepared]=useState(false);
 const [error,setError]=useState("");
 function submit(event:React.FormEvent<HTMLFormElement>) {
  event.preventDefault();const data=new FormData(event.currentTarget);
  if(quote && data.getAll("Logiciels").length===0){setError("Sélectionnez au moins un logiciel pour votre devis.");return;}
  setError("");
  const lines=Array.from(data.entries()).map(([k,v])=>`${k} : ${String(v)}`);
  const subject=quote?`Demande de devis — ${data.get("Société")}`:`Contact — ${data.get("Objet")}`;
  window.location.href=`mailto:email@malisystem.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  setPrepared(true);
 }
 return <form className="ms-form" onSubmit={submit}>
  {quote && <><fieldset><legend>1. Vos logiciels</legend>{["RHPaie","TimeSheet","RHData","RHFacture"].map(x=><label className="ms-checkbox" key={x}><input type="checkbox" name="Logiciels" value={x}/>{x}</label>)}<small>Précisez vos besoins dans le commentaire si vous souhaitez être conseillé.</small></fieldset>
  <fieldset><legend>2. Votre configuration</legend><div className="ms-field-grid"><label>Nombre de salariés<input name="Salariés" type="number" min="10" max="1000000" required defaultValue={10}/></label><label>Postes utilisateurs<input name="Postes" type="number" min="1" max="10000" required defaultValue={1}/></label></div><label>Personnes à former<input name="Personnes à former" type="number" min="0" max="10000" required defaultValue={1}/></label><label>Installation<select name="Installation"><option>Monoposte</option><option>Réseau local</option><option>Client / serveur</option><option>À définir avec votre équipe</option></select></label><label>Convention de salaire<input name="Convention" placeholder="Mines, commerce, BTP…" required maxLength={200}/></label></fieldset></>}
  <div className="ms-field-grid"><label>Votre nom<input name="Nom" required autoComplete="name" maxLength={150}/></label><label>Société<input name="Société" required autoComplete="organization" maxLength={200}/></label></div>
  <div className="ms-field-grid"><label>Email<input name="Email" type="email" required autoComplete="email" maxLength={254}/></label><label>Téléphone<input name="Téléphone" type="tel" required={quote} autoComplete="tel" maxLength={40}/></label></div>
  {quote?<label>Adresse<input name="Adresse" required autoComplete="street-address" maxLength={400}/></label>:<label>Objet<input name="Objet" required maxLength={200}/></label>}
  <label>{quote?"Commentaire / questions":"Votre message"}<textarea name="Message" required={!quote} maxLength={5000}/></label>
  <small>Le bouton ouvre votre logiciel de messagerie avec les informations saisies. Vous pourrez vérifier puis envoyer votre demande à email@malisystem.com.</small>
  {error&&<p role="alert">{error}</p>}
  <button type="submit" className="ms-button">Préparer {quote?"ma demande de devis":"mon message"} ↗</button>
  {prepared&&<p role="status">Votre email est préparé. Envoyez-le depuis votre messagerie. Si elle ne s’ouvre pas, contactez email@malisystem.com ou le +223 66 22 40 57.</p>}
 </form>;
}
