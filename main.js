let listStudents = [{
    name: 'Антон',
    lastname: "Иванов",
    surname: "Александрович",
    // год, месяц - начинается с нуля и день
    birthday: new Date(1998, 1, 12),
    studyStart: 2005,
    faculty: "Авиационное оборудование"
  },
  {
    name: 'Сергей',
    lastname: "Яковлев",
    surname: "Александрович",
    birthday: new Date(2000, 3, 12),
    studyStart: 2005,
    faculty: "РЭО"
  }, {
    name: 'Геннадий',
    lastname: "Соколов",
    surname: "Сергеевич",
    birthday: new Date(2009, 4, 12),
    studyStart: 2023,
    faculty: "Самолеты и двигатели"
  }
]

let sortColumnFlag = 'newTdFIO',
  sortDirFlag = true;

// функция преобразования год, лет и года
function getAgeString(age) {
  let count = age % 100
  if (count >= 10 && count <= 20) {
    return "лет"
  } else {
    count = age % 10
    if (count === 1) {
      return "год"
    } else if (count >= 2 && count <= 4) {
      return "года"
    } else {
      return "лет"
    }
  }
}
// функция вычисления возраста
function getAge(birthday) {
  let today = new Date();
  let thisYear = 0;
  if (today.getMonth() < birthday.getMonth()) {
    thisYear = 1;
  } else if ((today.getMonth() == birthday.getMonth()) && today.getDate() < birthday.getDate()) {
    thisYear = 1;
  }
  let age = today.getFullYear() - birthday.getFullYear() - thisYear;
  return '(' + age + ' ' + getAgeString(age) + ')';
}
// функция преобразования даты
function formatDate(date) {
  let dd = date.getDate();
  if (dd < 10) dd = '0' + dd;
  let mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;
  let yy = date.getFullYear();
  if (yy < 10) yy = '0' + yy;
  return dd + '.' + mm + '.' + yy + ' ';
}

// функция для номера курса
function titleLearn(start) {
  let range = 0;
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();

  if ((start + 4) < year) {
    range = `${start}-${start+4} (закончил)`;
  }
  if ((start + 4) >= year) {
    if (month >= 8) {
      range = `${start}-${start+4} (${year-start+2} курс)`;
    } else {
      range = `${start}-${start+4} (${year-start+1} курс)`;
    }
    if ((year - start) < null) {
      range = `${start}-${start+4} (обучение спланирвано)`;
    }
    if ((year - start) == 0) {
      if (month >= 8) {
        range = `${start}-${start+4} (${year-start+2} курс)`;
      } else {
        range = `${start}-${start+4} (${year-start+1} курс)`;
      }
    }
  }
  return range;
}

// переменные для фильтрации
const filterForm = document.getElementById('filter-form');
const fioFilterInp = document.getElementById('filter-form__fio-inp');
const facultyFilterInp = document.getElementById('filter-form__faculty-inp');
const startFilterInp = document.getElementById('filter-form__start-inp');
const endFilterInp = document.getElementById('filter-form__startEnd-inp');

// функция фильтрации 
function filter(arr, prop, value) {
  return arr.filter(function (oneUser) {
    if (oneUser[prop].includes(value.trim())) return true
  });
}

// подготовка к рендеру
function getNewStudentTr(studentObj) {

  const newTr = document.createElement("tr");
  const newTdFIO = document.createElement("td");
  const newTdFaculty = document.createElement("td");
  const newTdBrthday = document.createElement("td");
  const newTdStudyStart = document.createElement("td");

  newTdFIO.textContent = `${studentObj.lastname} ${studentObj.name} ${studentObj.surname}`;
  newTdFaculty.textContent = studentObj.faculty;
  newTdBrthday.textContent = formatDate(new Date(studentObj.birthday)) + getAge(new Date(studentObj.birthday));
  newTdStudyStart.textContent = titleLearn(Number(studentObj.studyStart));
  newTr.append(newTdFIO, newTdFaculty, newTdBrthday, newTdStudyStart);
  return newTr;
}

