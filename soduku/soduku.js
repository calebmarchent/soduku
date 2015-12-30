
var change_occured = false;

function sodukuBox(value)
{
    var bx = document.createElement("div");
    bx.value = value ? value : null;
    bx.possibility = [];

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
    bx.poss_tbl.className += 'box';
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
 
    if (value)
    {
        bx.appendChild(document.createTextNode(bx.value ? bx.value : ''));
    }
    else
    {
        bx.appendChild(bx.poss_tbl);
    }

    bx.eliminatePossibility = function (value)
    {
        /* If the posibility was possible, we are going to clear it so enure the change is marked to trigger another itteration */
        if (this.possibility[value].possible)
        {
            change_occured = true;
            this.possibility[value].possible = false;
            this.possibility[value].className = 'notposs';

            /* Recount the number of possibilities */
            this.num_possibilies = 0;
            for (var pos=1; pos <= 9; pos++)
            {
                this.num_possibilies++;
            }

            /* If we have managed to get down on only one posibility, the value is confirmed */
            if (this.num_possibilies == 1)
            {
               this.setValue(pos);
            }
        }
    }

    bx.setValue = function (newvalue)
    {
       if (this.value != newvalue)
       {
           change_occured = true;
       }
       this.value = newvalue;
       /* Update the possibiliy flags to keep them in-sync */
       for (var pos=1; pos <= 9; pos++)
       {
           this.possibility[c].possible = this.value == pos;
       }
       this.num_possibilies = 1;
       this.className = 'onlyposs';
       this.present_value = this.replaceChild(document.createTextNode(this.value), this.childNodes[0]);
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
                     boxSet[si][ui].eliminatePossibility(v);
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
                if (!boxSet[si][bi].value && boxSet[si][bi].possibility[v].possible)
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
                occurance_loc[v].setValue(v);
            }
       }
       /* Now eliminate that value from all boxes in the sqaure */
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
    do 
    {
        change_occured = false;
        filter_by_defined_in_set(squares);
        filter_by_defined_in_set(rows);
        filter_by_defined_in_set(columns);
    } /* Keep going until no more changes are provoked by the rules we know */
    while (change_occured);
}




