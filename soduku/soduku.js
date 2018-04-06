
var change_occured = false;

function sodukuBox(value)
{
    var bx = document.createElement("td");
    bx.height = 61;
    bx.width  = 60;
    bx.value = null;
    bx.possibility = [];
    bx.poss_bitmap = 0x1FF;
    bx.num_possibilies = 9;

    for (var c = 1; c <= 9; c++)
    {
         bx.possibility[c] = document.createElement('td');
         bx.possibility[c].possible = true;
         bx.possibility[c].className = 'isposs';
         bx.possibility[c].appendChild(document.createTextNode(c));
    }

    /* Create presentation of confirmed value */

    /* Create presentation of possibility table */
    bx.poss_tbl = document.createElement('table');
    var ntbdy = document.createElement('tbody');
    bx.className += 'box';
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
    bx.poss_tbl.appendChild(ntbdy);

    bx.eliminatePossibility = function (value, activeruleclass)
    {
        /* If the posibility was possible, we are going to clear it so enure the change is marked to trigger another itteration */
        if (this.possibility[value].possible)
        {
            change_occured = true;
            this.possibility[value].possible = false;
            this.poss_bitmap &= ~(0x1 << (value - 1));
            this.possibility[value].className = 'notposs';

            /* If we are down the the last possibility, confirm that as the cell value */
            if (--this.num_possibilies == 1)
            {
               for (var p=1; !this.possibility[p].possible; p++) {};
               this.setValue(p,  activeruleclass);
            }
        }
    }

    bx.setValue = function (newvalue, activeruleclass)
    {
       if (this.value != newvalue)
       {
           change_occured = true;
           this.className = activeruleclass;
       }
       this.value = newvalue;
       /* Update the possibiliy flags to keep them in-sync */
       for (var pos=1; pos <= 9; pos++)
       {
           this.possibility[pos].possible = (this.value == pos);
       }
       bx.poss_bitmap = 0x01 << (newvalue - 1);
       this.num_possibilies = 1;
       this.present_value = this.replaceChild(document.createTextNode(this.value), this.childNodes[0]);
    }

    if (value)
    {
        bx.appendChild(document.createTextNode(bx.value ? bx.value : ''));
        bx.setValue(value, 'predefined');
    }
    else
    {
        bx.appendChild(bx.poss_tbl);
    }


    return bx;
}

/******************** Rules ***************************************************/
/* 1. If number the only number possible for any cell in the group, remove it */
/*    from the possibilites for all other cells                               */
/* 2. If any number only possible in one cell in the group, then it is the    */
/*    value of that cell                                                      */
/******************************************************************************/
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
                 if (ui != bi && boxSet[si][ui].possibility[v].possible)
                 {
                     boxSet[si][ui].eliminatePossibility(v, 'rule1');
                 }
              }
          }
       }

       /* PASS 2: Count the occurances of each number in all possibilites */
       var occurance_count = [];
       var occurance_loc = [];
       for (var bi=0;bi<9;bi++)
       {
            for (var v=1; v <= 9; v++)
            {
                if (boxSet[si][bi].possibility[v].possible)
                {
                    occurance_count[v] = occurance_count[v] ? occurance_count[v]+1 : 1;
                    occurance_loc[v] = boxSet[si][bi];
                }
            }
       }
       for (var v=1; v <= 9; v++)
       {
            if (occurance_count[v] == 1)
            {
                occurance_loc[v].setValue(v, 'rule2');
            }
       }
       /* Now eliminate that value from all boxes in the sqaure */

       /* Look for N boxes with N number of possibilites that are the same */
       /* RULE 3: */

       var sorted_boxes = boxSet[si].sort( function (a,b) {
           return b.poss_bitmap - a.poss_bitmap
       });
       for (n = 1; n < 9; n++)
       {
           if (sorted_boxes[n-1].poss_bitmap ==
               sorted_boxes[n].poss_bitmap)
           {
               if (sorted_boxes[n].num_possibilies == 2)
               {
                   /* Now need to find the possibility numbers for sorted_boxes[n] */
                   for (var v=1; v <=9; v++)
                   {
                      if (sorted_boxes[n].possibility[v].possible)
                      {
                          for (var m=0; m < (n-1); m++)
                          {
                             sorted_boxes[m].eliminatePossibility(v, 'rule3');
                          }
                          for (var m=n+1; m < 9; m++)
                          {
                             sorted_boxes[m].eliminatePossibility(v, 'rule3');
                          }
                      }
                   }
                   debug = 'Identified matching pair';
               }
           }
       }

    }
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
                    //var ntd = document.createElement('td');
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

                    //ntd.appendChild(allBoxes[p]);
                    ntr.appendChild(allBoxes[p]);
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
    do
    {
        change_occured = false;
        filter_by_defined_in_set(squares);
        filter_by_defined_in_set(rows);
        filter_by_defined_in_set(columns);
    } /* Keep going until no more changes are provoked by the rules we know */
    while (change_occured);
}