// функция отрисовки - рендер
function render(arr) {
  // studTable.innerHTML = '';
  let copyArr = [...arr];

  const studTable = document.getElementById("stud-table");

  // console.log(copyArr);


  // очищаем экран
  studTable.innerHTML = '';

  // сортировка

  // При нажатии на ячейку заголовочной строки должна происходить сортировка по соответствующим полям студентов:
  // Ф. И. О. сортирует по соединённой строке из фамилии, имени и отчества по алфавиту по возрастанию.
  // Факультет — по факультету по алфавиту по возрастанию.
  // Дата рождения и возраст — по дате рождения по возрастанию.
  // Годы обучения — по году начала обучения.



  // цикл необходим для сортироки и фильтрации по полям объединяемым
  for (const studentObj of copyArr) {
    studentObj.newTdFIO = studentObj.name + ' ' + studentObj.surename + ' ' + studentObj.lastname;
    studentObj.newTdStudyStart = titleLearn(Number(studentObj.studyStart));
  }



  sortFIOBtn = document.getElementById('sort__fio');
  sortAgeBtn = document.getElementById('sort__age');
  sortFacultyBtn = document.getElementById('sort__faculty');
  sortStartBtn = document.getElementById('sort__start');

  // условие сортивроки
  copyArr = copyArr.sort(function (a, b) {
    // if (a.newTdFIO > b.newTdFIO) return -1;
    // if (a.faculty > b.faculty) return -1;
    // if (a.birthday < b.birthday) return -1;
    // if (a.studyStart < b.studyStart) return -1;
    // console.log(a.newTdFIO);

    // обращаемся как с массивом
    let sort = a[sortColumnFlag] < b[sortColumnFlag]
    if (sortDirFlag == false) sort = a[sortColumnFlag] > b[sortColumnFlag]
    return sort ? -1 : 1
  });



  // Фильтрация
  if (fioFilterInp.value.trim() !== "") {
    copyArr = filter(copyArr, 'newTdFIO', fioFilterInp.value);
  }

  if (facultyFilterInp.value.trim() !== "") {
    copyArr = filter(copyArr, 'faculty', facultyFilterInp.value);
  }

  if (startFilterInp.value.trim() !== "") {
    for (const studentObj of copyArr) {
      if (startFilterInp.value.trim() !== studentObj.studyStart) {
        copyArr = filter(copyArr, 'newTdStudyStart', startFilterInp.value);
      }
    }
  }

  if (endFilterInp.value.trim() !== "") {
    for (const studentObj of copyArr) {
      if (startFilterInp.value.trim() !== (studentObj.studyStart+1)) {
        copyArr = filter(copyArr, 'newTdStudyStart', endFilterInp.value);
      }
    }
   
  }

  for (const studentObj of copyArr) {
    const Tr = getNewStudentTr(studentObj);
    studTable.append(Tr);
  }

}


render(listStudents);

// Клики сортировки
sortFIOBtn.addEventListener('click', function () {
  // alert('ghb');
  sortColumnFlag = 'newTdFIO';
  sortDirFlag = !sortDirFlag;
  render(listStudents);
})

sortAgeBtn.addEventListener('click', function () {
  // alert('ghb');
  sortColumnFlag = 'birthday'
  sortDirFlag = !sortDirFlag
  render(listStudents)
})

sortFacultyBtn.addEventListener('click', function () {
  // alert('ghb');
  sortColumnFlag = 'faculty'
  sortDirFlag = !sortDirFlag
  render(listStudents)
})

sortStartBtn.addEventListener('click', function () {
  // alert('ghb');
  sortColumnFlag = 'studyStart'
  sortDirFlag = !sortDirFlag
  render(listStudents)
})


// Добавление данных из формы

