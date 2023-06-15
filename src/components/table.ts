import { metricColor } from "../ui";

type RowContent = string | number | boolean
type Range = {min: number, max: number}

export class Table {
    tableElem: HTMLTableElement;

    headers: string[];
    rows: RowContent[][];
    ranges: Map<string, Range>;

    constructor(tableElemId: string, ranges: Map<string, Range>, headers: string[], rows: RowContent[][]) {
        this.tableElem = document.getElementById(tableElemId) as HTMLTableElement;
        this.headers = headers;
        this.rows = rows;
        this.ranges = ranges;
    }

    setHeaders(headers: string[]) {
        this.headers = headers;
    }

    setRows(rows: RowContent[][]) {
        this.rows = rows;
    }

    addRow(row: RowContent[]) {
        this.rows.push(row);
    }

    redraw() {
        this.tableElem.innerHTML = "";

        const table = document.createElement("table");
        table.className = "table";

        const head = document.createElement("thead");
        const headRow = document.createElement("tr");
        
        let first = false;

        this.headers.forEach(header => {
            let headerCol = document.createElement("th");
            let headerDiv = document.createElement("div");
            let headerSpan = document.createElement("span");

            if(!first) headerCol.className = "rotated-text";

            headerCol.scope = "col";

            headerSpan.innerHTML = header;
            headerSpan.className = "border-bottom";


            headerDiv.appendChild(headerSpan);
            headerCol.appendChild(headerDiv);
            headRow.appendChild(headerCol);

            first = false;
        });
        head.appendChild(headRow);
        table.appendChild(head);

        this.rows.forEach(rowData => {
            let row = document.createElement("tr");

            let firstCell = document.createElement("th");
            firstCell.innerHTML = rowData[0].toString();
            firstCell.scope = "row";
            firstCell.className = "border w-25";
            row.appendChild(firstCell);
                
            var i = 1;
            this.headers.forEach(header => {
                let range = this.ranges.get(header)!;
                let data = rowData[i] as number;
                let cellContent: string = Math.round(data).toString();

                let cell = document.createElement("td");

                cell.innerHTML = cellContent;
                cell.className = "border";
                cell.style.backgroundColor = metricColor(data, unitStats.get(category)!);

                row.appendChild(cell);
                i++;
            });
            table.appendChild(row);
        });
        tableElem.appendChild(table);
    }
}