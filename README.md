# Dater is a datepicker

This is script in built on top of datejs, a commonly used script to get a handle on dates. 

## USAGE:

### Requirements:
jQuery (tested with 1.8)
date.js (tested with Version: 1.0 Alpha-1)

### Script:
`$(document).ready(function(){  
    $("input").dater();  
});`

### Markup:
`<input type="text" id='test' />`  
`<input type="text" placeholder="day-month-year" />`  
`<input type="text" value="29-03-2014" />`  

### Options:
Alternative date formats  
`$("input").dater({format:"MM.dd.yy"});`  
 
First day of the week is either Monday or Sunday  
`$("input").dater({firstDayIsMonday:false});`   
*Default is true*

Set or override the placeholder attribute  
`$("input").dater({placeholder:"day-month-year"});` 

Set the CSS z-index property  
`$("input").dater({zIndex:"42"});`


**Note**: This script (Dater) relies on date.js and therefore allows you to enter language based dates. Type in words like 'today' or 'tomorrow' or expressions like 'next week' and 'Dater' will use date.js to convert it to its numeric equivalent. 