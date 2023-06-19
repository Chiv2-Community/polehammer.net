import { metricColor } from "../ui";
import { Range } from "../types";
import { MetricResult } from "../metrics";

type RowContent = string | MetricResult

export class Table {
    tableElem: HTMLTableElement;

    headers: string[];
    createCell: (header: string, content: RowContent) => HTMLTableCellElement;

    constructor(tableElemId: string, createCell: (header: string, content: RowContent) => HTMLTableCellElement) {
        this.headers = []
        let maybeTableElem = document.querySelector<HTMLTableElement>(tableElemId);
        if (!maybeTableElem) {
            throw new Error("Invalid selector provided: " + tableElemId);
        }
        this.tableElem = maybeTableElem!;
        this.createCell = createCell;
    }

    setHeaders(headers: string[]) {
        this.headers = [...headers];
    }

    draw(rows: RowContent[][]) {
        this.tableElem.innerHTML = "";

        const table = document.createElement("table");
        table.className = "table";

        const head = document.createElement("thead");
        const headRow = document.createElement("tr");
        
        let first = false;

        ["", ...this.headers].forEach(header => {
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

        rows.forEach(rowData => {
            let row = document.createElement("tr");

            let firstCell = document.createElement("th");
            firstCell.innerHTML = rowData[0] as string;
            firstCell.scope = "row";
            firstCell.className = "border w-25";
            row.appendChild(firstCell);
                
            var i = 1;
            this.headers.forEach(header => {
                let cell = this.createCell(header, rowData[i]);
                row.appendChild(cell);
                i++;
            });
            table.appendChild(row);
        });
        this.tableElem.appendChild(table);
    }
}