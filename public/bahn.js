$(document).ready(function() {
   // fill in date on page load
   $('#datum').val(new Date().toISOString());


   $("#sucheBahnhof").click(function(event) {
      var x = document.getElementById("station").value;
      var url = "https://api.deutschebahn.com/fahrplan-plus/v1/location/" + x;
      $.ajax({
         url: url,
         dataType: 'json',
         beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer 7210b3de5c12050b530d5cf53ec11398');
         },
         success: function(data) {
            let dropdown = $('#station-list');
            dropdown.empty();
            dropdown.append('<option selected="true" disabled>Auswahl Bahnhof</option>');
            dropdown.prop('selectedIndex', 0);

            $.each(data, function(i, item) {
               dropdown.append($('<option></option>').attr('value', data[i].id).text(data[i].name));
            });
         },
         error: function(result) {
            console.error(result);
            alert("Error: " + result.statusText)
         }
      });
   });

   $('#station-list').change(function() {
     var id = $('#station-list').val();
     var dt = $('#datum').val();
     //var dt = new Date().toISOString();
     //var url = "https://api.deutschebahn.com/freeplan/v1/arrivalBoard/" + id + "?date=2019-05-19T16%3A30";
     var url = "https://api.deutschebahn.com/fahrplan-plus/v1/arrivalBoard/" + id + "?date=" + dt;
     console.log("select value: " + url);
      $.ajax({
         url: url,
         dataType: 'json',
         beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer 7210b3de5c12050b530d5cf53ec11398');
         },
         success: function(data) {
            var thead = '<thead><tr><th>Name</th><th>Typ</><th>Bahnsteig</th><th>Uhrzeit</th><th>Von</th></tr></thead>';
            var tbody = '<tbody>'
            $.each(data, function(i, item) {
               tbody += '<tr>';
               tbody += '<td>' + data[i].name + '</td>';
               tbody += '<td>' + data[i].type + '</td>';
               tbody += '<td>' + data[i].track + '</td>';
               tbody += '<td>' + data[i].dateTime + '</td>';
               tbody += '<td>' + data[i].origin + '</td>';
               /*tbody += '<td><a href="#details-output" details="' + data[i].detailsId + '" class="details">Details</a></td>';*/
               tbody += '</tr>';
            });
            $('#stage').empty().append('<table>'+thead+tbody+'</table>');

            $('.details').click(click_details); // register to dynamically added items
         },
         error: function(result) {
            console.error(result);
            alert("Error: " + result.statusText);
         }
      });
   });

   var click_details = function(event)
   {
      var details = event.currentTarget.attributes.details.nodeValue;
      console.log(details);
      detailsId = details; // cut off '#details='
      var url = "https://api.deutschebahn.com/freeplan/v1/journeyDetails/" + detailsId;
      console.log("show details: " + url);
      //$('#details-output')
   }
});
