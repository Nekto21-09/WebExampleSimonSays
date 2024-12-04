import { send } from "../utilities";

let table = document.querySelector("#recordsTable") as HTMLTableElement;

let [recordNames, recordScores] = await send("getRecords", null) as [string[], number[]];

for (let i = 0; i < recordNames.length; i++) {

  if (recordNames[i] == "") {
    recordNames[i] = "Unknown";
  }

  let tr = document.createElement("tr");
  table.appendChild(tr);
  
  let nameTd = document.createElement("td");
  nameTd.innerText = recordNames[i];
  tr.appendChild(nameTd);

  let scoreTd = document.createElement("td");
  scoreTd.innerText = String(recordScores[i]);
  scoreTd.classList.add("toRight");
  tr.appendChild(scoreTd);
}