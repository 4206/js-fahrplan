$(document).ready(function() {
   // fill in date on page load
   $('#datum').val(new Date().toISOString());

   var michas_data;

   $("#sucheBahnhof").click(function(event) {
      var x = document.getElementById("station").value;
      //var url = "https://api.deutschebahn.com/fahrplan-plus/v1/location/" + x;
      var url = "http://localhost:9003/dblocation/" + x + "?date=2019-05-24";
      console.log(url);
      $.ajax({
         url: url,
         dataType: 'json',
         crossOrigin: true, /* get CORS Everywhere */
         /*beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer 7210b3de5c12050b530d5cf53ec11398');
         },*/
         success: function(data) {
            console.log(data);
            let dropdown = $('#station-list');
            dropdown.empty();
            dropdown.append('<option selected="true" disabled>Auswahl Bahnhof</option>');
            dropdown.prop('selectedIndex', 0);

            $('#stage').empty();
            michas_data = data;
            $.each(data, function(i, item) {
               dropdown.append($('<option></option>').attr('value', data[i].id).text(data[i].name));
               /* call for MichaH */
               /*build_arrival_board(item.arrivalBoards);*/
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

     console.log("id="+id);
     for (row_i in michas_data)
     {
      if (michas_data[row_i].id == id)
      {
         $('#stage').empty();
         build_arrival_board(michas_data[row_i].arrivalBoards); 
      }
     }     
     /*
     var url = "https://api.deutschebahn.com/fahrplan-plus/v1/arrivalBoard/" + id + "?date=" + dt;
     console.log("select value: " + url);
      $.ajax({
         url: url,
         dataType: 'json',
         beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer 7210b3de5c12050b530d5cf53ec11398');
         },
         success: function(data) {
            $('#stage').empty();
            build_arrival_board(data); 
         } ,
         error: function(result) {
            console.error(result);
            alert("Error: " + result.statusText);
         }
      });*/
   });

   var build_arrival_board = function(data) {
      var thead = '<thead><tr><th>Name</th><th>Typ</><th>Bahnsteig</th><th>Uhrzeit</th><th>Von</th><th>Details</th></tr></thead>';
      var tbody = '<tbody>'
      $.each(data, function(i, item) {
         tbody += '<tr>';
         tbody += '<td>' + data[i].name + '</td>';
         tbody += '<td>' + data[i].type + '</td>';
         tbody += '<td>' + data[i].track + '</td>';
         tbody += '<td>' + data[i].dateTime + '</td>';
         tbody += '<td>' + data[i].origin + '</td>';
         tbody += '<td><a href="#details-output" details="' + encodeURI(data[i].detailsId) + '" class="details">Details</a></td>';
         tbody += '</tr>';
      });
      /*$('#stage').empty(); */
      $('#stage').append('<table>'+thead+tbody+'</table>');

      $('.details').click(click_details); // register to dynamically added items
   };

   var click_details = function(event)
   {
      var details = event.currentTarget.attributes.details.nodeValue;
      console.log(details);
      detailsId = details; // cut off '#details='
      var url = "https://api.deutschebahn.com/freeplan/v1/journeyDetails/" + detailsId;
      console.log("show details: " + url);
      $.ajax({
         url: url,
         dataType: 'json',
         beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer 7210b3de5c12050b530d5cf53ec11398');
         },
         success: function(data) {
            //console.log(data);
            var thead = '<thead><tr><th>Abfahrtszeit</th><th>Bahnhof</><th>Operator</th><th>Zugnummer</th><th>Zugtyp</th></tr></thead>';
            var tbody = '<tbody>'
            $.each(data, function(i, item) {
               tbody += '<tr>';
               tbody += '<td>' + data[i].depTime + '</td>';
               tbody += '<td>' + data[i].stopName + '</td>';
               tbody += '<td>' + data[i].operator + '</td>';
               tbody += '<td>' + data[i].train + '</td>';
               tbody += '<td>' + data[i].type + '</td>';
               tbody += '</tr>';
            });
            $('#details-output').empty().append('<table>'+thead+tbody+'</table>');

            
         },
         error: function(result) {
            console.error(result);
            alert("Error: " + result.statusText);
         }
      });
      
   }
});
