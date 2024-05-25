
// import { sayHelloBeach } from "./modules/hello.js"
import sayHelloBeach from "./modules/hello.js" //default

console.log("Index")
sayHelloBeach()



// https://air-datepicker.com/docs
// import AirDatepicker from 'air-datepicker';
// import localeEn from 'air-datepicker/locale/en';

// new AirDatepicker('#el', {
//   locale: localeEn
// })

import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

const picker = new AirDatepicker('#input')