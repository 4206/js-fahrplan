$(document).ready(function() {
   $('#datum').val(new Date().toISOString());


   $("#sucheBahnhof").click(function(event) {
      var x = document.getElementById("station").value;
      var url = "https://api.deutschebahn.com/freeplan/v1/location/" + x;
      $.ajax({
         url: url,
         dataType: 'json',
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
            alert("Error" + result);
         }
      });
   });

   $('#station-list').change(function() {
     var id = $('#station-list').val();
     var dt = $('#datum').val();
     //var dt = new Date().toISOString();
     //var url = "https://api.deutschebahn.com/freeplan/v1/arrivalBoard/" + id + "?date=2019-05-19T16%3A30";
     var url = "https://api.deutschebahn.com/freeplan/v1/arrivalBoard/" + id + "?date=" + dt;
     console.log("select value: " + url);
      $.ajax({
         url: url,
         dataType: 'json',
         success: function(data) {
            $('#stage').html('<table style="width:100%">');
            $('#stage').append('<tr><th>Name</th><th>Typ</><th>Bahnsteig</th><th>Uhrzeit</th><th>Von</th></tr>');
            $.each(data, function(i, item) {
               $('#stage').append('<tr>'); 
               $('#stage').append('<td>' + data[i].name + '</td>');
               $('#stage').append('<td>' + data[i].type + '</td>');
               $('#stage').append('<td>' + data[i].track + '</td>');
               $('#stage').append('<td>' + data[i].dateTime + '</td>');
               $('#stage').append('<td>' + data[i].origin + '</td>');
               $('#stage').append('</tr>');
            });
            $('#stage').append('</table>');
         },
         error: function(result) {
            alert("Error" + result);
         }
      });
   });
});
