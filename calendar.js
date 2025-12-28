(function (erfindergeistCalendar, $, undefined) {
  const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  function getGermanDateString(date) {
    const event = new Date(date);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };

    return event.toLocaleDateString("de-DE", options);
  }

  // expose
  erfindergeistCalendar.getGermanDateString = getGermanDateString;

  function getGermanDateDayString(date) {
    const event = new Date(date);
    const options = {
      day: "2-digit",
    };

    return event.toLocaleDateString("de-DE", options);
  }

  erfindergeistCalendar.getGermanDateDayString = getGermanDateDayString;

  function getGermanTimeString(date) {
    const event = new Date(date);

    return event.toLocaleTimeString("de-De", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  erfindergeistCalendar.getGermanTimeString = getGermanTimeString;

  function getGermanWeekDayShortString(date) {
    const event = new Date(date);
    const options = {
      weekday: "short",
    };

    return event.toLocaleDateString("de-DE", options);
  }

  erfindergeistCalendar.getGermanWeekDayShortString = getGermanWeekDayShortString;

  function getData() {
    const url = location.hostname === "spielwiese-termine.erfindergeist.org" ? `spielwiese.erfindergeist.org` : location.hostname;
    $.getJSON(`https://${url}/wp-json/erfindergeist/v2/events`)
      .done(function (json) {
         render(json);
        
      })
      .fail(function (jqxhr, textStatus, error) {
        const err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
        renderError();
      });
  }

  function renderError(renderType) {
    const html = `
      <div class="wp-block-coblocks-column__inner has-no-padding has-no-margin">
         Error Loading data.
      </div>
   `;
    $(`#${renderType}`).html(html);
  }

  function render(data) {
    let calenderTemplate = "";

    const fallbackCalenderTemplate = `
      <div class="container p-0 text-dark">
      {{#each items}}
        <div class="row">
          <div class="col-1" style="font-size: 3rem">{{weekDayShort}}</div>
          <div class="col">{{summary}}, {{description}}, {{location}}{{startDate}}, {{startTime}}, 
           {{endDate}}, {{endTime}}, {{weekDayShort}}

            <div>
            {{#each tags as | tag |}}
              <span class="badge text-bg-primary">{{tag}}</span>
            {{/each}}
            </div>
          </div>
        </div>
      {{/each}}
      </div>
    `;

    try {
      calenderTemplate = document.getElementById("egj_calendar_template").innerHTML;
    } catch (e) {
      calenderTemplate = fallbackCalenderTemplate;
    }

    const template = Handlebars.compile(calenderTemplate);

    $("#egj_calendar_data").html(JSON.stringify(data, null, 2));

    $("#egj_calendar_container").html(template(data));



    jQuery("#egj_print_Button").click(function (event) {
      event.preventDefault();
      window.print();
    });

    jQuery("#egj_custom_template_area").on( "change", function(event) {
      event.preventDefault();
      const calenderTemplate = $("#egj_custom_template_area").val();
      const template = Handlebars.compile(calenderTemplate);
      $("#egj_calendar_container").html(template(data));
    });

  }

  erfindergeistCalendar.init = function () {
    if (document.getElementById("egj_calendar_container")) {
      getData();
    }

  };
})((window.erfindergeistCalendar = window.erfindergeistCalendar || {}), jQuery);

jQuery(document).ready(function () {
  jQuery("#egj_custom_template_area").val(document.getElementById("egj_calendar_template").innerHTML);

  Handlebars.registerHelper("include", function (arr, key) {
    if (arr && Array.isArray(arr)) {
      return arr.includes(key);
    }
    return false;
  });

  Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return arg1 === arg2
  });

  Handlebars.registerHelper('ifNotEquals', function(arg1, arg2, options) {
    return arg1 !== arg2
  });

  Handlebars.registerHelper("getTags", function (str) {
    if (str && typeof str === "string") {
      // find in str things like #tag1, #tag2
      const regex = /#([äüöÄÖÜßa-zA-Z0-9]+)/g;
      const tags = [];
      let match;
      while ((match = regex.exec(str)) !== null) {
        tags.push(match[1]);
      }
      return tags;
    }
    return [];
  });

  Handlebars.registerHelper("filter", function (arr, tags, key) {
    if (arr && Array.isArray(arr)) {
      return arr.filter((item) => tags.includes(key));
    }

    return arr;
  });

  Handlebars.registerHelper("isOdd", function (num) {
    return num % 2;
  });

  Handlebars.registerHelper("isEven", function (num) {
    return !(num % 2);
  });

  Handlebars.registerHelper("first", function (arr, num) {
    if(!arr || !Array.isArray(arr)) {
      console.warn("first helper called with invalid array. arr:", arr);
      return [];
    }
    return arr.slice(0, num);
  });

  Handlebars.registerHelper("today", function () {
    return erfindergeistCalendar.getGermanDateString(new Date())
  });

  Handlebars.registerHelper("getDateFromDt", function (str) {
    const year = str.substring(0, 4);
    const month = str.substring(4, 6);
    const day = str.substring(6, 8);
    return `${day}.${month}.${year}`;
  });

  Handlebars.registerHelper("getTimeFromDt", function (str) {
    const hour = str.substring(9, 11);
    const minute = str.substring(11, 13);
    return `${hour}:${minute}`;
  });   

  erfindergeistCalendar.init();
});