// чтобы при отправке формы страница не обновлялась
document.getElementById("add-form").addEventListener("submit", function (event) {
  event.preventDefault();


  let today = new Date();
  // переменные ошибок
  let nameMistake = document.getElementById("name-mistake");
  let lastnameMistake = document.getElementById("lastname-mistake");
  let surnameMistake = document.getElementById("surname-mistake");
  let birthdayMistake = document.getElementById("birthday-mistake");
  let studyStartMistake = document.getElementById("studyStart-mistake");
  let facultytMistake = document.getElementById("faculty-mistake");
  // валидация

  if (document.getElementById("name-inp").value.trim() == "") {
    nameMistake.classList.remove('invisible');
    // нужно для прерывания функции
    return;
  }
  if (document.getElementById("lastname-inp").value.trim() == "") {
    lastnameMistake.classList.remove('invisible');
    nameMistake.classList.add('invisible');
    // нужно для прерывания функции
    return;
  }
  // trim удаляет пробелы
  if (document.getElementById("surname-inp").value.trim() == "") {
    surnameMistake.classList.remove('invisible');
    nameMistake.classList.add('invisible');
    lastnameMistake.classList.add('invisible');
    // нужно для прерывания функции
    return;
  }
  if (document.getElementById("birthday-inp").value.trim() == "") {
    birthdayMistake.classList.remove('invisible');
    nameMistake.classList.add('invisible');
    lastnameMistake.classList.add('invisible');
    surnameMistake.classList.add('invisible');
    return;
  }

  if (new Date(document.getElementById("birthday-inp").value.trim()) > today) {
    birthdayMistake.classList.remove('invisible');
    nameMistake.classList.add('invisible');
    lastnameMistake.classList.add('invisible');
    surnameMistake.classList.add('invisible');
    return;
  }
  if (document.getElementById("birthday-inp").value.trim() < "1900-01-01") {
    birthdayMistake.classList.remove('invisible');
    nameMistake.classList.add('invisible');
    lastnameMistake.classList.add('invisible');
    surnameMistake.classList.add('invisible');
    return;
  }

  // год начала обучения находится в диапазоне от 2000-го до текущего года.
  if (document.getElementById("studyStart-inp").value.trim() == "") {
    studyStartMistake.classList.remove('invisible');
    birthdayMistake.classList.add('invisible');
    nameMistake.classList.add('invisible');
    lastnameMistake.classList.add('invisible');
    surnameMistake.classList.add('invisible');
    return;
  }
  // извлекаем год
  if (document.getElementById("studyStart-inp").value.trim() > today.getFullYear()) {
    studyStartMistake.classList.remove('invisible');
    birthdayMistake.classList.add('invisible');
    nameMistake.classList.add('invisible');
    lastnameMistake.classList.add('invisible');
    surnameMistake.classList.add('invisible');
    return;
  }

  if (document.getElementById("studyStart-inp").value.trim() < 2000) {
    studyStartMistake.classList.remove('invisible');
    birthdayMistake.classList.add('invisible');
    nameMistake.classList.add('invisible');
    lastnameMistake.classList.add('invisible');
    surnameMistake.classList.add('invisible');
    return;
  }

  // начало обучение не меньше, чем год рождения
  let birthday = new Date(document.getElementById("birthday-inp").value.trim());
  let start = document.getElementById("studyStart-inp").value.trim();
  console.log(birthday.getFullYear());
  console.log(start);
  if (start < birthday.getFullYear()) {
    studyStartMistake.classList.remove('invisible');
    birthdayMistake.classList.add('invisible');
    nameMistake.classList.add('invisible');
    lastnameMistake.classList.add('invisible');
    surnameMistake.classList.add('invisible');
    return;
  }

  if (document.getElementById("faculty-inp").value.trim() == "") {
    facultytMistake.classList.remove('invisible');
    studyStartMistake.classList.add('invisible');
    birthdayMistake.classList.add('invisible');
    nameMistake.classList.add('invisible');
    lastnameMistake.classList.add('invisible');
    surnameMistake.classList.add('invisible');
    return;
  }





  let newStudentObj = {
    name: document.getElementById("name-inp").value.trim(),
    lastname: document.getElementById("lastname-inp").value.trim(),
    surname: document.getElementById("surname-inp").value.trim(),
    birthday: new Date(document.getElementById("birthday-inp").value.trim()),
    studyStart: document.getElementById("studyStart-inp").value.trim(),
    faculty: document.getElementById("faculty-inp").value.trim(),
  }


  listStudents.push(newStudentObj);


  render(listStudents);
  // очищаем поля формы после отправки
  event.target.reset();
  nameMistake.classList.add('invisible');
  lastnameMistake.classList.add('invisible');
  surnameMistake.classList.add('invisible');
  birthdayMistake.classList.add('invisible');
  studyStartMistake.classList.add('invisible');
  facultytMistake.classList.add('invisible');
});



// Фильтр
filterForm.addEventListener('submit', function (event) {
  event.preventDefault();
})

fioFilterInp.addEventListener('input', function () {
  render(listStudents);
})
facultyFilterInp.addEventListener('input', function () {
  render(listStudents);
})

startFilterInp.addEventListener('input', function () {
  render(listStudents);
})

endFilterInp.addEventListener('input', function () {
  render(listStudents);
  })




