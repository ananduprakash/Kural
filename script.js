import { myFetch } from "./myfetch.js";

let table = document.getElementById("outtable");
let btnn = document.getElementById("next");
let btnp = document.getElementById("previous");
let loader = document.getElementById("loader");
let content = document.getElementById("content");

main();

function main() {
  let start = 1;
  let end = 10;
  let page = start;
  let list = `<tr><th>Number</th><th>Chapter</th><th>Verse</th><th>Explanation</th></tr>`;

  getData();
  btnn.addEventListener("click", getData);
  btnp.addEventListener("click", getData);

  async function getData() {
    loader.hidden = true;
    content.hidden = false;
    btnn.hidden = false;
    btnp.hidden = false;
    let li = `<tr></tr>`;
    let urls = [];
    let result;

    if (this == btnn) {
      start += 10;
      end += 10;
      page = start;
    } else if (this == btnp) {
      start -= 10;
      end -= 10;
      page = start;
    }
    if (start < 10) {
      btnp.hidden = true;
    }

    loader.hidden = false;
    content.hidden = true;

    for (let i = start, j = 0; i <= end; i++, j++) {
      urls[j] = "https://api-thirukkural.vercel.app/api?num=" + page;
      page++;
    }

    try {
      result = await Promise.allSettled(
        urls.map(async (url) => {
          let fetchobj = new myFetch(url);
          return await fetchobj.get();
        })
      );
    } catch {
      alert("Try Again");
    }

    result.forEach((res) => {

      if (res.status == 'rejected') {
        btnn.hidden = true;
        return;
      }
      li += `<tr>
                      <td>${res.value.number}</td>
                      <td>${res.value.chap_eng}</td>
                      <td>${res.value.eng}</td>
                      <td>${res.value.eng_exp}</td>         
                  </tr>`;
    });
    loader.hidden = true;
    content.hidden = false;
    list = li;
    table.innerHTML = list;

    // try {
    //     let fetchobj = new myFetch(url);
    //     let result;
    //     result = await fetchobj.get();
    //     console.log(i);
    //     if (result == 404) {
    //       btnn.hidden = true;
    //       break;
    //     }
    //     li += `<tr>
    //                 <td>${result.number}</td>
    //                 <td>${result.chap_eng}</td>
    //                 <td>${result.eng}</td>
    //                 <td>${result.eng_exp}</td>
    //             </tr>`;

    // fetchobj.get().then((result) => {
    // if (result == 404) {
    //   btnn.hidden = true;
    //   return;
    // }
    // li += `<tr>
    //             <td>${result.number}</td>
    //             <td>${result.chap_eng}</td>
    //             <td>${result.eng}</td>
    //             <td>${result.eng_exp}</td>
    //         </tr>`;

    //         loader.hidden = true;
    //         content.hidden = false;
    //         list = li;
    //         table.innerHTML = list;
    // });

    // } catch {
    //   alert("Try Again");
    // }
  }
}
