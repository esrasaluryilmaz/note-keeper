// ! Ay dizisi
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ! Html'den gelen elemanlar
const addBox = document.querySelector(".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup");
const closeBtn = document.querySelector("header i");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");

//! localstorage'dan notelari al
let notes = JSON.parse(localStorage.getItem("notes")) || [];

//AddBox'a tiklaninca bir fonksiyon tetikle
addBox.addEventListener("click", () => {
  // PopupboxContainer ve popupbox'a bir class ekle
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");
  // Arka plandaki sayfa kaydırılmasını engelle
  document.querySelector("body").style.overflow = "hidden";
});

// CloseBtn'e tıklayınca popupBoxContainer ve popup'a eklenen classları kaldır
closeBtn.addEventListener("click", () => {
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");
  // Arka plandaki sayfa kaydırılmasını tekrardan aktif et
  document.querySelector("body").style.overflow = "auto";
});

//Menu kismini ayarlayan fonksyon
function showMenu(elem) {
  //parentElement bir elemanin kapsam alanina erismek icin kullanilir.
  //Tiklanilan elemanin clasina eristikten sonra buna bir class ekledik
  elem.parentElement.classList.add("show");

  //Tiklanilan yer menu kismi haricindeyse show clasini kaldir
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

//Wrapper kismindaki tiklanmari izle
wrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    showMenu(e.target);
  }
});
// Form'a bir olay izleyicisi ekle ve form icerisindeki verilere eris
form.addEventListener("submit", (e) => {
  e.preventDefault();

  //Form icerisindeki elemaanlara eris
  let titleInput = e.target[0];
  let descriptionInput = e.target[1];

  //form elemanlarinin icerisindeki degerlere eris
  let title = titleInput.value.trim();
  let description = descriptionInput.value.trim();

  // Eger title ve description degeri yoksa uyari ver
  if (!title && !description) {
    alert("Lütfen formdaki gerekli kısımları doldurunuz !");
  }
  // eger title ve description degerleri varsa gerekli bilgileri olustur.
  const date = new Date();

  let day = date.getDate();
  let year = date.getFullYear();
  let month = months[date.getMonth()];

  // Elde edilen verileri bir note objesi altinda topla

  let noteInfo = {
    title,
    description,
    date: `${month} ${day}, ${year}`,
  };

  // noteInfo objesini notes dizisine ekle
  notes.push(noteInfo);

  //Note objesini localstorage ekle
  localStorage.setItem("notes", JSON.stringify(notes));

  //Form icindeki elemanlari temizle
  titleInput.value = "";
  descriptionInput.value = "";

  // popup'i kapat
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");

  // Arka plandaki sayfa kaydırılmasını tekrardan aktif et
  document.querySelector("body").style.overflow = "auto";

  // Not eklendikten sonra notlari render et

  renderNotes();
});

//! Localstorage daki verilere gore ekrana note kartlari render eden fonk.
function renderNotes() {
  // Eğer localstorage'da not verisi yoksa fonksiyonu durdur
  if (!notes) return;

  // Önce  mevcut note'ları kaldır
  document.querySelectorAll(".note").forEach((li) => li.remove());

  // Note dizisindeki her bir eleman icin ekrana bir note karti render et
  notes.forEach((note) => {
    let liTag = `<li class="note">
        
        <div class="details">
          <p class="title">${note.title}</p>
          <p class="description">
            ${note.description}
          </p>
        </div>
        
        <div class="bottom-content">
          <span>${note.date}</span>
          <div class="settings">
            <i class="bx bx-dots-horizontal-rounded"></i>
            <ul class="menu">
              <li><i class="bx bx-edit"></i> Düzenle</li>
              <li><i class="bx bx-trash"></i> Sil</li>
            </ul>
          </div>
        </div>
      </li>`;
    //insertAdjacentHtml methodu belirli bir ogeyi bir html elemanina gore sirali sekilde eklemek icin kullanilir.Bu metot hangi konuma  ekleme yapilacak ve hangi eleman eklenecek bunu belirtmemizi ister.
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}
// Sayfa yuklendiginde renderNotes fonksiyonunu calistir.
document.addEventListener("DOMContentLoaded", () => renderNotes());
