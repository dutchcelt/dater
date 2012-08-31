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
            
                var $elem       = $(this),
                                  /* The base template for a single instance datepicker */
                    $template   = $('<div class="dater-widget" id="daterWidget'+index+'"><header><a class="dater-year-previous">&#9668;</a><span></span><a class="dater-year-next">&#9658;</a></header><aside></aside><section></section><footer><a class="dater-today">today</a></footer></div>'),
                    defaults    = { today: new Date.today(),
                                    thisDate: ($elem.val()==="") ? Date.today() : Date.parse($elem.val()),
                                    format: "dd-MM-yyyy",
                                    placeholder: "",
                                    startDateID: "",
                                    endDateID: ""
                                  },
                    options     = $.extend(defaults, settings);
                
                                  /* Return a date as a string */  
                var dateStr     = function(date,format){
                                    return date.toString(format);
                                  },
                                  /* Return the index of a date object. Set the format to either dd, MM or yyyy */
                    dateIndex   = function(date,format){
                                    return Number(date.toString(format))-1;
                                  },
                    setDate     = options.thisDate.clone(),
                                  /* Detach the datepicker from the DOM */
                    fadeOut     = function($widget){
                                    $widget = ($widget) ? $widget : $template;
                                    $widget.fadeOut('fast',function(){
                                        $(this).detach();
                                    });
                                    rendered = false;
                                    if($elem.val()!=="" &&  Date.parse($elem.val())!==null) {
                                        options.thisDate = Date.parse($elem.val());
                                        setDate = Date.parse($elem.val());
                                    }
                                  },
                    monthIndex  = Date.getMonthNumberFromName(options.thisDate.toString('MMMM')),
                    timer,
                    rendered    = false;
                    
                var updatePicker = function(elem,selector){
                    $elem.val(dateStr(options.thisDate,options.format));
                    elem.addClass('active');
                    highlightDate(options.thisDate);
                };
                
                var render = function($instance,f){
                
                    //  Clear all other datepickers, except this one
                    $(".dater-widget:not('#daterWidget"+index+"')").detach();
                    var calMonths   = "",
                        calDays     = "";
                    //  Create a list of the Abbriviated month names
                    for (n=0, l = Date.CultureInfo.abbreviatedMonthNames.length; n<l; n++) {
                        calMonths += '<a data-month="'+n+'">'+Date.CultureInfo.abbreviatedMonthNames[n]+'</a>';
                    }
                    //  Figure out what day it is
                    var getDay = function(day){
                        var date = (day < 10 ? '0' : '') + day + dateStr(options.thisDate,".MMM.yyyy");
                        var dayNum = Date.getDayNumberFromName(Date.parse(date).toString("ddd"));
                        return dayNum;
                    };
                    //  Create a list of days of the week starting with Monday
                    for (n = 0, l = Date.CultureInfo.firstLetterDayNames.length; n < l; n++) {
                        calDays += '<span>'+Date.CultureInfo.firstLetterDayNames[((n===6)?0:n+1)]+'</span>';
                    }
                    //  Create all the days of the month
                    for (x=0,l=Date.getDaysInMonth(dateIndex(options.thisDate,'yyyy')+1,dateIndex(options.thisDate,'MM')); x<l; x++) {
                        calDays += '<a data-day="'+getDay(x+1)+'">'+(x+1)+'</a>';
                    }
                    //  Add the Year to the template
                    $('header span',$template).html(dateStr(options.thisDate,"yyyy"));
                    //  Add all the calendar days to the template
                    $('section',$instance).html(calDays);
                    //  Add the Months to the template
                    $('aside',$instance).html(calMonths);
                    //  Add the template to the the body
                    $('body').append($instance);
                    //  Hide the template
                    if(!rendered){ $instance.hide(); }
                    //  Set the first day of the month (using CSS to set its position)
                    $('section a:first').addClass('first');
                    highlightDate(options.thisDate);
                    setPos($instance);
                    //  Callback
                    if (typeof f === "function") { f(); }
                };
                
                var highlightDate = function(date){
                    $('[data-day],[data-month]',$template).removeClass('active');
                    if(dateStr(date,"MM.yyyy") === dateStr(setDate,"MM.yyyy")) {
                        $('[data-day]',$template).eq(dateIndex(date,"dd")).addClass('active');
                    }
                    $('[data-month]',$template).eq(dateIndex(date,"MM")).addClass('active');
                    $('header span',$template).html(dateStr(options.thisDate,"yyyy"));
                    clearTimeout(timer); // Prevent the datepicker from detaching
                    };
                var setPos = function($instance){
                    var offset = $elem.offset();
                    var bottom = ($instance.outerHeight()+(offset.top + $elem.outerHeight()) > $('body').outerHeight() );
                    $instance.css({position: 'absolute', zIndex: '4242', top: offset.top + $elem.outerHeight(), left: offset.left });
                };
                if (typeof $elem.attr("placeholder") !== 'string'){
                    $elem.attr("placeholder",((options.placeholder==="") ? options.format.toLowerCase() : options.placeholder) );
                }
                
                //  EVENTS
                //  User clicks 'Today' and is done
                $template.on('click','.dater-today',function(e){
                    $elem.val(dateStr(options.today,options.format));
                    highlightDate(options.today);
                    fadeOut($(e.delegateTarget));
                });
                //  User clicks on a day and is done
                $template.on('click','[data-day]',function(e){
                    options.thisDate.set({day:Number($(this).text())});
                    updatePicker($(this));
                    fadeOut($(e.delegateTarget));
                });
                //  User clicks on a month and can continue
                $template.on('click','[data-month]',function(e){
                    options.thisDate.set({month:Date.getMonthNumberFromName($(this).text())});
                    render($template);
                    $elem.focus();
                });
                //  User sets year and can continue 
                $template.on('click','header a',function(e){
                    if($(this).is('.dater-year-next')){
                        options.thisDate.addYears(1);
                    } else {
                        options.thisDate.addYears(-1);
                    }
                    $('header span',$template).html(dateStr(options.thisDate,"yyyy"));
                    render($template);
                    $elem.focus();
                });
                //  Pointer device (re)enters the datepicker: Prevent detaching the datepicker
                $template.on('mouseover',function(e){
                    clearTimeout(timer);
                });
                //  Input element is focus, show the datepicker
                $elem.on('focus.dater',function(e){
                    if(Date.parse($(this).val())===null){
                        $(this).val("");
                        options.thisDate = Date.today();
                    }
                    if($(this).val()==="" || Date.parse($(this).val())!==null){
                        $(this).trigger('render.dater');
                        clearTimeout(timer);
                    }
                });
                //  Render the detepicker
                $elem.on('render.dater',function(e){
                    if($("#daterWidget"+index).is(":visible")===false){
                        render($template, function(){
                            $template.fadeIn('fast');
                            rendered = true;
                        });
                    }
                });
                //  Set the input value
                $elem.on('change',function(e){  
                    options.thisDate = Date.parse($(this).val());
                });
                //  Hide the datepicker
                $elem.on('blur',function(e){
                    timer=setTimeout(fadeOut, 200);
                });
                
            });
        };
        
    }));