
var d = 0;

function sodukuBox(value)
{
    var bx = document.createElement("div");
    bx.value = null;
    bx.possibility = [];
    for (var c = 1; c <= 9; c++)
    {
         bx.possibility[c] = document.createElement('td');
         bx.possibility[c].possible = true;
         bx.possibility[c].appendChild(document.createTextNode(c));
    }

    if (value)
    {
        bx.appendChild(document.createTextNode(value));
        bx.value = value;
    }
    else
    {
        tbl = document.createElement('table');
        var ntbdy = document.createElement('tbody');
        tbl.className += 'box';
        for (var k = 0; k < 3; k++) 
        {
            var ntr = document.createElement('tr');
            for (var l = 0; l < 3; l++) 
            {
                var c = 1 + (3*k) + l;
                ntr.appendChild(bx.possibility[c]);
            }
            ntbdy.appendChild(ntr);
        }
        tbl.appendChild(ntbdy);
        bx.appendChild(tbl);
    }

    bx.refresh = function ()
    {
       for (var c = 1; c <= 9; c++)
       {
          this.possibility[c].className = this.possibility[c].possible ? 'isposs' : 'notposs' ;
       }
    }

    return bx;
}



function createSodukuTable()
{
    var p = 0;
    var allBoxes = [];

    /* References to box square, row and columns */
    var squares = [];  
    var rows = []; 
    var columns = []; 

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
                    var x = (i * 3) + m;
                    var y = (j * 3) + n;
                    allBoxes[p] = sodukuBox(puzzle[x][y]);
                    /* Add to the indicies */
                    if (!squares[(3*i)+j])
                    {
                       squares[(3*i)+j] = [];
                    }
                    squares[(3*i)+j].push(allBoxes[p]);

                    ntd.appendChild(allBoxes[p]);
                    ntr.appendChild(ntd);
                    p++;
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

    /* Apply Rules */
    for (var si = 0; si < squares.length; si++)
    {
       var vals = [true,true,true,true,true,true,true,true,true];
       /* Work out the known values for each and remove from all */
       for (var bi=0;bi<9;bi++)
       {
          if (squares[si][bi].value)
          {
              var v = squares[si][bi].value;
              for (var ui=0; ui < 9; ui++)
              {
                 squares[si][ui].possibility[v].possible = false;
              }
          }
       }
       /* Now eliminate that value from all boxes in the sqaure */
    }
    

    /* Refresh display state of all boxes */
    for (p = 0; p < allBoxes.length; p++)
    {
        allBoxes[p].refresh();
    }

}





