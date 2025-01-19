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
const popupTitle = document.querySelector("header p");
const submitBtn = document.querySelector("#submit-btn");

//! localstorage'dan notelari al
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// ! Guncelleme icin gereken degiskeenler
let isUpdate = false;
let updateId = null;

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
    //Tiklanilan kisim i etiketi degilse yada kapsam disindaysa show classini kaldir.
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

//Wrapper kismindaki tiklanmari izle
wrapper.addEventListener("click", (e) => {
  // Eğer üç noktaya tıklanıldıysa
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    showMenu(e.target);
  }
  // Eğer sil ikonuna tıklandıldıysa
  else if (e.target.classList.contains("deleteIcon")) {
    const res = confirm("Bu notu silmek istediğinize eminmisiniz ?");
    if (res) {
      // Tıklanılan note elemanına eriş
      const note = e.target.closest(".note");
      // Notun idsine eriş
      const noteId = note.dataset.id;
      // Notes dizisini dön ve id'si noteId'ye eşit olan elemanı diziden kaldır
      notes = notes.filter((note) => note.id != noteId);

      // localStorage'ı güncelle
      localStorage.setItem("notes", JSON.stringify(notes));

      // renderNotes fonksiyonunu çalıştır
      renderNotes();
    }
  }
  //eger  guncelle ikonuna tiklanildiysa
  else if (e.target.classList.contains("updateIcon")) {
    //Tiklanilan note elemanina eris
    const note = e.target.closest(".note");
    //note elemaninin id  sine eris
    const noteId = parseInt(note.dataset.id);
    //Note dizisi icerisinde id'si bilinen elemani bul
    const foundedNote = notes.find((note) => note.id === noteId);

    //popup icerisindeki elemanlara note degerlerini ata
    form[0].value = foundedNote.title;
    form[1].value = foundedNote.description;
    //Popup i ac
    popupBoxContainer.classList.add("show");
    popupBox.classList.add("show");

    //Guncelleme modunu aktif et
    isUpdate = true;
    updateId = noteId;

    //Popup icerisindeki gerekli olanlari update e gore duzenle
    popupTitle.textContent = "Update Note";
    submitBtn.textContent = "Update";
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
  let id = new Date().getTime();
  let day = date.getDate();
  let year = date.getFullYear();
  let month = months[date.getMonth()];

  // eger guncelleme modundaysa
  if (isUpdate) {
    // Guncelleme yapilacak elemanin dizi icerisindeki indexini bul
    const noteIndex = notes.findIndex((note) => {
      return note.id == updateId;
    });
    console.log(noteIndex);
    // Dizi icerisinde yukarida bulunan index'deki elemanin degerlerini guncelle
    notes[noteIndex + 1] = {
      ...notes[noteIndex],
      title,
      description,
      id,
      date: `${month} ${day}, ${year}`,
    };

    isUpdate = false;
    updateId = null;
    popupTitle.textContent = "New Note";
    submitBtn.textContent = "Add Note";
  } else {
    // Elde edilen verileri bir note objesi altinda topla

    let noteInfo = {
      title,
      description,
      date: `${month} ${day}, ${year}`,
      id,
    };
    // noteInfo objesini notes dizisine ekle
    notes.push(noteInfo);
  }

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
    let liTag = `<li class="note" data-id='${note.id}'>
        
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
              <li class='updateIcon'><i class="bx bx-edit"></i> Düzenle</li>
              <li class='deleteIcon'><i class="bx bx-trash"></i> Sil</li>
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
