/*! ###########################################################################
    
    Source:     https://github.com/dutchcelt/dater
    Version:    1.0
    
    Copyright (C) 2011 - 2012,  Lunatech Labs B.V., C. Egor Kloos. All rights reserved.
    GNU General Public License, version 3 (GPL-3.0)
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.opensource.org/licenses/gpl-3.0.html
    
    
    *   USAGE:
    *   
    *   Requirements:
    *   jQuery (tested with 1.8)
    *   date.js (tested with Version: 1.0 Alpha-1)
    *   
    *   Script:
    *   $(document).ready(function(){
    *     $("input").dater();
    *   });
    *   
    *   Markup:
    *   <input type="text" id='test' />
    *   <input type="text" placeholder="day-month-year" />
    *   <input type="text" value="29-03-2014" />
    *   
    *   Options:
    *   $("input").dater({format:"MM.dd.yy"}); // alternative date formats
    *   $("input").dater({placeholder:"day-month-year"}); // set or override the placeholder attribute
    *   $("input").dater({zIndex:"42"}); // set the CSS z-index property
    *   
    *   
    
    ########################################################################### */


    (function (factory) {
    
        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module.
            define(['jquery'], factory);
        } else {
            // Browser globals
            factory(jQuery);
        }
        
    }(function ($) {
    
        $.fn.dater = function(settings) {
            
            return this.each(function(index,domElem) {

                //  VARIABLES
                
                var $elem       = $(this),
                                  /* The base template for a single instance datepicker */
                    $template   = $('<div class="dater-widget" id="daterWidget'+index+'"><header><a class="dater-year-previous">&#9668;</a><span></span><a class="dater-year-next">&#9658;</a></header><aside></aside><section></section><footer><a class="dater-today">today</a></footer></div>'),
                    defaults    = { format: "dd-MM-yyyy",
                                    placeholder: "",
                                    startDateID: "",
                                    endDateID: "",
                                    zIndex: "424242"
                                  },
                    options     = $.extend(defaults, settings),
                    $val        = (Date.parse($elem.val())===null) ? Date.today().toString(options.format) : Date.parse($elem.val()).toString(options.format),
                    $date       = Date.parseExact($val,options.format),
                    $data       = $.data($elem,'dater',{day: $date.getDate(),month: $date.getMonth(), year: $date.getFullYear()}),
                    checkDate   = $date.toString(options.format),
                    timer,
                    rendered    = false;


                    
                //  FUNCTIONS
                                  /* Return a date as a string */  
                var setData     = function(date,f){
                                    $data.day   = date.getDate();
                                    $data.month = date.getMonth();
                                    $data.year  = date.getFullYear();
                                    if (typeof f === "function") { f(); }
                                  },
                    updateVal   = function(today){
                                    var date = new Date($data.year,$data.month,$data.day);
                                    return (today==="today") ? Date.today().toString(options.format) : date.toString(options.format);
                                  },
                    fadeOut     = function(){
                                    $template.fadeOut('fast',function(){
                                        $(this).detach();
                                    });
                                    rendered = false;
                                    if($val!=="" &&  Date.parseExact($val,options.format)!==null) {
                                        checkDate = $val;
                                    }
                                  },
                    render      = function($instance,f){
                                    
                                    //var renderDate = new Date.parseExact($val,options.format);
                                    
                                    //  Clear all other datepickers, except this one
                                    $(".dater-widget:not('#daterWidget"+index+"')").detach();
                                    var calMonths   = "",
                                        calDays     = "",
                                        calDates    = "",
                                        daysLength  = Date.getDaysInMonth($data.year,$data.month);
                                        
                                    //  Create a list of the Abbriviated month names
                                    for (n=0, l = Date.CultureInfo.abbreviatedMonthNames.length; n<l; n++) {
                                        calMonths += '<a data-month="'+n+'">'+Date.CultureInfo.abbreviatedMonthNames[n]+'</a>';
                                    }
                                    //  Figure out what day it is
                                    var getDayIndex = function(d){
                                        var date = new Date();
                                        var dayOfTheMonth = date.set({day: d, month: $data.month, year: $data.year });
                                        return Date.getDayNumberFromName(dayOfTheMonth.toString('ddd'));
                                    };
                                    //  Create a list of days of the week starting with Monday
                                    for (n = 0, l = Date.CultureInfo.firstLetterDayNames.length; n < l; n++) {
                                        calDays += '<span>'+Date.CultureInfo.firstLetterDayNames[((n===6)?0:n+1)]+'</span>';
                                    }


                                    var firstWeekOffset,remainderOfLastMonth="",lastWeekOffset,startOfNextMonth="";

                                    //  Create all the days of the month
                                    for (x=0,l=daysLength; x<l; x++) {
                                        if (x===0) {
                                            firstWeekOffset = getDayIndex(x-1);
                                        }
                                        calDates += '<a data-day="'+getDayIndex(x+1)+'">'+(x+1)+'</a>';
                                    }
                                    var newdate = new Date($data.year,$data.month,$data.day);
                                    newdate.add({month: -1});

                                    var days = newdate.getDaysInMonth();
                                    var offset = newdate.getDaysInMonth() - firstWeekOffset ;
                                    
                                    for (x=offset,l=days; x<l; x++) {
                                        remainderOfLastMonth += '<i class="offset">'+(x+1)+'</i>';
                                    }
                                    for (x=0,l=((Math.ceil((daysLength + firstWeekOffset) /7))*7)-(daysLength + firstWeekOffset); x<l; x++) {
                                        startOfNextMonth += '<i class="offset">'+(x+1)+'</i>';
                                    }
                                    calDates = remainderOfLastMonth + calDates + startOfNextMonth;


                                    //  Add the Year to the template
                                    $('header span',$instance).html($data.year);
                                    //  Add all the calendar days to the template
                                    $('section',$instance).html(calDays + calDates);
                                    //  Add the Months to the template
                                    $('aside',$instance).html(calMonths);
                                    //  Add the template to the the body
                                    $('body').append($instance);
                                    //  Hide the template
                                    if(!rendered){ 
                                        $instance.hide(); 
                                        setPos($instance);
                                    }

                                    
                                    show();
                                    setPos($instance);
                                    //  Callback
                                    if (typeof f === "function") { f(); }
                                  },
                    update      = function(elem){
                                    $elem.val($val);
                                    if (elem) { elem.addClass('active'); }
                                    show();
                                  },
                    show        = function(){
                                    $('[data-day],[data-month]',$template).removeClass('active');
                                    var d = Date.parseExact(checkDate,options.format);
                                    if(d.getFullYear() === $data.year && d.getMonth() === $data.month) {
                                        $('section a',$template).eq(parseInt($data.day,10)-1).addClass('active');
                                    }
                                    $('[data-month]',$template).eq($data.month).addClass('active');
                                    clearTimeout(timer); // Prevent the datepicker from detaching
                                  },
                    setPos      = function($instance){
                                    var offset = $elem.offset();
                                    var bottom = ($instance.outerHeight()+(offset.top + $elem.outerHeight()) > $('body').outerHeight() );
                                    $instance.css({position: 'absolute', zIndex: options.zIndex, top: offset.top + $elem.outerHeight(), left: offset.left });
                                  };
                                  

                // Manipulate DOM loaded elements.                  
                if (typeof $elem.attr("placeholder") !== 'string'){
                    $elem.attr("placeholder",((options.placeholder==="") ? options.format.toLowerCase() : options.placeholder) );
                }
                
                //  if by any chance a preset date is not in a numerical format then convert it.
                if($elem.val()!==""){
                    $elem.val(Date.parse($val).toString(options.format));
                }


                //  EVENTS

                //  User clicks 'Today' and is done
                $template.on('click','.dater-today',function(e){
                    $val = updateVal('today'); 
                    $elem.val($val);
                    show();
                    fadeOut();
                });
                //  User clicks on a day and is done
                $template.on('click','[data-day]',function(e){
                    $data.day = parseInt($(e.target).html(),10);
                    $val = updateVal();
                    update($(e.target));
                    fadeOut();
                });
                //  User clicks on a month and can continue
                $template.on('click','[data-month]',function(e){
                    $data.month = $(this).data('month');
                    render($template);
                    $elem.focus();
                });
                //  User sets year and can continue 
                $template.on('click','header a',function(e){
                    if($(this).is('.dater-year-next')){
                        $data.year = $data.year + 1;
                    } else {
                        $data.year = $data.year - 1;
                    }
                    $('header span',$template).html($data.year);
                    render($template);
                    $elem.focus();
                });
                //  Pointer device (re)enters the datepicker: Prevent detaching the datepicker
                $template.on('mouseover click',function(e){
                    $elem.trigger('focus.dater');
                });
                //  Input element is focus, show the datepicker
                $elem.on('focus.dater',function(e){

                    //$val = $(this).val();
                    if(e.namespace!=="dater") { 
                        var date = (Date.parseExact($val,options.format)) ? Date.parseExact($val,options.format) : Date.today();
                        if(date===null && !rendered){
                            //date = Date.today();
                        }
                        if(($val==="" || date!==null)){
                            $(this).trigger('render.dater');
                        }
                    }
                    clearTimeout(timer);
                });
                //  Render the detepicker
                $elem.on('render.dater',function(e){
                    if($("#daterWidget"+index).is(":visible")===false){
                        render($template, function(){
                            if($val===""){
                                $val = Date.today().toString(options.format);
                            }
                            $val = updateVal();                            
                            $template.fadeIn('fast');
                            rendered = true;
                        });
                    }
                });
                //  Set the input value
                $elem.on('change',function(e){  
                    var val = $(this).val();
                    var date = Date.parse(val);
                    if(date===null){
                        $(this).val("");
                        date = Date.today();
                        setData(date);
                    }
                    if(date!==null){
                        setData(date, function(){
                            var newdate = new Date().set($data);
                            $elem.val(newdate.toString(options.format));
                            $elem.trigger('blur');
                            update();
                        });
                    }
                });
                //  Hide the datepicker
                $elem.on('blur',function(e){
                    timer=setTimeout(fadeOut, 200);
                });
                
            });
        };
        
    }));
