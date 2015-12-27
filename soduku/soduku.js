
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
       this.num_possibilies = 0;
       var pos = null;
       for (var c = 1; c <= 9; c++)
       {
          if (this.possibility[c].possible)
          { 
              this.possibility[c].className = 'isposs';
              this.num_possibilies++;
              pos = c; /* Store value so that can be assigned if we find the number of possibilites to be zero */
          }
          else
          {
              this.possibility[c].className = 'notposs' ;
          }
       }
       if (this.num_possibilies == 1)
       {
          this.value = pos;
          this.possibility[pos].className = 'onlyposs' ;
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

                    if (!rows[x])
                    {
                       rows[x] = [];
                    }
                    rows[x].push(allBoxes[p]);

                    if (!columns[y])
                    {
                       columns[y] = [];
                    }
                    columns[y].push(allBoxes[p]);

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
    for (var loop=0; loop <8; loop++)
    {
        filter_by_defined_in_set(squares);
        filter_by_defined_in_set(rows);
        filter_by_defined_in_set(columns);

        /* Refresh display state of all boxes */
        for (p = 0; p < allBoxes.length; p++)
        {
           allBoxes[p].refresh();
        }
    }
}


function filter_by_defined_in_set(boxSet)
{
    for (var si = 0; si < boxSet.length; si++)
    {
       /* Work out the known values for each and remove from all */
       for (var bi=0;bi<9;bi++)
       {
          if (boxSet[si][bi].value)
          {
              var v = boxSet[si][bi].value;
              for (var ui=0; ui < 9; ui++)
              {
                 if (ui != bi)
                 {
                     boxSet[si][ui].possibility[v].possible = false;
                 }
              }
          }
       }
       /* Now eliminate that value from all boxes in the sqaure */
    }
} 



