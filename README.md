# CCMN

This project aims to give the opportunity to create a software product with
real hardware. This subject was made in collaboration with Cisco.

Cisco_CMX_Locate:
  URL: "https://cisco-cmx.unit.ua"
  Username: "RO"
  Password: "just4reading"

Cisco_CMX_Presence:
  URL: "https://cisco-presence.unit.ua"
  Username: "RO"
  Password: "Passw0rd"
  
 BOT access token - NTMwZGZjMjItOTkwMC00NGFhLThjOGMtYWIxZTFjMzEzOGUyNDUyNjZjMGMtOWQz
  room 
{
	"id": "Y2lzY29zcGFyazovL3VzL1JPT00vMzE4MzA5MTAtOWIyMC0xMWU4LTgyNWYtMGJmYTI4MWI0YzYx",
	"title": "CCMN SY",
	"type": "group",
	"isLocked": false,
	"lastActivity": "2018-08-08T15:32:00.673Z",
	"creatorId": "Y2lzY29zcGFyazovL3VzL1BFT1BMRS82OWQxOTgyMi02MzhkLTQ1ODUtYjVmZS1lYmQ1Y2Y2NWMyMGQ",
	"created": "2018-08-08T15:32:00.673Z"
}
 
Цілі

Цей проект має на меті ознайомити вас з:

• Програмування мережі / мобільності / бездротової мережі

• Мислення продукту

• Створення корисної програми або програми

• Cisco RESTful API

Загальні інструкції

• Цей проект буде оцінюватися лише людьми

• Цей проект повинен використовувати REST API API Cisco Mobility Services Engine версії 10.3

