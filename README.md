#lastonline
Create a spreadsheet of your guild roster, ordered by last online date, given in a more human readable and accurate format than available in game. Requires [tera-proxy](https://github.com/meishuu/tera-proxy) and [slash](https://github.com/baldera-mods/slash).

##Features
- Output guild roster as .csv format sorted by last seen date
- Last online format is localized to your time zone
- Accurate to the second

##Usage
Type the following in chat in game:
```
`glist
```
. If successful, you will see a message indicating where the guild roster was saved. Open this file with your favorite spreadsheet editor.

If you wish to change the date format for a more or less specific format, modify the following line in the `save()` function:
```
last = last.toLocaleDateString();
```. Documentation of useful format strings is available [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString).
