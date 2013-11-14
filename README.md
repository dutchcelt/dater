# Dater is a datepicker

This is script in built on top of moment.js, a script to get and set dates. 

## USAGE:

### Requirements:
jQuery (tested with 2.0.4)
moment.js (tested with Version: 2.4.0)

### Markup:
`<input type="text" id='test' />`  
`<input type="text" placeholder="day-month-year" />`  
`<input type="text" value="29-03-2014" />`  

### Script:
`$(document).ready(function(){  
    $("input").dater();  
});`

### Options:
Alternative date formats  
`$("input").dater({format:"MM.DD.YYY"});`  
`$("input").dater({format:"YYYY.MM.DD"});`  
 
First day of the week is either Monday or Sunday  
`$("input").dater({firstDayIsMonday:false});`   
*Default is true*

Restict selection between Date ranges
`$("input").dater({startDate:"mm-dd-yyyy", endDate: "mm-dd-yyyy"});`
*Note: start and end date are also within the set date range*

Set or override the placeholder attribute  
`$("input").dater({placeholder:"day-month-year"});` 

Set the CSS z-index property  
`$("input").dater({zIndex:"42"});`


**Note**: This script (Dater) relies on [moment.js](http://momentjs.com/)