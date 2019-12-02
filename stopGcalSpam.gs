//Based on Google's quick start guid:
//https://developers.google.com/calendar/quickstart/apps-script
//And a function by (@Anton Dementiev) from StackOverflow:
//https://stackoverflow.com/questions/49794213/how-to-delete-an-event-with-google-apps-script-and-sending-an-email/49795562#49795562

function listUpcomingEvents() {
  var calendarId = 'primary';
  var optionalArgs = {
    timeMin: (new Date()).toISOString(),
    showDeleted: false,
    singleEvents: true,
    maxResults: 1000,
    orderBy: 'startTime'
  };
  var badStrings = ["ВАМ ДОСТУПЕН ДЕНЕЖНЫЙ ПЕРЕВОД","ДЕНЕЖНЫЙ","НАЧИСЛЕНИЕ","СРЕДСТВ"];
  var response = Calendar.Events.list(calendarId, optionalArgs);
  var events = response.items;
  if (events.length > 0) {
    for (i = 0; i < events.length ; i++) {
    
    var event = events[i];
    
          for (badString in badStrings) {
            if(event.summary.indexOf(badStrings[badString]) > 0 ) {
              //Delete the event
              deleteEvent(event.id);  
            }
          }
      var when = event.start.dateTime;
      if (!when) {
        when = event.start.date;
      }
    }
  } else {
    Logger.log('No upcoming events found.');
  }
}

 function deleteEvent(eventId) {

 var baseUrl = "https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/{eventId}?sendNotifications=false";
 var calendarId = CalendarApp.getDefaultCalendar().getId();

 var url = baseUrl.replace("{calendarId}", calendarId).replace("{eventId}", eventId);
  var options = {

    "method": "DELETE",
    "headers": {"Authorization":"Bearer " + ScriptApp.getOAuthToken()},
    "muteHttpExceptions": true
  };
  var res = UrlFetchApp.fetch(url, options).getContentText();  
  Logger.log(res);    
}
