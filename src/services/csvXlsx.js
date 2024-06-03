import papa from "papaparse";
import services from "@Services/index.js";

function toObject(table) {
  let thead = Array.from(table.tHead.rows[0].children)
    .slice(0, -1)
    .map((el) => el.textContent);

  let tbody = Array.from(table.tBodies[0].rows).map(
    (row) =>
      Array.from(row.cells)
        .slice(0, -1)
        .map((cell) => cell.textContent) // Exclure la dernière colonne
  );
  thead = thead.map((item) => item.trim());
  let data = [];
  tbody.forEach((elem) => {
    data.push(elem.map((item) => item.trim()));
  });
  tbody = data;
  return {
    table: [thead].concat(tbody),
    thead,
    tbody,
  };
}

function downloadCSV(data, filename) {
  const blob = new Blob([data], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
}

function convertCSVToExcel(csvData, filename) {
  const csvArray = csvData.split("\n").map((row) => row.split(","));
  const workbook = XLSX.utils.book_new();
  workbook.SheetNames.push("Sheet1");
  const worksheet = XLSX.utils.aoa_to_sheet(csvArray);
  workbook.Sheets["Sheet1"] = worksheet;
  const excelBinary = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "binary",
  });
  const excelBlob = new Blob([s2ab(excelBinary)], {
    type: "application/octet-stream",
  });
  const excelUrl = URL.createObjectURL(excelBlob);
  const a = document.createElement("a");

  a.style.display = "none";
  a.href = excelUrl;
  a.download = `${filename}.xlsx`;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(excelUrl);
}

const exportData = (selector, type, filename) => {
  const table = document.querySelector(selector);
  console.log(table);
  const obj = toObject(table);
  const jsonStr = JSON.stringify(obj.tbody);
  var csv = papa.unparse({
    fields: obj.thead,
    data: jsonStr,
  });

  if (type == "csv") downloadCSV(csv, filename);
  else convertCSVToExcel(csv, filename);
};

const exportAnalysis = async(type, filename, data, headers)=>{
   data = data.map((item) => {
      let tmp = { ...item };
      Object.keys(tmp).forEach((key) => {
        console.log((key.charAt(0).toUpperCase() + key.slice(1)).replace("-", " "))
        tmp[(key.charAt(0).toUpperCase() + key.slice(1)).replace("-", " ")] =
          tmp[key];
        delete tmp[key];
      });
      return tmp;
    });

    const jsonStr = JSON.stringify(data);
    var csv = papa.unparse({
      fields: headers,
      data: jsonStr,
    });

    if (type == "csv") downloadCSV(csv, filename);
    else convertCSVToExcel(csv, filename);
}

const exportData2 = async (type, filename, filters, length, headers) => {
  const response = await new Promise((resolve, reject) => {
    services.get_Record(filters + "&page=1&limit=" + length, (response) => {
      resolve(response);
    });
  });

  if (response.status == 200) {
    let datas = response.data["data"];

    datas = datas.map((item) => {
      let tmp = { ...item };
      Object.keys(tmp).forEach((key) => {
        tmp[(key.charAt(0).toUpperCase() + key.slice(1)).replace("_", " ")] =
          tmp[key];
        delete tmp[key];
      });
      return tmp;
    });

    const jsonStr = JSON.stringify(datas);
    var csv = papa.unparse({
      fields: headers,
      data: jsonStr,
    });

    if (type == "csv") downloadCSV(csv, filename);
    else convertCSVToExcel(csv, filename);
  }
};

export default {
  exportData,
  exportData2,
  exportAnalysis
};
