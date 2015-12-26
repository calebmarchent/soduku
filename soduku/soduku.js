
function sodukuBox()
{
   var ntbl = document.createElement('table');
   var ntbdy = document.createElement('tbody');
   ntbl.className += 'box';
   var c = 1;
   for (var k = 0; k < 3; k++) {
       var ntr = document.createElement('tr');
       for (var l = 0; l < 3; l++) {
           var ntd = document.createElement('td');
           ntd.appendChild(document.createTextNode(c++));
           ntr.appendChild(ntd);
       }
       ntbdy.appendChild(ntr);
   }
   ntbl.appendChild(ntbdy);
   return ntbl;
}



function createSodukuTable()
{
    var body = document.getElementsByTagName('body')[0];
    var tbl = document.createElement('table');
    var tbdy = document.createElement('tbody');
    for (var i = 0; i < 3; i++)
    {
        var tr = document.createElement('tr');
        for (var j = 0; j < 3; j++) 
        {
            var td = document.createElement('td');
             var ntbl = document.createElement('table');
             var ntbdy = document.createElement('tbody');
             ntbl.className += 'square';
             for (var m = 0; m < 3; m++)
              {
                 var ntr = document.createElement('tr');
                 for (var n = 0; n < 3; n++)
                 {
                    var ntd = document.createElement('td');
                    var sb = sodukuBox();
                    ntd.appendChild(sb);
                    ntr.appendChild(ntd);
                 }
                 ntbdy.appendChild(ntr);
            }
            ntbl.appendChild(ntbdy);
            td.appendChild(ntbl);
            tr.appendChild(td);
        }
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
}