• Програма / програма повинна виявити свій власний пристрій (мобільний телефон, комп'ютер, планшет), який можна підключити до мережі UNIT Factory WI-FI


Ви також можете зареєструватися на сайті Cisco DevNet developer.cisco.com і спробувати знайти корисну інформацію

V.1 Обов'язкова частина

Уявіть собі, що вам потрібно створити спеціальне програмне забезпечення для клієнтів, які використовують Cisco Mobility
Рішення для сервісів. Ваш клієнт хоче знати більше про клієнтів, наприклад, скільки їх повернуто, скільки часу вони витрачають в деяких зонах, підлогах або будівлях.
Ваш потенційний клієнт може бути власником конференц-залу, магазину одягу, бізнес-центру, торгового центру.

Ось що потрібно робити:

• Вертикально-орієнтоване додаток, програма або веб-сервіс під ключ

• Зручний інтерфейс

• Ваша програма або додаток повинні відображати та візуалізувати наступну інформацію:

  1. Скільки пристроїв підключено до Wi-Fi мережі;
  
  2. Поверх-карта з визначеним місцем пошуку за MAC-адресою WiFi і xlogin, якщо така є;
  
  3. Аналітика та присутність (сума підключеного відвідувача, кількість повторних відвідувачів за всіма можливими діапазонами, час затримки);
  
  4. Прогнозування кількості відвідувачів;
  
  5. Побудуйте співвідношення між тривалістю сеансу та днем тижня; кількість підключень і день тижня; і деякі інші співвідношення за вашим вибором;
  
  6. Перевантаження поверху
  
• Вам потрібно кодувати запити. Ви повинні обробляти помилки (до речі, потрібно постійно виконувати обробку помилок вашого коду) і написати в деяких файлах або таблицях

• Програма або додаток повинні працювати у всіх 3 кластерах і бути виявленими на кожному поверсі (зоні), який ви перебуваєте

• Відображати повідомлення, коли ви знаходите деякі пристрої. Ваша програма повинна адаптувати повідомлення залежно від того, де ви (підключені пристрої).

Наприклад: "Привіт, @ xlogin або mac: 00: 00: 2a: 01: 00: 06 зараз на першому поверсі".

Потрібні нові ідеї або ви хочете випробувати зовнішню мережу заводу UNIT? Відвідайте цей сайт https://cmxlocationsandbox.cisco.com/ (логін / пароль => learning / learning)
і цей https://ld5luw.cmxcisco.com/ (логін / пароль => learning@cisco.com / learning)

Бонус V.2
• Напишіть бот Spark, який тепер може вас зловити і відображати поточне місцезнаходження на карті поверху
Введіть ваш xlogin як ім'я користувача бота

У вас є якесь питання або знайдені деякі помилки, перейдіть на сторінку
https://web.ciscospark.com/, а потім введіть свій електронний лист тут
https://eurl.io/#BkOcM9LGf приєднатися до "Cisco Spark Edu Helper"


Configuration API (cisco-presence.unit.ua):

"siteId": 1513804707441,
"siteName": "UNIT",

Юзери в системі - /api/config/v1/aaa/users

Юзер по юзернейму - /api/config/v1/aaa/users/<username>

Допустимі ролі юзере - /api/config/v1/aaa/roles

Інформація про сайт  - /api/config/v1/sites/:id


Унікальні Юзери:

Кількість підключених юзерів по даті - /api/presence/v1/connected/count?siteId=<siteId>&date=<date>

Юзерів за сьогодні - /api/presence/v1/connected/count/today?siteId=1513804707441

Юзерів за вчорашній день - /api/presence/v1/connected/count/yesterday?siteId=1513804707441

Юзерів за 3 дня - /api/presence/v1/connected/count/3days?siteId=1513804707441

Юзерів за тиждень - /api/presence/v1/connected/count/lastweek?siteId=1513804707441

Юзерів за місяць - /api/presence/v1/connected/count/lastmonth?siteId=1513804707441

Сума юзерів за 3 дня - /api/presence/v1/connected/total/3days?siteId=1513804707441

Сума юзерів за тиждень - /api/presence/v1/connected/total/lastweek?siteId=1513804707441

Сума юзерів за 30 днів - /api/presence/v1/connected/total/lastmonth?siteId=1513804707441

Сума юзерів за період (формат часу yyyy-mm-dd) - /api/presence/v1/connected/total?siteId=1513804707441&startDate=<yyyy-mm-dd>&endDate=<yyyy-mm-dd>

Погодинна кількість Юзерів за сьогодні - /api/presence/v1/connected/hourly/today?siteId=1513804707441

Погодинна кількість Юзерів за вчора - /api/presence/v1/connected/hourly/yesterday?siteId=1513804707441

Погодинна кількість Юзерів за 3 дня - /api/presence/v1/connected/hourly/3days?siteId=1513804707441

Погодинна кількість юзерів за дату (yyyy-mm-dd) - /api/presence/v1/connected/hourly?siteId=1513804707441&date=<yyyy-mm-dd>

Поденна кількість юзерів на проміжку - /api/presence/v1/connected/daily?siteId=1513804707441&startDate=<yyyy-mm-dd>&endDate=<yyyy-mm-dd>

Поденна кількість юзерів за 7 днів - /api/presence/v1/connected/daily/lastweek?siteId=1513804707441

Поденна кількість юзерів за 30 днів - /api/presence/v1/connected/daily/lastmonth?siteId=1513804707441


Не унікальні :

Юзерів за сьогодні - /api/presence/v1/passerby/count/today?siteId=1513804707441

Юзерів за вчорашній день - /api/presence/v1/passerby/count/yesterday?siteId=1513804707441

Юзерів за 3 дня - /api/presence/v1/passerby/count/3days?siteId=1513804707441

Юзерів за тиждень - /api/presence/v1/passerby/count/lastweek?siteId=1513804707441

Юзерів за місяць - /api/presence/v1/passerby/count/lastmonth?siteId=1513804707441

Сума юзерів за 3 дня - /api/presence/v1/passerby/total/3days?siteId=1513804707441

Сума юзерів за тиждень - /api/presence/v1/passerby/total/lastweek?siteId=1513804707441

Сума юзерів за 30 днів - /api/presence/v1/passerby/total/lastmonth?siteId=1513804707441

Сума юзерів за період (формат часу yyyy-mm-dd) - /api/presence/v1/passerby/total?siteId=1513804707441&startDate=<yyyy-mm-dd>&endDate=<yyyy-mm-dd>

Погодинна кількість Юзерів за сьогодні - /api/presence/v1/passerby/hourly/today?siteId=1513804707441

Погодинна кількість Юзерів за вчора - /api/presence/v1/passerby/hourly/yesterday?siteId=1513804707441

Погодинна кількість Юзерів за 3 дня - /api/presence/v1/passerby/hourly/3days?siteId=1513804707441

Погодинна кількість юзерів за дату (yyyy-mm-dd) - /api/presence/v1/passerby/hourly?siteId=1513804707441&date=<yyyy-mm-dd>

Поденна кількість юзерів на проміжку - /api/presence/v1/passerby/daily?siteId=1513804707441&startDate=<yyyy-mm-dd>&endDate=<yyyy-mm-dd>

Поденна кількість юзерів за 7 днів - /api/presence/v1/passerby/daily/lastweek?siteId=1513804707441

Поденна кількість юзерів за 30 днів - /api/presence/v1/passerby/daily/lastmonth?siteId=1513804707441


КЛІЄНТИ

Список активних юзерів за остані 20 хвилин - /api/presence/v1/clients

Інформація про клієнта по мак адресу - /api/presence/v1/clients/<macaddress>

Цей API повертає підсумок (статистику) для даного сайту за вказаний діапазон дат або дату - /api/presence/v1/kpisummary?siteId=1513804707441&startDate=<yyyy-mm-dd>&endDate=<yyyy-mm-dd>
/api/presence/v1/kpisummary?siteId=1513804707441&date=<yyyy-mm-dd>