# DyFa MOVIE — មគ្គុទេសក៍ដំឡើងតាមទូរស័ព្ទ

## ឯកសារនេះជាអ្វី?
Website សាកល្បង DyFa MOVIE ប្រើ HTML/CSS/JavaScript, Firebase សម្រាប់ទិន្នន័យ និង Netlify សម្រាប់ Hosting។ ការបង្ហោះវីដេអូប្រើ YouTube Embed URL ដែលអ្នកមានសិទ្ធិប្រើប្រាស់។

## ជំហាន A — ដាក់ Website ឱ្យ Online (Netlify)
1. បើក GitHub ក្នុង Chrome ហើយបង្កើតគណនី ឬ Sign in: https://github.com/
2. បង្កើត repository ថ្មី ឈ្មោះ `dyfa-movie`។
3. ទាញយក ZIP នេះ រួច Extract ដោយ Files app លើ Android។
4. ចូល repository > Add file > Upload files។ Upload ឯកសារទាំងអស់នៅក្នុង folder `dyfa-movie-website` ទៅ root នៃ repository (កុំ upload ZIP ជំនួសឯកសារខាងក្នុង)។ Commit changes។
5. ចូល https://app.netlify.com/ ហើយ Sign up/Log in ដោយ GitHub។
6. ជ្រើស Add new project > Import an existing project > GitHub > ជ្រើស `dyfa-movie`។
7. Build command ទុកទទេ; Publish directory ដាក់ `.` រួច Deploy។
8. Netlify នឹងផ្ដល់ URL សម្រាប់ Website។ គម្រោង Free មានកូតា/លក្ខខណ្ឌអាចផ្លាស់ប្ដូរ សូមពិនិត្យ Pricing។

## ជំហាន B — Firebase (ចាំបាច់សម្រាប់ Admin និងការរក្សាទុករឿង)
1. បើក https://console.firebase.google.com/ ហើយបង្កើត Project ឈ្មោះ `dyfa-movie-site`។
2. បន្ថែម Web App (</>) ហើយចម្លង Firebase config។
3. Authentication > Sign-in method > Email/Password > Enable។
4. Authentication > Users > Add user ដើម្បីបង្កើត Admin អ៊ីមែល និងពាក្យសម្ងាត់។
5. Firestore Database > Create database។
6. ក្នុង repository នៅ GitHub បើក file `firebase-config.js` ដែលមានស្រាប់ ហើយជំនួសតម្លៃ placeholder ដោយ Firebase config របស់អ្នក។ កុំដាក់ពាក្យសម្ងាត់ក្នុង file នេះ។
7. បើក `firestore.rules` ហើយជំនួស `YOUR_ADMIN_EMAIL@example.com` ដោយអ៊ីមែល Admin ពិតប្រាកដ។ Copy Rules ទៅ Firestore > Rules > Publish។
8. Commit changes។ Netlify នឹង deploy ថ្មីដោយស្វ័យប្រវត្តិ។

## ជំហាន C — ប្រើប្រាស់
1. បើក Website ហើយចុច ចូល Admin។
2. Login ដោយ Admin email/password។
3. បញ្ចូលចំណងជើង ប្រភេទ Poster URL និង YouTube Embed URL។
4. ឧទាហរណ៍ URL: `https://www.youtube.com/embed/VIDEO_ID`។
5. ចុចរក្សាទុករឿង។

## ចំណាំសុវត្ថិភាព និងថ្លៃសេវា
- កុំបង្ហោះ Firebase service account key ឬពាក្យសម្ងាត់ទៅ GitHub។
- Firebase Web config មាន public identifiers; ការការពារទិន្នន័យត្រូវធ្វើតាម Authentication និង Firestore Security Rules។
- កុំដាក់ Firestore ក្នុង Test Mode សម្រាប់ Website សាធារណៈ។
- Firebase និង Netlify Free មាន quota/credit limits និងលក្ខខណ្ឌអាចផ្លាស់ប្ដូរ។ ពិនិត្យ https://firebase.google.com/pricing និង https://www.netlify.com/pricing/។
- ប្រើតែ Poster និងវីដេអូដែលអ្នកមានសិទ្ធិប្រើប្រាស់។
